import upperCamelCase from 'uppercamelcase'
import CONSTANTS from '../constants'
export default {
  data() {
    return {
      unwatchFns: []
    }
  },
  mounted() {
    this.$tmap = this.$tmap || this.$parent.$tmap
    if (this.$tmap) {
      this.register()
    } else {
      this.$on(CONSTANTS.TMAP_READY_EVENT, map => {
        this.$tmap = map
        this.register()
      })
    }
  },
  destroyed() {
    this.unregisterEvents()
    if (!this.$tmapComponent) return

    this.$tmapComponent.setMap && this.$tmapComponent.setMap(null)
    this.$tmapComponent.close && this.$tmapComponent.close()
    this.$tmapComponent.editor && this.$tmapComponent.editor.close()
    this.unwatchFns.forEach(item => item())
    this.unwatchFns = []
  },
  methods: {
    // 获取改变某值的函数
    getHandlerFun(prop) {
      if (this.handlers && this.handlers[prop]) {
        return this.handlers[prop]
      }
      return this.$tmapComponent[`set${upperCamelCase(prop)}`] || this.$tmapComponent.setOptions
    },

    convertProps() {
      const props = {}
      if (this.$tmap) props.map = this.$tmap
      const { $options: { propsData = {}}} = this
      return Object.keys(propsData).reduce((res, _key) => {
        const key = _key
        props[key] = propsData[key]
        return res
      }, props)
    },

    register() {
      this.__initComponent && this.__initComponent(this.convertProps())
      this.registerEvents()
      this.setPropWatchers()
      this.registerToManager()
    },

    // 注册事件
    registerEvents() {
      for (const eventName in this.events) {
        this.$tmapComponent.addEventListener(eventName, this.events[eventName])
      }
    },

    // 删除事件
    unregisterEvents() {
      for (const eventName in this.events) {
        this.$tmapComponent.removeEventListener(eventName, this.events[eventName])
      }
    },

    registerToManager() {
      const manager = this.tmapManager || this.$parent.tmapManager
      if (manager && this.vid !== undefined) {
        manager.setComponent(this.vid, this.$tmapComponent)
      }
    },

    // 设置数据监视
    setPropWatchers() {
      const { $options: { propsData = {}}} = this

      Object.keys(propsData).forEach(prop => {
        const handleProp = prop
        const handleFun = this.getHandlerFun(handleProp)
        if (!handleFun && prop !== 'events') return

        const unwatch = this.$watch(prop, newValue => {
          if (prop === 'events') {
            this.unregisterEvents()
            this.registerEvents()
            return
          }
          if (handleFun && handleFun === this.$tmapComponent.setOptions) {
            return handleFun.call(this.$tmapComponent, newValue)
          }
          return handleFun.call(this.$tmapComponent, newValue)
        })
        // collect watchers for destroyed
        this.unwatchFns.push(unwatch)
      })
    },

    // 获取组件实例
    $getInstance() {
      return this.$tmapComponent
    }
  }
}
