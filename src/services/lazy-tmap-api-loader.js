const DEFAULT_TMAP_CONFIG = {
  key: null,
  v: '4.0',
  protocol: 'http',
  hostAndPath: 'api.tianditu.gov.cn/api'
}

export default class TMapApiLoader {
  /**
   *
   * @param {*} config 初始化参数s
   */
  constructor(config) {
    this._config = {
      ...DEFAULT_TMAP_CONFIG,
      ...config
    }
    this._document = document
    this._window = window
  }

  load() {
    // 如果window对象上存在了T，说明script已存在，可以直接调用api
    if (Reflect.has(this._window, 'T')) {
      return Promise.resolve()
    }
    // 如果改属性已存在(promise对象)，返回改promise
    if (this._scriptLoadingPromise) {
      return this._scriptLoadingPromise
    }
    this._scriptLoadingPromise = new Promise((resolve, reject) => {
      const script = this._document.createElement('script')
      script.type = 'text/javascript'
      script.async = true
      script.defer = true
      script.src = `${this._config.protocol}://${this._config.hostAndPath}?v=${this._config.v}&tk=${this._config.key}`
      this._document.head.appendChild(script)

      script.onload = () => resolve()
      script.onerror = error => reject(error)
    })
    return this._scriptLoadingPromise
  }
}
