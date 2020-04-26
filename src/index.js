import {
  initTMapApiLoader,
  lazyTMapApiLoaderInstance
} from './services/injected-tmap-api-instance'
import TMapManager from './manager/TMapManager'

import TMap from './packages/TMap.vue'
import TMarker from './packages/TMarker.vue'
import TInfoWindow from './packages/TInfoWindow.vue'
import TLine from './packages/TLine.vue'
import TPolygon from './packages/TPolygon.vue'
import TMarkerClusterer from './packages/TMarkerClusterer.vue'
import TText from './packages/TText.vue'

const components = [
  TMap,
  TMarker,
  TInfoWindow,
  TLine,
  TPolygon,
  TMarkerClusterer,
  TText
]

const VueTMap = {}

VueTMap.install = (Vue, config) => {
  components.map(_component => {
    Vue.component(_component.name, _component)
  })

  initTMapApiLoader(config)
}

export default VueTMap
export {
  TMapManager,
  lazyTMapApiLoaderInstance
}
