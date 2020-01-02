<template>
  <div class="turf">
    <div id="map"></div>
  </div>
</template>

<script>
import * as turf from "@turf/turf";
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
export default {
  name: "turf",
  data () {
    return {
      //  异步是否执行成功
      isPromise: true
    }
  },
  methods: {
    initMap () {
      var url = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiemhlbmdiYW9mZW5nIiwiYSI6ImNrNGpodjM1OTEwODcza2xid2FuZGYzcHIifQ.NxGOs8MZT7cznK0TK4vgNA';
      /*设置地图默认图标----------------------------------*/
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
      /*地图----------------------------------*/
      let leafletMap = L.map('map').setView([41, 123], 5);
      //将图层加载到地图上，并设置最大的聚焦还有map样式
      L.tileLayer(url, {
        maxZoom: 15,
        minZoom: 2,
        id: 'mapbox.streets',
        attribution: '橡树科技'
      }).addTo(leafletMap);
      /*加载标记----------------------------------*/
      L.marker([41, 123]).addTo(leafletMap).bindPopup("<b>Hello world!</b><br />marke弹窗.").openPopup()
      /*加载点----------------------------------*/
      L.circle([41, 123], 500, {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5
      }).addTo(leafletMap).bindPopup("I am a circle.")
      /*增加多边形----------------------------------*/
      L.polygon([
        [41, 123],
        [39, 121],
        [41, 126]
      ]).addTo(leafletMap).bindPopup("I am a polygon.");
      //  为点击地图的事件 增加popup
      let popup = L.popup()
      function onMapClick(e) {
        popup.setLatLng(e.latlng).setContent("You clicked the map at " + e.latlng.toString()).openOn(leafletMap)
      }
      leafletMap.on('click', onMapClick)
      /*添加线----------------------------------*/
      L.polyline([
        [42, 123],
        [38, 121],
        [40, 126]
      ], {color: 'red'}).addTo(leafletMap)
      /*自定义GEOJSON----------------------------------*/
      let myLines = [{
        'type': 'LineString',
        'coordinates': [[114.587402, 40.979898], [117.026367, 38.839708], [121.750488, 37.177826]]
      }, {
        'type': 'LineString',
        'coordinates': [[114.587402, 41.979898], [117.026367, 39.839708], [121.750488, 38.177826]]
      }]
      /*地图添加geoJson数据----------------------------------*/
      L.geoJSON(myLines, {
        style: {
          'color': '#ff7800',
          'weight': 5,
          'opacity': 0.65
        }
      }).addTo(leafletMap);
      /*风场数据----------------------------------*/
      console.log('风场数据')
      console.log(windJsLeaflet)

      windJsLeaflet.init({
        localMode: true,
        map: leafletMap,
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
      /*
      *贝塞尔曲线
      *创建圆滑bezier曲线
      * */
      console.log('贝塞尔曲线')
      //  创建线
      let line = turf.lineString([
        [-76.091308, 18.427501],
        [-76.695556, 18.729501],
        [-76.552734, 19.40443],
        [-74.61914, 19.134789],
        [-73.652343, 20.07657],
        [-73.157958, 20.210656]
      ]);
      //  线转换bezier geoJson
      let curved = turf.bezierSpline(line)
      //  地图添加geoJson
      L.geoJSON(curved).addTo(leafletMap)


      /*
      * MEASUREMENT
      * 测量
      * ---------------------------start----------------------------
      * */

      /*
      * along
      * 一条线的沿途创建一个点
      * */
      line = turf.lineString([[-83, 30], [-84, 36], [-78, 41]]);
      L.geoJSON(line).addTo(leafletMap)
      //  units:单位 radians 弧度 miles 英里 kilometers 千米
      let options = {units: 'miles'};
      //  线 距离 单位
      let along = turf.along(line, 200, options);
      L.geoJSON(along).addTo(leafletMap)
      /*
      * area
      * 创建一个面并返回面积
      * 返回值： number 平方米
      * */
      let polygon = turf.polygon([[[125, -15], [113, -22], [154, -27], [144, -15], [125, -15]]]);
      L.geoJSON(polygon).addTo(leafletMap)
      let area = turf.area(polygon);
      console.log('覆盖区域面积为:' + area + '平方米')
      /*
      * bbox
      * 创建一个折线并返回折线所在的正方形区域
      * 返回值： 返回正方形所在的minX, minY, maxX, maxY 区域坐标
      * */
      line = turf.lineString([[-74, 40], [-78, 42], [-82, 35]]);
      L.geoJSON(line).addTo(leafletMap)
      let bbox = turf.bbox(line);
      console.log('bbox 折线所在区域minX, minY, maxX, maxY：' + bbox)
      let bboxPolygon = turf.bboxPolygon(bbox)
      L.geoJSON(bboxPolygon).addTo(leafletMap)

      /*
      * MEASUREMENT
      * 测量
      * ---------------------------end----------------------------
      * */
    }
  },
  mounted () {
    //  初始化地图
    this.initMap()
  }
};
</script>
<style scoped lang="less">
#map{
  width: 1000px;
  height: 800px;
}
</style>
