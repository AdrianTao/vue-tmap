const CustomizeCover = T.Overlay.extend({
  initialize({ map, content, lnglat, offset, options, events }) {
    this.content = content
    this.lnglat = lnglat
    this.offset = offset
    this.events = events
    this.setOptions(options)
  },

  onAdd(map) {
    this.map = map
    const div = this._div = this.content
    div.style.position = 'absolute'// 必须加 否则坐标位置不对
    this.addEvents(div)
    this.map.getPanes().overlayPane.appendChild(div)
    this.update(this.lnglat)
  },

  // 绑定事件
  addEvents(target) {
    for (const eventName in this.events) {
      target.addEventListener(eventName, this.events[eventName])
    }
  },

  onRemove() {
    const parent = this.div.parentNode
    if (parent) {
      parent.removeChild(this.div)
      this.map = null
      this.div = null
    }
  },

  setLngLat(lnglat) {
    this.lnglat = lnglat
    this.update()
  },
  getLngLat() {
    return this.lnglat
  },
  setPos(pos) {
    this.lnglat = this.map.layerPointToLngLat(pos)
    this.update()
  },

  update() {
    const pos = this.map.lngLatToLayerPoint(this.lnglat)
    this._div.style.top = (pos.y - 36) + 'px'
    this._div.style.left = (pos.x - 11) + 'px'
  }
})

module.exports = CustomizeCover
