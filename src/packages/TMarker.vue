<script>
import Vue from 'vue'
import registerMixin from '../mixins/register-component'

export default {
  name: 'TMarker',
  mixins: [registerMixin],
  props: [
    /* eslint-disable */
    'vid',
    'visible', // 点标记是否可见
    'position', // 经纬度信息
    'offset', // 偏移量
    'size', // 尺寸
    'icon', // 图标图片
    'draggable', // 是否可拖拽
    'zIndex',
    'opacity', // 透明度
    'events', // 事件
    /* eslint-enable */
  ],
  data() {
    const self = this
    return {
      tmpVM: null,
      handlers: { // 某些prop需要特殊处理函数去改变它的值
        position(position) {
          try {
            this.setLngLat(new T.LngLat(...position))
          } catch (e) {
            // do nothing
          }
        },
        icon(src) {
          this.setIcon(new T.Icon({
            iconUrl: src,
            iconSize: new T.Point(...(self.size || [19, 27])),
            iconAnchor: new T.Point(...(self.offset || [10, 25]))
          }))
        },
        visible(statue) {
          this.setOpacity(statue ? 1 : 0)
        }
      }
    }
  },
  created() {
    this.tmpVM = new Vue({
      data() {
        return { node: '' }
      },
      render(h) {
        const { node } = this
        return h('div', { ref: 'node' }, Array.isArray(node) ? node : [node])
      }
    }).$mount()
  },
  methods: {
    __initComponent(options) {
      // 包含html片段
      if (this.$slots.default && this.$slots.default.length) {
        options.content = this.tmpVM.$refs.node
      }
      this.$tmapComponent = this.addMarkers(options)
      this.setDrag(options)
      this.setVisible(options)
      return Promise.resolve()
    },

    addMarkers(options) {
      const point = new T.LngLat(...options.position)
      const markerOptions = {
        ...options,
        map: this.$tmap,
        content: this.tmpVM.$refs.node,
        lnglat: point,
        events: this.events,
        zIndexOffset: options.zIndex,
        options: {}
      }
      let marker = null
      if (options.content) { // 自定义html
        const CustomizeMarker = require('../utils/CustomizeMarker')
        marker = new CustomizeMarker(markerOptions)
      } else if (options.icon) { // 自定义图标图片
        const icon = new T.Icon({
          iconUrl: options.icon,
          iconSize: new T.Point(...(options.size || [19, 27])),
          iconAnchor: new T.Point(...(options.offset || [10, 25]))
        })
        marker = new T.Marker(point, {
          ...markerOptions,
          icon
        })
      } else { // 默认图标
        marker = new T.Marker(point, markerOptions)
      }

      this.$tmap.addOverLay(marker)

      return marker
    },

    // 添加可拖拽特性
    setDrag(options) {
      if (!options.draggable && options.draggable !== '') { return }
      if (options.content) {
        // 自定义覆盖物由内部逻辑实现
      } else {
        this.$tmapComponent.enableDragging()
      }
    },

    // 设置可见
    setVisible(options) {
      if (options.visible === undefined) { return }
      this.$tmapComponent.setOpacity(options.visible ? 1 : 0)
    },

    // 返回标记显示时所使用的图标对象。
    $getIcon() {
      return this.$tmapComponent.getIcon()
    },

    // 返回标注所在的地理位置坐标。
    $getLngLat() {
      return this.$tmapComponent.getLngLat()
    }
  },
  render(h) {
    const slots = this.$slots.default || []
    if (slots.length) {
      this.tmpVM.node = slots
    }
    return null
  }
}
</script>
