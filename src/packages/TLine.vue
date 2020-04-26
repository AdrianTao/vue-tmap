<script>
import registerMixin from '../mixins/register-component'

export default {
  name: 'TLine',
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
      this.$tmapComponent = new T.Polyline(this.points, options)
      options.edit ? this.$tmapComponent.enableEdit() : this.$tmapComponent.disableEdit()
      if (options.visible !== undefined && !options.visible) {
        this.$tmapComponent.setOpacity(0)
      }

      this.$tmap.addOverLay(this.$tmapComponent)
    },

    $getBounds() {
      return this.$tmapComponent.getBounds()
    },

    // 获取长度
    $getDistance() {
      let r = 0
      for (let k = 0; k < this.points.length - 1; k++) {
        r += this.points[k].distanceTo(this.points[k + 1])
      }

      return r
    },

    $getLineStyle() {
      return {
        weight: this.$tmapComponent.getWeight(),
        lineStyle: this.$tmapComponent.LineStyle(),
        opacity: this.$tmapComponent.getOpacity(),
        color: this.$tmapComponent.getColor()
      }
    }
  },
  render(h) {
    return null
  }
}
</script>
