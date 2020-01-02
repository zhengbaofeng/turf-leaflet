<template>
  <div class="home">
    <div id="map"></div>
    <a class="btn" @click="addWind">添加风场</a>
  </div>
</template>

<script>
// import Map from 'ol/Map'
// import View from 'ol/View'
// import TileLayer from 'ol/layer/Tile'
// import XYZ from 'ol/source/XYZ'
import L from 'leaflet'
//  导入地图样式否则瓦片排版错误
import 'leaflet/dist/leaflet.css'
//  解决图标404问题手动导入
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
//  wind-js-leaflet风场插件
import windJsLeaflet from 'wind-js-leaflet'
//  leaflet-windy风场插件
import "leaflet-windy"

import windGbr from '@/assets/wind-gbr.json'

export default {
  name: "home",
  data () {
    return {
      //  异步是否执行成功
      isPromise: true,
      //  地图对象
      leafletMap: ''
    }
  },
  methods: {
    addWind () {
      console.log('添加风场')
    },
    initMap () {
      let url = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiemhlbmdiYW9mZW5nIiwiYSI6ImNrNGpodjM1OTEwODcza2xid2FuZGYzcHIifQ.NxGOs8MZT7cznK0TK4vgNA';
      /*
      * 设置地图默认图标
      * */

      let DefaultIcon = L.icon({
        iconUrl: icon,
        shadowUrl: iconShadow,
        //  图片大小
        iconSize:     [15, 23],
        shadowSize:   [10, 10],
        //  位置偏移
        iconAnchor:   [7, 23],
        shadowAnchor: [3, 10],
      })
      L.Marker.prototype.options.icon = DefaultIcon

      /*
      * 地图初始化
      * */

      this.leafletMap = L.map('map',{
        zoomControl: false,  //是否显示地图缩放控件
        attributionControl: true,  //地图上是否加上属性控制按钮
        dragging: true,  //地图是否可被鼠标拖动
        scrollWheelZoom: true,  //地图是否可被鼠标滚轮滚动放缩
        doubleClickZoom: true,  //地图是否可双击缩放
        trackResize: true,  //浏览器放缩时地图是否被刷新
        closePopupOnClick: true,  //点击地图消息弹出框是否被关闭
        maxZoom: 15,
        minZoom: 2,
        center: [41, 123],
        zoom: 5
      });

      /*
      * 地图事件监听
      * click, dbclick,mousedown,mouseup,mouseover,mouseout,mousemove,focus,blur,load(这些大家都知道就不介绍了)
      * contextmenu: 鼠标右键事件（可开发，难度系数>1,如可视化分析）
      * preclick: 鼠标点击之前触发。有时会在点击鼠标时，并在已存在的点击事件开始处理之前想要某件事情发生时用得到.
      * viewreset: 地图需要重绘内容时触发。（通常在地图缩放和载入时发生）
      * movestart,move,moveend: 地图窗口视图开始改变时,改变时,改变结束时触发
      * dragstart,drag,dragend: 开始拖动地图时，拖动地图时，停止拖动地图时触发
      * zoomstart,zoomend: 地图缩放开始前，缩放时触发
      * resize: 当地土大小调整时触发
      * layeradd: 当一个新的图层添加到地图上时触发.
      * layerremove: 当一些图层从地图上移除时触发.
      * baselayerchange: 当通过layer control改变基础图层时触发.
      * locationfound: 当地理寻址成功时触发（使用locate方法）
      * locationerror: 当地理寻址错误时触发（使用locate方法）
      * popupopen: 当弹出框打开时触发（使用openPopup方法）
      * popupclose: 当弹出框关闭时触发（使用closePopup方法）
      * */

      this.leafletMap.on('click', function (e) {
        //  地图点击事件
        console.log('地图点击事件', e)
      })
      //将图层加载到地图上，并设置最大的聚焦还有map样式

      // let canvasTiles = L.tileLayer.canvas();
      // canvasTiles.drawTile = function(canvas, tilePoint, zoom) {
      //   let ctx = canvas.getContext('2d');
      //   // draw something on the tile canvas
      // }

      /*
      * L.layerGroup()
      * 图层组
      * .addLayer()：将给定的图层添加到组中。
      * .removeLayer()：将给定的图层从组中移除：
      * .clearLayer()：将组中的图层清空。
      * .eachLayer()：遍历组中的图层，需选择一个符合情况的迭代函数。
      * */

      //  新建图层组
      let layerGroup = L.layerGroup()
      //  新建图层
      let layer = L.tileLayer(url, {
        id: 'mapbox.streets',
        attribution: '橡树科技',
      })
      //  图层加入组并放入地图
      layerGroup.addLayer(layer).addTo(this.leafletMap)

      /*风场数据----------------------------------*/
      console.log('风场数据')
      console.log(windJsLeaflet)
      /*
      windJsLeaflet.init({
        localMode: true,
        map: this.leafletMap,
        useNearest: false,
        timeISO: null,
        nearestDaysLimit: 7,
        displayValues: true,
        displayOptions: {
          displayPosition: 'bottomleft',
          displayEmptyString: 'No wind data'
        },
        overlayName: 'wind按钮',
        // https://github.com/danwild/wind-js-server
        errorCallback: function (err) {
          console.log(err)
        }
      });
      */
      console.log(L)
      //  leaflet-windy 风场数据图
      let windfarm = new L.WindyLayer({
        pane: "shadowPane",
        dataType: "wind",
        theme: "dark",
        isTOverlayer: true, //是否使用温度底图
        windyStaticOpts: {
          PARTICLE_LINE_LENGTH: 0.16,
          PARTICLE_LINE_WIDTH: 1,
          PARTICLE_MULTIPLIER: 0.005,
          PARTICLE_OPACITY: 1,
          PARTICLE_REDUCTION: 1.1447142425533319,
          VELOCITY_SCALE: 0.011447142425533319,
          FRAME_RATE: 15,
          FRAME_TIME: 66.66666666666667,
          MAX_PARTICLE_AGE: 90,
          MAX_TEMPERATURE_K: 317.15,
          MIN_TEMPERATURE_K: 261.15,
          PARTICLE_LINE_COLORs: ["rgb(255,255,255)"]
        }
      });
      this.leafletMap.addLayer(windfarm);
      windfarm.loadWindy(windGbr);
    },
    //  自定义异步事件
    myPromise (param) {
      return new Promise(function (resolve, reject) {
        //  异步方法
        setTimeout(function () {
          if (param) resolve(true)
          else reject(false)
        }, 2000)
      })
    }
  },
  watch: {
    leafletMap (val, oldVal) {
      console.log(val, oldVal)
    }
  },
  mounted () {
    //  初始化地图
    this.initMap()
    //  调用自定义异步事件
    this.myPromise(true).then(function () {
      console.log('执行成功')
    }).catch(function () {
      console.log('执行失败')
    })
    console.log(123)
  }
};
</script>
<style scoped lang="less">
#map {
  width: 1000px;
  height: 800px;
}
.btn {
  display: inline-block;
  height: 30px;
  margin: 5px;
  padding: 15px;
  line-height: 30px;
  text-align: center;
  border-radius: 5px;
  background: #e9e9e9;
  cursor: pointer;
  &:hover {
    background: #c3c3c3;
    color: #42b983;
  }
}
</style>
