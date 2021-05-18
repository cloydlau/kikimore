import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
import './index.scss'
import { isPlainObject } from 'lodash-es'

function success (config: any) {
  return Swal.fire({
    titleText: config?.titleText || (typeof config === 'string' ? config : '操作成功'),
    icon: 'success',
    timer: 2000,
    showConfirmButton: false,
    ...isPlainObject(config) ? config : null,
  })
}

function info (config: any = {}) {
  let titleText
  if (typeof config === 'string') {
    titleText = config
    config = {}
  } else if (config) {
    titleText = config.titleText
  }

  return Swal.fire({
    titleText,
    icon: 'info',
    timer: 2000,
    toast: true,
    showConfirmButton: false,
    ...config,
  })
}

function warning (config: any = {}) {
  let titleText
  if (typeof config === 'string') {
    titleText = config
    config = {}
  } else if (config) {
    titleText = config.titleText
  }

  return Swal.fire({
    titleText,
    icon: 'warning',
    timer: 3000,
    toast: true,
    ...config,
  })
}

function error (cfg: string | object) {
  return Swal.fire({
    icon: 'error',
    timer: 5000,
    allowOutsideClick: false,
    allowEscapeKey: true,
    ...typeof cfg === 'string' ? { titleText: cfg } : cfg
  })
}

function confirm (config: any = {}, force: boolean = false) {
  return new Promise((resolve, reject) => {
    let titleText
    if (typeof config === 'string') {
      titleText = config
      config = {}
    } else if (config) {
      titleText = config.titleText
    }

    Swal.fire({
      titleText,
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      showCancelButton: !force,
      ...force && {
        allowOutsideClick: false,
        allowEscapeKey: false,
      },
      ...config,
    }).then((e: any) => {
      e.isConfirmed ? resolve(e) : reject(e)
    })
  })
}

Swal.success = success
Swal.warning = warning
Swal.info = info
Swal.error = error
Swal.confirm = confirm

export {
  success, warning, info, error, confirm
}

export default Swal
