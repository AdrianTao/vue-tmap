const CustomizeCover = require('../utils/CustomizeCover')

const CustomizeInfoWindow = CustomizeCover.extend({
  onAdd(map) {
    this.map = map
    const div = this._div = this.content
    div.style.position = 'absolute'// 必须加 否则坐标位置不对
    div.style.cursor = 'default'
    div.style.zIndex = 900
    if (this.offset) {
      div.style.marginLeft = (this.offset[0]) + 'px'
      div.style.marginTop = (this.offset[1]) + 'px'
    }
    this.addEvents(div)

    this.map.getPanes().overlayPane.appendChild(div)
    this.update(this.lnglat)
  },

  setSeen(status) {
    if (status) {
      this._div.style.display = 'block'
    } else {
      this._div.style.display = 'none'
    }
  }
})

module.exports = CustomizeInfoWindow
