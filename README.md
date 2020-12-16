# vue-tmap
> vue-tmap基于vue2.x和天地图的地图插件。目前正在开发中。

## 安装
```
npm install vue-tmap
```

## 开发
**运行示例:** `npm run serve`   
**打包:** `npm run lib`

## 文档
仓库地址：[http://192.168.2.61/AdrianTao/vue-tmap](http://192.168.2.61/AdrianTao/vue-tmap)   
文档：[http://192.168.2.170:4999/web/#/47?page_id=1210](http://192.168.2.170:4999/web/#/47?page_id=1210)

## TODO
* [x] 插件初始化时，生成script标签，载入天地图（@/src/services/*）
* [x] 插件内部组件获取地图实例，向外暴露地图实例（@/src/manager）
* [x] 地图组件（TMap）
* [x] 标记点组件（TMarker）
* [x] marker自定义图标和传入自定义html
* [x] 组件动态数据绑定
* [x] 标准信息窗口
* [x] 自定义信息窗口
* [x] 线段覆盖物
* [x] 多边形覆盖物
* [x] 文字覆盖物
* [ ] 圆形覆盖物
* [ ] 矩形覆盖物
* [ ] 图片覆盖物
* [x] 点聚合
* [ ] 搜索组件

## 快速上手
引入vue-tmap   
main.js
```
import Vue from 'vue'
import App from './App.vue'

import VueTMap from 'vue-tmap' // 引入天地图插件
import 'vue-tmap/lib/vue-tmap.css' // 引入样式文件

Vue.use(VueTMap, {
  key: 'd9c77c5a27476f013670171941a157c5', // 天地图的key
  v: '4.0' // 天地图的版本
})

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
```

```
<template>
  <t-map></t-map>
</template>
```

