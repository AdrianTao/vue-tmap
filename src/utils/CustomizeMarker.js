const CustomizeCover = require('../utils/CustomizeCover')

const CustomizeMarker = CustomizeCover.extend({
  setOpacity(status) {
    if (status) {
      this._div.style.display = 'block'
    } else {
      this._div.style.display = 'none'
    }
  },

  onAdd(map) {
    this.map = map
    const div = this._div = this.content
    div.style.position = 'absolute'// 必须加 否则坐标位置不对
    div.style.cursor = 'pointer'
    if (this.offset) {
      div.style.marginLeft = -this.offset[0] + 9 + 'px'
      div.style.marginTop = -this.offset[1] + 25 + 'px'
    }
    this.addEvents(div)
    this.map.getPanes().overlayPane.appendChild(div)
    this.update(this.lnglat)
  },

  // 绑定事件
  addEvents(target) {
    for (const eventName in this.events) {
      target.addEventListener(eventName, (e) => {
        window.event ? window.event.cancelBubble = true : e.stopPropagation()
        const layerPoint = new T.Point(
          Math.ceil(this.map.getSize().x / 2),
          Math.ceil(this.map.getSize().y / 2)
        )
        this.events[eventName]({
          originalEvent: e,
          layerPoint,
          lnglat: this.lnglat,
          target,
          type: eventName
        })
      })
    }
  }
})

module.exports = CustomizeMarker
