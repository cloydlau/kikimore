#!/usr/bin/env node

/* const fs = require('node:fs')
const spawn = require('cross-spawn')
const { cyan, green, red } = require('kolorist')
const { deleteAsync } = require('del')
const { name } = require('../package.json') */

import fs from 'node:fs'
import process from 'node:process'
import spawn from 'cross-spawn'
import { deleteAsync } from 'del'
import { cyan, green } from 'kolorist'

// Node 14 不支持
// import packageJSON from '../package.json' assert { type: 'json' }
// const { name } = packageJSON

const name = 'faim'

async function postinstall() {
  const cwd = process.cwd()
  const isDev = process.env.INIT_CWD === cwd
  // 当前 Node.js 进程的工作目录，通常是 faim 的目录
  console.info(cyan(`[INFO] process.cwd(): ${cwd}`))
  // 最初启动 Node.js 进程时的工作目录，比如执行 ni 的目录
  console.info(cyan(`[INFO] process.env.INIT_CWD: ${process.env.INIT_CWD}`))
  const elementPlusDir = `${process.env.INIT_CWD}/node_modules/element-plus`
  const isElementPlusInstalled = fs.existsSync(elementPlusDir)

  if (isElementPlusInstalled) {
    console.info(cyan('[INFO] Patching el-upload source code'))
    const elUploadSourcePath = `${elementPlusDir}/es/components/upload/src/upload2.mjs`
    const elUploadSource = fs.readFileSync(elUploadSourcePath, 'utf-8')
    const whitespaces = elUploadSource.match(/(?<=expose\(\{)\s*/)?.[0] || '\n'
    const elUploadSourceNew = elUploadSource.replace(/expose\(\{(?!\s*uploadFiles,)/, `expose({${whitespaces}uploadFiles,`)
    if (elUploadSource !== elUploadSourceNew) {
      fs.writeFileSync(elUploadSourcePath, elUploadSourceNew)
      console.info(green('[INFO] Successfully patched el-upload source code'))
      console.info(cyan('[INFO] Vite re-bundling element-plus'))
      // Cannot delete files/directories outside the current working directory. Can be overridden with the `force` option.
      await deleteAsync([`${process.env.INIT_CWD}/node_modules/.vite/deps/element-plus.js*`], { force: true })
    }
  }
  else {
    console.info(cyan('[INFO] Element Plus not installed'))
  }

  const dir = isDev ? 'src' : 'dist'
  const formats = ['esm']
  if (!isDev) {
    formats.unshift('cjs')
  }
  const componentsRelyOnElFormDisabled = {
    cjs: ['RichText/index.js'],
    esm: ['ImageUpload/index.vue', 'Upload/index.vue', ...isDev ? ['RichText/index.ts'] : ['RichText/index.mjs']],
  }
  const useFormDisabledSources = [
    'element-plus/es/components/form/src/hooks/use-form-common-props.mjs',
    '../../use-form-common-props',
  ]
  if (isElementPlusInstalled) {
    useFormDisabledSources.reverse()
  }

  for (const format of formats) {
    for (const component of componentsRelyOnElFormDisabled[format]) {
      const componentPath = `${cwd}/${dir}/components/${component}`
      console.info(cyan(`[INFO] Patching ${componentPath}`))
      const componentSource = fs.readFileSync(componentPath, 'utf-8')
      const componentSourceNew = componentSource.replace(...useFormDisabledSources)
      fs.writeFileSync(componentPath, componentSourceNew)
      if (isDev) {
        console.info(cyan(`[INFO] Linting ${componentPath}`))
        spawn('npx', ['eslint', componentPath, '--fix'], { stdio: 'inherit' })
      }
    }
  }

  if (isDev) {
    spawn.sync('npx', ['simple-git-hooks'], { stdio: 'inherit' })
  }
  else {
    const viteCacheDir = `${process.env.INIT_CWD}/node_modules/.vite/deps/${name}`
    if (fs.existsSync(viteCacheDir)) {
      console.info(cyan(`[INFO] Vite re-bundling ${name}`))
      // Cannot delete files/directories outside the current working directory. Can be overridden with the `force` option.
      await deleteAsync([viteCacheDir], { force: true })
    }
  }
}

postinstall()
