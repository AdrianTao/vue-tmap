<script>
import registerMixin from '../mixins/register-component'

export default {
  name: 'TPolygon',
  mixins: [registerMixin],
  props: [
    /* eslint-disable */
    'vid',
    'path', // 路径二维数组
    'visible', // 是否可见
    'color', // "#0000FF"	折线颜色。
    'weight', // 3	折线的宽度，以像素为单位。
    'opacity', // 0.5	折线的透明度（范围0-1 之间）。
    'lineStyle', // "solid"	拆线的样式（solid或dashed）。
    'fillColor', // "#0000FF" 多边形填充颜色。当参数为空时，折线覆盖物将没有填充效果。
    'fillOpacity', // 0.2	多边形填充的透明度（范围0-1 之间）。
    'edit', // 是否可编辑，默认关闭
    'events'
    /* eslint-enable */
  ],
  data() {
    const self = this
    return {
      handlers: {
        path(path) {
          const pointsArr = []
          for (let i = 0; i < path.length; i += 1) {
            pointsArr.push(new T.LngLat(...path[i]))
          }
          this.setLngLats(pointsArr)
        },

        edit(status) {
          status ? this.enableEdit() : this.disableEdit()
        },

        visible(status) {
          if (status) {
            if (Reflect.has(self, 'opacity') && self.opacity !== undefined) {
              this.setOpacity(self.opacity)
            } else {
              this.setOpacity(0.5)
            }
            if (Reflect.has(self, 'fillOpacity') && self.fillOpacity !== undefined) {
              this.setFillOpacity(self.fillOpacity)
            } else {
              this.setFillOpacity(0.2)
            }
          } else {
            this.setOpacity(0)
            this.setFillOpacity(0)
          }
        }
      }
    }
  },
  computed: {
    points() {
      const pointsArr = []
      for (let i = 0; i < this.path.length; i += 1) {
        pointsArr.push(new T.LngLat(...this.path[i]))
      }

      return pointsArr
    }
  },
  methods: {
    __initComponent(options) {
      console.log(options)
      this.$tmapComponent = new T.Polygon(this.points, options)

      options.edit ? this.$tmapComponent.enableEdit() : this.$tmapComponent.disableEdit()

      if (options.visible !== undefined && !options.visible) {
        this.$tmapComponent.setOpacity(0)
        this.$tmapComponent.setFillOpacity(0)
      }

      this.$tmap.addOverLay(this.$tmapComponent)
    },

    $getBounds() {
      return this.$tmapComponent.getBounds()
    },

    $getStyle() {
      return {
        weight: this.$tmapComponent.getWeight(),
        lineStyle: this.$tmapComponent.LineStyle(),
        opacity: this.$tmapComponent.getOpacity(),
        color: this.$tmapComponent.getColor(),
        fillColor: this.$tmapComponent.getFillColor(),
        fillOpacity: this.$tmapComponent.getFillOpacity()
      }
    }
  },
  render(h) {
    return null
  }
}
</script>
