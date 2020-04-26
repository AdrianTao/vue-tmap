<script>
import Vue from 'vue'
import registerMixin from '../mixins/register-component'

export default {
  name: 'TInfoWindow',
  mixins: [registerMixin],
  props: [
    /* eslint-disable */
    'vid',
    'visible', // 显示隐藏
    'position', // 位置
    'content', // 信息内容
    'minWidth', // 最小宽度
    'maxWidth', // 最大宽度
    'maxHeight', // 最大高度
    'autoPan', // 是否开启信息窗口打开时地图自动移动（默认关闭）
    'closeButton', // 关闭按钮
    'offset', // 偏移量
    'autoPanPadding', // 在地图视图自动平移产生后弹出窗口和地图视图之间的边缘 (需要改进 自动转换类型)
    'closeOnClick', // 点击地图关闭
    'isCustom', // 自定义窗口
    'events'
    /* eslint-enable */
  ],
  data() {
    const self = this
    return {
      tmpVM: null,
      handlers: {
        visible(status) {
          if (self.isCustom || self.isCustom === '') {
            this.setSeen(status)
          } else if (status) {
            this.setOffset(new T.Point(0, 7)) // 通过marker打开的窗口 偏移量是正常的，重置为默认结果
            const marker = new T.Marker(this.options.lnglat)
            marker.setOpacity(0)
            self.$tmap.addOverLay(marker)
            marker.openInfoWindow(this)
            self.$tmap.removeOverLay(marker)
          } else {
            this.closeInfoWindow()
          }
        },

        position(position) {
          this.setLngLat(new T.LngLat(...position))
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
      if (this.$slots.default && this.$slots.default.length) {
        options.content = this.tmpVM.$refs.node
      }

      this.$tmapComponent = this.addInfoWindow(options)
      this.setVisible(options)
      return Promise.resolve()
    },

    addInfoWindow(options) {
      const lnglat = new T.LngLat(...options.position)
      const InfoWindowOptions = {
        ...options,
        map: this.$tmap,
        content: this.tmpVM.$refs.node,
        lnglat,
        events: this.events
      }
      let infoWin = null
      if (options.isCustom || options.isCustom === '') {
        const CustomizeInfoWindow = require('../utils/CustomizeInfoWindow')
        infoWin = new CustomizeInfoWindow(InfoWindowOptions)
      } else {
        infoWin = new T.InfoWindow(options.content, InfoWindowOptions)
        infoWin.setLngLat(lnglat)
      }

      this.$tmap.addOverLay(infoWin)
      return infoWin
    },

    setVisible(options) {
      if (options.visible === undefined) {
        return
      }
      if (options.isCustom || options.isCustom === '') {
        this.$tmapComponent.setSeen(options.visible)
      } else if (!options.visible) {
        this.$tmapComponent.closeInfoWindow()
      }
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
