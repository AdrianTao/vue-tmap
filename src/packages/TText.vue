<script>
import registerMixin from '../mixins/register-component'

export default {
  name: 'TText',
  mixins: [registerMixin],
  props: [
    /* eslint-disable */
    'vid',
    'visible', // 是否可见
    'position', // 经纬度信息
    'offset', // 偏移量
    'text', // 文本标注的内容。
    'title', // 文本的提示内容
    'fontSize', // 文本内容字体大小
    'fontColor', // 文字颜色。
    'backgroundColor', // 文本的背景色
    'borderLine', // 文本的边框线宽
    'borderColor', // 文本的边框颜色
    'zIndex',
    'opacity', // 透明度
    'events', // 事件
    /* eslint-enable */
  ],
  data() {
    const self = this
    return {
      handlers: { // 某些prop需要特殊处理函数去改变它的值
        position(position) {
          try {
            this.setLngLat(new T.LngLat(...position))
          } catch (e) {
            // do nothing
          }
        },

        offset(pixel) {
          console.log(pixel)
          const offset = new T.Point(...(pixel || [0, 0]))
          this.setOffset(offset)
        },

        // 文字
        text(content) {
          this.setLabel(content)
        },

        visible(status) {
          if (Reflect.has(self, 'opacity') && self.opacity !== undefined) {
            status ? this.setOpacity(self.opacity) : this.setOpacity(0)
          } else {
            status ? this.setOpacity(1) : this.setOpacity(0)
          }
        }
      }
    }
  },
  computed: {

  },
  methods: {
    __initComponent(options) {
      this.$tmapComponent = this.initText(options)
      this.setStyle(options)
      this.setVisible(options)

      return Promise.resolve()
    },

    // 初始化文字基本数据
    initText(options) {
      const position = new T.LngLat(...options.position) // 将坐标数据转为天地图坐标对象
      const offset = new T.LngLat(...(options.offset || [0, 0]))
      const textOptions = {
        text: this.text,
        position,
        offset,
        events: this.events
      }
      const text = new T.Label(textOptions)
      this.$tmap.addOverLay(text)

      return text
    },

    // 设置外观
    setStyle(options) {
      for (const key in options) {
        switch (key) {
          case 'title':
            this.$tmapComponent.setTitle(options[key])
            break
          case 'fontSize':
            this.$tmapComponent.setFontSize(options[key])
            break
          case 'fontColor':
            this.$tmapComponent.setFontColor(options[key])
            break
          case 'backgroundColor':
            this.$tmapComponent.setBackgroundColor(options[key])
            break
          case 'borderLine':
            this.$tmapComponent.setBorderLine(options[key])
            break
          case 'borderColor':
            this.$tmapComponent.setBorderColor(options[key])
            break
        }
      }
    },

    // 设置可见
    setVisible(options) {
      if (options.visible === undefined) { return }
      this.$tmapComponent.setOpacity(options.visible ? 1 : 0)
    },

    // 返回标注所在的地理位置坐标。
    $getLngLat() {
      return this.$tmapComponent.getLngLat()
    }
  },
  render(h) {
    return null
  }
}
</script>
