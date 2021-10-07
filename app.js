// app.js

import { promisifyAll } from 'wx-promise-pro'
// https://github.com/youngjuning/wx-promise-pro
import { updataInit } from 'wx-updata'
// https://github.com/SHERlocked93/wx-updata

promisifyAll()
updataInit()

App({
  onLaunch() {
    wx.pro.getSystemInfo().then(console.log)
    Page = updataInit(Page, { debug: true })
  },
})
