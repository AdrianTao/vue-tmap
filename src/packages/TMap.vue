<template>
  <div class="tmap-container">
    <div class="tmap" />
    <slot />
  </div>
</template>

<script>
import { lazyTMapApiLoaderInstance } from '../services/injected-tmap-api-instance'
import registerMixin from '../mixins/register-component'
import CONSTANTS from '../constants'
import guid from '../utils/guid'

export default {
  name: 'TMap',
  mixins: [registerMixin],

  props: [
    /* eslint-disable */
    'vid',// id标识符
    'center', // 中心点
    'zoom', // 缩放等级
    'minZoom', // 最大缩放
    'maxZoom', // 最小缩放
    'dragDisable', // 禁用拖拽
    'zoomDisable', // 禁用缩放
    'keyboardDisable', // 禁用键盘
    'maxBounds', // 地图显示范围
    'projection', // 地图的投影方式
    'mapStyle',// 样式
    'events', // 事件
    'tmapManager'
    /* eslint-enable */
  ],
  data() {
    const self = this
    return {
      handlers: { // 某些prop需要特殊处理函数去改变它的值
        center(position) { // 解决zoom和center同时改变的bug
          const zoom = self.zoom
          this.centerAndZoom(new T.LngLat(...position), zoom)
          if (self.maxBounds) {
            self.setMapBounds(self.maxBounds)
          }
        },
        zoom(zoom) { // 同center
          const position = self.center
          this.centerAndZoom(new T.LngLat(...position), zoom)
          if (self.maxBounds) {
            self.setMapBounds(self.maxBounds)
          }
        },
        maxBounds(bounds) {
          this.setMaxBounds(
            new T.LngLatBounds(new T.LngLat(bounds[0], bounds[1])),
            new T.LngLatBounds(new T.LngLat(bounds[2], bounds[3]))
          )
        },
        dragDisable(status) {
          if (status) {
            this.disableDrag()
          } else {
            this.enableDrag()
          }
        },
        zoomDisable(status) {
          if (status) {
            this.disableScrollWheelZoom()
            this.disableDoubleClickZoom()
            this.disablePinchToZoom()
          } else {
            this.enableScrollWheelZoom()
            this.enableDoubleClickZoom()
            this.enablePinchToZoom()
          }
        },
        keyboardDisable(status) {
          if (status) {
            this.disableKeyboard()
          } else {
            this.enableKeyboard()
          }
        }
      }
    }
  },
  beforeCreate() {
    // 初始化地图之前先获取TMap的script标签创建状态（promise对象）
    this._loadPromise = lazyTMapApiLoaderInstance.load()
  },
  mounted() {
    this.createMap()
  },
  methods: {
    // 判断T是否载入MarkerClusterer，未载入则等待载入成功（天地图的MarkerClusterer类 似乎不是T同步载入的）
    isLoadClusterer() {
      return new Promise(resolve => {
        if (T.MarkerClusterer !== undefined) {
          resolve()
        }
        const id = setInterval(() => {
          if (T.MarkerClusterer !== undefined) {
            clearInterval(id)
            resolve()
          }
        }, 500)
      })
    },
    createMap() {
      // script引入完成 则开始初始化地图对象
      this._loadPromise.then(async() => {
        await this.isLoadClusterer()
        // 生成唯一标识符
        const mapElement = this.$el.querySelector('.tmap')
        const mapID = this.vid || guid()
        mapElement.id = mapID
        // 地图初始化配置
        const mapOptions = this.convertProps()
        mapOptions.projection = mapOptions.projection || 'EPSG:4326'
        mapOptions.center = new T.LngLat(...(mapOptions.center || [116.39587, 39.90933]))
        // 初始化地图
        this.$tmap = this.$tmapComponent = new T.Map(mapID, mapOptions)
        this.mapStyle && this.$tmap.setStyle(this.mapStyle) // 设置样式
        this.setMapDisable() // 设置地图禁用
        this.setMapBounds() // 地图显示范围
        if (this.tmapManager) {
          this.tmapManager.setMap(this.$tmap)
        }
        this.$emit(CONSTANTS.TMAP_READY_EVENT, this.$tmap)
        // 执行初始化方法
        if (this.events && Reflect.has(this.events, 'init')) {
          this.events.init(this.$tmap)
        }
        this.$children.forEach(component => {
          component.$emit(CONSTANTS.TMAP_READY_EVENT, this.$tmap)
        })
      })
    },

    // 设置地图禁用
    setMapDisable() {
      if (this.zoomDisable || this.zoomDisable === '') {
        this.$tmap.disableScrollWheelZoom()
        this.$tmap.disableDoubleClickZoom()
        this.$tmap.disablePinchToZoom()
      }
      if (this.dragDisable || this.dragDisable === '') {
        this.$tmap.disableDrag()
      }
      if (this.keyboardDisable || this.keyboardDisable === '') {
        this.$tmap.disableKeyboard()
      }
    },

    // 地图显示范围
    setMapBounds() {
      if (this.maxBounds) {
        this.$tmap.setMaxBounds(
          new T.LngLatBounds(
            new T.LngLat(this.maxBounds[0], this.maxBounds[1]),
            new T.LngLat(this.maxBounds[2], this.maxBounds[3])
          )
        )
      }
    }
  }
}
</script>

<style lang="scss">
.tmap-container, .tmap {
  position: absolute;
  top: 0;bottom: 0;left: 0;right: 0;

  .tdt-overlay-pane {
    z-index: 900;
  }
}
</style>
