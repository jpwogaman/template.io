const submodules = [
  require('./template-io-custom-module.js'),
  require('./mcu-ext.js')
]

module.exports = {
  init: function () {
    for (const m of submodules) {
      if (m.init) m.init()
    }
  },
  unload: function () {
    for (const m of submodules) {
      if (m.unload) m.unload()
    }
  },
  oscInFilter: function (data) {
    for (const m of submodules) {
      if (m.oscInFilter) data = m.oscInFilter(data)
      if (!data) return
    }
    return data
  },
  oscOutFilter: function (data) {
    for (const m of submodules) {
      if (m.oscOutFilter) data = m.oscOutFilter(data)
      if (!data) return
    }

    return data
  }
}
