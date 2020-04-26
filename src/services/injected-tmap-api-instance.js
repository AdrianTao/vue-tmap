let lazyTMapApiLoaderInstance = null
import TMapAPILoader from './lazy-tmap-api-loader'

export const initTMapApiLoader = (config) => {
  if (lazyTMapApiLoaderInstance) {
    return
  } else {
    lazyTMapApiLoaderInstance = new TMapAPILoader(config)
    lazyTMapApiLoaderInstance.load()
  }
}
export { lazyTMapApiLoaderInstance }
