const electron = window.require('electron')
console.log("this",this)
console.log("window",window)
console.log("electron",electron)
module.exports = {
  install: function (Vue) {
    Object.defineProperties(Vue.prototype, {
      $electron: {
        get () {
          return electron
        },
      },
    })
  },
}