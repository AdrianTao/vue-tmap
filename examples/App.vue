<template>
  <div id="app">
    <t-map
      :center="center"
      :zoom="16"
      :events="events.map"
      :tmap-manager="tmapManager"
    >
      <t-text
        :text="name"
        :visible="visible"
        :position="center"
        :title="'cool'"
        :font-size="20"
        :offset="offset"
        :background-color="'rgba(0,0,0,0)'"
        :border-line="0"
        :border-color="'rgba(0,0,0,0)'"
        :events="events.text"
      />
    </t-map>
  </div>
</template>

<script>
// 引入地图对象管理 绑定在tmap组件后，可通过访问该对象获取地图实例
import { TMapManager } from '../src/index'
const tmapManager = new TMapManager()

export default {
  name: 'App',
  data() {
    return {
      tmapManager,
      visible: true,
      name: '陶俊',
      center: [121.02229, 27.93748],
      offset: [100, 100],
      events: {
        map: {
          init: (o) => {
            console.log('init', o)
          },

          click: (e) => {
            console.log('点击了map', e)
          }
        },

        text: {
          click: () => {
            console.log('点击了text')
          }
        }
      }
    }
  },
  mounted() {
    // setTimeout(() => {
    //   this.center = [116.066236, 40.08307]
    // }, 5000)
  },
  methods: {

  }
}
</script>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

