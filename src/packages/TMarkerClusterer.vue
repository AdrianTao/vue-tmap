<script>

import Vue from 'vue'
import registerMixin from '../mixins/register-component'

export default {
  name: 'TMarkerClusterer',
  mixins: [registerMixin],
  props: [
    /* eslint-disable */
    'vid',
    'markers', // 标记点位置数组
    'offset', // 偏移量
    'size', // 尺寸
    'icon', // 图标图片
    'zIndex',
    'opacity', // 透明度
    'events', // 事件

    'styles', // 自定义聚合后的图标风格，
    'girdSize', // 聚合计算时网格的像素大小，默认60
    'maxZoom'
    /* eslint-enable */
  ],
  data() {
    const self = this
    return {
      options: null,
      tmpVM: null,
      handlers: {
        markers(markers) {
          this.clearMarkers()
          const arr = []

          for (let i = 0; i < markers.length; i++) {
            const point = new T.LngLat(...markers[i].position)
            const markerOptions = {
              map: self.$tmap,
              content: self.tmpVM.$refs.node,
              lnglat: point,
              events: markers[i].events,
              zIndexOffset: markers[i].zIndex,
              options: {}
            }
            let marker = null
            if (markers[i].icon) { // 自定义图标图片
              const icon = new T.Icon({
                iconUrl: markers[i].icon,
                iconSize: new T.Point(...(markers[i].size || [19, 27])),
                iconAnchor: new T.Point(...(markers[i].offset || [10, 25]))
              })
              marker = new T.Marker(point, {
                ...markerOptions,
                icon
              })
            } else { // 默认图标
              marker = new T.Marker(point, markerOptions)
            }

            // 新增事件
            for (const eventName in markers[i].events) {
              marker.addEventListener(eventName, markers[i].events[eventName])
            }

            arr.push(marker)
          }
          this.addMarkers(arr)
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
    register() {
      this.__initComponent && this.__initComponent(this.convertProps())
      // this.registerEvents()
      this.setPropWatchers()
      this.registerToManager()
    },

    __initComponent(options) {
      this.options = options
      // 包含html片段
      if (this.$slots.default && this.$slots.default.length) {
        options.content = this.tmpVM.$refs.node
      }

      this.$tmapComponent = this.addMarkers(options)
      if (options.maxZoom) {
        try {
          this.$tmapComponent.setMaxZoom(options.maxZoom)
        } catch (e) {
          //
        }
      }
      return Promise.resolve()
    },

    addMarkers(options) {
      const markers = []
      for (let i = 0; i < options.markers.length; i++) {
        const point = new T.LngLat(...options.markers[i].position)
        const markerOptions = {
          map: this.$tmap,
          content: this.tmpVM.$refs.node,
          lnglat: point,
          events: options.markers[i].events,
          zIndexOffset: options.markers[i].zIndex,
          options: {}
        }
        let marker = null
        if (options.icon) { // 自定义图标图片
          const icon = new T.Icon({
            iconUrl: options.markers[i].icon,
            iconSize: new T.Point(...(options.markers[i].size || [19, 27])),
            iconAnchor: new T.Point(...(options.markers[i].offset || [10, 25]))
          })
          marker = new T.Marker(point, {
            ...markerOptions,
            icon
          })
        } else { // 默认图标
          marker = new T.Marker(point, markerOptions)
        }

        for (const eventName in options.markers[i].events) {
          marker.addEventListener(eventName, options.markers[i].events[eventName])
        }

        markers.push(marker)
      }

      const MarkerClustererOptions = {
        ...options,
        markers
      }

      return new T.MarkerClusterer(this.$tmap, MarkerClustererOptions)
    }

    // $getClustersCount() {
    //   return this.$tmapComponent.getClustersCount()
    // },

    // $clearMarkers() {
    //   return this.$tmapComponent.clearMarkers()
    // },

    // // 获取网格大小
    // $getGridSize() {
    //   return this.$tmapComponent.getGridSize()
    // },

    // // 获取所有的标记数组
    // $getMarkers() {
    //   return this.$tmapComponent.getMarkers()
    // },

    // $getMaxZoom() {
    //   return this.$tmapComponent.getMaxZoom()
    // },

    // $getMinClusterSize() {
    //   return this.$tmapComponent.getMinClusterSize()
    // },

    // $getStyles() {
    //   return this.$tmapComponent.getStyles()
    // }
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
