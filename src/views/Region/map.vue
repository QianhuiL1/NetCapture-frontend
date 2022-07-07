<template>
  <div class="home">
    <div>
      <ul class="menu">
        <li
          class="menu-item"
          :class="[menuIndex == 'region' ? 'active' : '']"
          @click="
            menuIndex = 'region';
            initMap();
            setRegion();
          "
        >
          重点地区
        </li>
        <li
          class="menu-item"
          :class="[menuIndex == 'track' ? 'active' : '']"
          @click="
            menuIndex = 'track';
            initMap();
            setLine();
          "
        >
          重点轨迹
        </li>
        <li
          class="menu-item"
          :class="[menuIndex == 'dataPanel' ? 'active' : '']"
          @click="
            menuIndex = 'dataPanel';
            initMap();
          "
        >
          数据面板
        </li>
      </ul>
    </div>
    <dataPanel v-if="menuIndex === 'dataPanel'" style="z-index: 1001" />
    <div id="map"></div>
    <aside class="asideRight weather">
      <el-table v-if="menuIndex == 'region'" :data="regionList" height="100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" class="demo-table-expand">
              <el-form-item>
                <span style="padding-left: 50px; font-weight: 800"
                  >所属行政区 :
                </span>
                <span>{{ props.row.area }}</span>
              </el-form-item>
              <el-form-item>
                <span style="padding-left: 80px; font-weight: 800"
                  >更新时间 :
                </span>
                <span>{{ props.row.lastupdatetime }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          label="重点地区"
          prop="address"
        />
        <el-table-column
          label="防控级别"
          prop="level"
          align="center"
        />
        <el-table-column
          label="操作"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              style="height: 28px; width: 60px"
              @click="setMarker(scope.row)"
              >查看</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-table v-if="menuIndex == 'track'" :data="travelData" height="100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" class="demo-table-expand">
              <el-form-item>
                <span style="padding-left: 50px; font-weight: 800"
                  >重点人员 :
                </span>
                <span>{{ props.row.name }}</span>
              </el-form-item>
              <el-form-item>
                <span style="padding-left: 80px; font-weight: 800"
                  >到达时间 :
                </span>
                <span>{{ props.row.arriveTime }}</span>
              </el-form-item>
              <el-form-item>
                <span style="padding-left: 110px; font-weight: 800"
                  >离开时间 :
                </span>
                <span>{{ props.row.leftTime }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          label="轨迹地点"
          prop="address"
        />
        <el-table-column
          label="到达时间"
          prop="arriveTime"
          align="center"
        />
        <el-table-column
          label="操作"
          align="center"
          style="width: 100px !important"
        >
          <template slot-scope="scope">
            <el-button
            v-if="menuIndex == 'track'"
              style="height: 28px; width: 60px"
              @click="moveTo(scope.row)"
              >查看</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </aside>
  </div>
</template>
<script>
import { travelList } from "../../api/People/travel/basic";
import dataPanel from "@/components/dataPancel";
import { infectInfo, infectList } from "../../api/People/infect/basic";
import { regionList } from "../../api/Region/basic";
const AMap = window.AMap;
export default {
  name: "Map",
  mounted() {
    // 初始化地图页面
    this.initMap();
    this.initData();
  },
  components: {
    geoCoder: "",
    dataPanel,
  },
  data() {
    return {
      address: "",
      asideRightSwitch: true,
      menuIndex: "region",
      count: true,
      regionList: [],
      map: null,
      lineArr: [],
      spot: {
        travelId: "",
        address: "",
        arriveTime: "",
        leftTime: "",
      },
      loading: false,
      travelData: [],
      district: [],
      districtOption: "",
      cityType: [
        {
          value: "#EDCA3E",
          label: "一级防控区",
        },
        {
          value: "#9454D6",
          label: "二级防控区",
        },
      ],
      polygons: [],
      polylines: [],
      path: [],
      infoWindow: null,
      regions: [],
      texts: [],
      marker: null,
      points:[]
    };
  },
  methods: {
    initData() {
      const this_ = this;
      travelList().then((response) => {
        this.travelData = response.rows;
        this.travelData.forEach((item) => {
          infectInfo(item.peopleId).then((res) => {
            item.name = res.data.name;
          });
          this.geoCoder.getLocation(item.address, function (status, result) {
            if (status === "complete" && result.geocodes.length) {
              item.location = result.geocodes[0].location;
            }
          });
        });
      });
      regionList().then((response) => {
        this.regionList = response.rows;
        this.regionList.forEach((item) => {
          item.level =
            item.risklevel == 2
              ? "高风险地区"
              : item.risklevel == 1
              ? "中风险地区"
              : "低风险地区";
              if(this_.regions.indexOf(item.area) == -1)
              this_.regions.push(item.area)
        });
        this_.setRegion()
      });
    },
    initMap() {
      this.map = new AMap.Map("map", {
        resizeEnable: true,
        zoom: 10,
        mapStyle: "amap://styles/white",
        center: [114.306434, 31.9988],
      });
      this.map.plugin(["AMap.InfoWindow"], () => {});
      AMap.plugin("AMap.Geocoder", function () {});
      var geoOption = {
        city: "全国",
        citylimit: true,
      };
      this.geoCoder = new AMap.Geocoder(geoOption);
    },
    setMarker(row) {
      const this_ = this;
      this_.geoCoder.getLocation(row.address, function (status, result) {
      if (status === "complete" && result.geocodes.length) {
        var marker = new AMap.Marker({
          map:this_.map,
          icon:'//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-red.png',
          position: result.geocodes[0].location,
          offset: new AMap.Pixel(-13, -30),
        });
        this_.map.setCenter(result.geocodes[0].location)
        this_.map.setZoom(10)
        marker.content =
          "<div style='width:280px;height:130px;'>" +
          "<h4 style='font-weight:600;'>重点地区：" +
          "<span style='font-weight:200;'>" +
          row.address +
          "</span>" +
          "</h4>" +
          "<h4 style='font-weight:600;'>所属地：" +
          "<span style='font-weight:200;'>" +
          row.area +
          "</span>" +
          "</h4>" +
          "<h4 style='font-weight:600;'>防控级别：" +
          "<span style='font-weight:200;'>" +
          row.level +
          "</span>" +
          "</h4>" +
          "</div>";
        marker.on("click", showInfoP);
        var infoWindow = new AMap.InfoWindow({
            offset: new AMap.Pixel(0, -30),
          });
          infoWindow.setContent(marker.content);
          infoWindow.open(this_.map, result.geocodes[0].location);
        function showInfoP(e) {
          infoWindow.setContent(e.target.content);
          infoWindow.open(this_.map, result.geocodes[0].location);
        }
        this_.infoWindow = infoWindow
        this_.marker = marker
        marker.setMap(this_.map);
            }
          });
    },
    setRegion(){
      this.map.plugin(["AMap.DistrictSearch"], () => {});
      var opts = {
                subdistrict: 0,  
                extensions: 'all',  
                level: 'district'  
            };
      var district = new AMap.DistrictSearch(opts);
      const map = this.map
      const this_ = this
      map.setZoom(5)
      this.regions.forEach((item) => {
        var ar = item.split('省')
        item = ar[ar.length-1]
        ar = item.split('区')
        item = ar[ar.length-1]
        district.search(item, function(status, result) {
            var bounds = result.districtList[0].boundaries;
            if (bounds) {
                for (var i = 0, l = bounds.length; i < l; i++) {
                    //生成行政区划polygon
                    var polygon = new AMap.Polygon({
                        map: map,
                        strokeWeight: 1,
                        path: bounds[i],
                        fillOpacity: 0.4,
                        fillColor: '#ff0000',
                        strokeColor: '#ff0000'
                    });
                }
                this_.polygons.push(polygon);
            }
        })
        });
    },
    clearRegion() {
      const this_=this
      if(this_.marker != null){
        this_.map.remove(this_.marker)
      }
      this.polygons.forEach((item) => {
        item.setMap(null)
        this_.map.remove(item)
      })
      this.marker = null
      this.polygons = []
    },
    setLine() {
      const tmp_this = this;
      const map = this.map;
      map.setCenter(tmp_this.travelData[0].location)
      map.setZoom(13)
      this.lineArr = [];
      var point = 0;
      var record = this.travelData[0].recordId;
      var infoWindow = new AMap.InfoWindow({
        offset: new AMap.Pixel(0, -20),
      });
      this.travelData.forEach((item) => {
        const spot = item.address;
        const arriveTime = item.arriveTime;
        const leftTime = item.leftTime;
        const peopleId = item.peopleId;
        const location = item.location;
        const name = item.name;
        if (item.recordId != record) {
          point = 0;
          record = item.recordId;
          tmp_this.polyline = new AMap.Polyline({
        map: tmp_this.map,
        path: tmp_this.lineArr,
        showDir: true,
        strokeColor: "#77DDFF", // 线颜色--浅蓝色
        // strokeOpacity: 1,     //线透明度
        strokeWeight: 5, // 线宽
        // strokeStyle: "solid"  //线样式
        lineJoin: "round", // 折线拐点的绘制样式
      });
      tmp_this.polyline.show();
      tmp_this.polylines.push(tmp_this.polyline);
          tmp_this.lineArr = [];
        }
        tmp_this.lineArr.push(location);
        var text = new AMap.Text({
          text: ++point,
          anchor: "center", // 设置文本标记锚点
          // draggable: true, // 是否可移动文本
          cursor: "pointer",
          angle: 10,
          style: {
            "margin-top": "2px",
            "background-color": "#9b9a99",
            opacity: "1",
            "border-width": 0,
            "text-align": "center",
            "font-size": "20px",
            color: "#fff",
          },
          position: location,
        });
        text.setMap(map);
        tmp_this.texts.push(text);
        var markerspot = new AMap.CircleMarker({
          center: location,
          radius: 20,
          strokeColor: "white", // 边框颜色
          strokeWeight: 2,
          strokeOpacity: 0.5,
          fillColor: "#9b9a99", // 背景色
          fillOpacity: 1, //透明度
          zIndex: 1000,
          bubble: true,
          cursor: "pointer",
          clickable: true,
        });
        markerspot.content =
          "<div style='font-size:18px; font-height:20px;'>" +
          "轨迹地点：" +
          spot +
          "<br/>" +
          "人员姓名：" +
          name +
          "<br/>" +
          "身份证号：" +
          peopleId +
          "<br/>" +
          "到达时间：" +
          arriveTime +
          "<br/>" +
          "离开时间：" +
          leftTime +
          "</div>";
        markerspot.on("mouseover", markerClick);
        markerspot.emit("mouseover", { target: markerspot });
        function markerClick(e) {
          infoWindow.setContent(e.target.content);
          infoWindow.open(map, e.target.getCenter());
          tmp_this.infoWindow = infoWindow
        }
        map.add(markerspot);
        tmp_this.points.push(markerspot);
      });
      this.polyline = new AMap.Polyline({
        map: tmp_this.map,
        path: tmp_this.lineArr,
        showDir: true,
        strokeColor: "#77DDFF", // 线颜色--浅蓝色
        // strokeOpacity: 1,     //线透明度
        strokeWeight: 5, // 线宽
        // strokeStyle: "solid"  //线样式
        lineJoin: "round", // 折线拐点的绘制样式
      });
      this.polyline.show();
      this.polylines.push(tmp_this.polyline);
    },

    clearLine() {
      // this.map.clearMap();
      const this_=this
      this.map.remove(this_.points);
      this.map.remove(this_.texts);
      this.map.remove(this_.polylines)
      this.map.remove(this_.infoWindow)
      this.polylines = []
      this.texts = []
      this.points = []
      this.lineArr = []
    },
    moveTo(row) {
      this.map.setZoom(20);
      this.map.setCenter(row.location);
    },
  },
};
</script>


<style lang="scss" scoped>
div {
  ::v-deep .info-top {
    position: relative;
    height: 45px;
    line-height: 45px;
    padding: 0 18px;
    background-color: #3288ff;
    font-size: 18px;
    font-weight: bold;
    border-radius: 5px 5px 0 0;
    div {
      display: inline-block;
      font-weight: bold;
      line-height: 45px;
      color: #fff;
      font-size: 18px;
      font-weight: bold;
    }
    img {
      position: absolute;
      top: 14px;
      right: 15px;
      cursor: pointer;
    }
  }
  ::v-deep .info-middle {
    font-size: 16px;
    padding: 16px;
    line-height: 25px;
    img {
      float: left;
      margin-right: 6px;
    }
  }
  ::v-deep .info-bottom {
    height: 0px;
    width: 100%;
    clear: both;
    text-align: center;
    img {
      position: relative;
      z-index: 104;
    }
  }
  ::v-deep .content-window-card {
    position: relative;
    box-shadow: none;
    bottom: 0;
    left: 0;
    width: auto;
    padding: 0;
    p {
      height: 2rem;
    }
  }
  ::v-deep .custom-info {
    border: solid 1px silver;
  }
  ::v-deep .input-card {
    // width: 25rem;
    border-width: 0;
    border-radius: 0.4rem;
    box-shadow: 0 2px 6px 0 rgba(114, 124, 245, 0.5);
    right: 1rem;
    -ms-flex: 1 1 auto;
    flex: 1 1 auto;
  }
}
.home {
  background-color: rgba(12, 35, 85, 0.8);
  // z-index: 1;
  height: 100%;
  // overflow: HIdden;
  .header {
    &:hover {
      cursor: pointer;
    }
    & > h1 {
      margin: 0;
      position: relative;
      z-index: 2000;
      height: 150px;
      background: url("~@/assets/topbg.png");
      background-repeat: no-repeat;
      background-size: 100%;
      line-height: 70px;
      text-align: center;
      & > span {
        display: inline-block;
        background: linear-gradient(180deg, #fff, #d66565, rgb(252, 80, 80));
        background-clip: text-box;
        color: transparent;
        -webkit-background-clip: text;
      }
    }
  }
  .menu {
    display: flex;
    justify-content: center;
    align-items: center;
    list-style: none;
    gap: 20px;
    padding: 8px 0;
    margin: 0;
    .menu-item {
      margin-top: 28px;
      z-index: 2000;
      height: 45px;
      line-height: 45px;
      padding: 0 20px;
      cursor: pointer;
      color: #e44b4b;
      border-radius: 10px;
      border: 1px solid #e44b4b;
      background-color: rgba(125, 26, 26, 0.1);
      font-size: 18px;
      font-weight: 500;
      color: #ff4b4b;
      &:hover,
      &.active {
        color: #ff4b4b !important;
        border: 1px solid #ff4b4b;
        background-color: rgba(255, 75, 75, 0.3);
        border-radius: 10px;
      }
    }
  }
  aside {
    z-index: 10;
  }
}

/* 标题样式 */
.header {
  .header__title {
    font-size: 30px;
  }
  .header__subtitle {
    font-size: 14px;
  }
}
/* 侧边样式 */
/* 左侧边样式 */
.aside {
  display: inline-block;
  position: relative;
  background-color: rgba(26, 72, 125, 0);
  padding: 0;
  left: 0;
  transition: all 0.8s;
  &.close {
    left: -300px;
  }
  .yingji_content {
    border: 1px solid #4b92e4;
    background-color: rgba(26, 72, 125, 0.2);
    border-radius: 8px;
    max-height: calc(100% - 180px);
    min-height: 40%;
    overflow-y: auto;
    padding: 40px 40px 20px 30px;
    ::v-deep .el-timeline {
      padding: 0 0 0 10px;
      font-size: 18px;
      .el-timeline-item__content,
      .el-timeline-item__timestamp,
      .el-timeline-item__node {
        font-size: 18px;
        color: #fff;
      }
      .el-timeline-item__wrapper {
        top: -7px;
      }
    }
  }
  .jianzhu_content {
    width: 300px;
    border: 1px solid #4b92e4;
    background-color: rgba(26, 72, 125, 0.2);
    border-radius: 8px;
    overflow: hidden;
    padding: 10px 20px 20px;
    ::v-deep .el-tabs__item {
      color: white;
      font-size: 18px;
    }
    ::v-deep .el-input-group {
      margin-bottom: 10px;
    }
    ::v-deep .el-tree {
      background-color: rgba(75, 255, 255, 0);
      .el-tree-node__content {
        background-color: rgba(0, 0, 0, 0) !important;
        .el-tree-node__label {
          color: #fff;
          font-size: 16px;
        }
      }
      .is-current .el-tree-node__content,
      .el-tree-node__content:hover {
        background-color: rgba(75, 255, 255, 0.2) !important;
        .el-tree-node__label {
          color: #4bffff !important;
        }
      }
      // .is-current .el-tree-node__content{
      //   background-color :rgba(0,0,0,0)!important;
      //   .el-tree-node__label{
      //     // color: #4BFFFF!important;
      //   }
      // }
    }
  }
  ::v-deep .weather_content {
    .el-tabs--card > {
      .el-tabs__header {
        border-bottom: 1px solid #4bffff;
        font-size: 18px;
        color: #105b98;
        .el-tabs__item .el-icon-close {
          font-size: 18px;
        }
        .el-tabs__nav {
          border: 1px solid #4bffff;
          border-bottom: none;
        }
        .el-tabs__item.is-active {
          font-size: 18px;
          color: #4bffff;
          border-bottom: 1px solid #4bffff;
        }
      }
    }
    table {
      border-color: #4bffff;
    }
  }
  // 按钮
  .left {
    z-index: 1;
    position: absolute;
    top: 50%;
    right: 0;
    transform: translate(100%, -50%);
    width: 23px;
    height: 64px;
    display: inline-block;
    vertical-align: middle;
    background-color: #4ba1f3;
    cursor: pointer;
    border-radius: 0 5px 5px 0;
    &.is-active {
      transform: translate(100%, -50%) rotate(180deg);
      border-radius: 5px 0 0 5px;
    }
  }
  // tab页
  ::v-deep .el-tabs__nav-wrap::after {
    background-color: transparent;
  }

  // 描述列表
  ::v-deep .el-descriptions__body {
    color: white;
    background-color: transparent !important;
  }
  ::v-deep .el-descriptions .is-bordered .el-descriptions-item__cell {
    border: 1px solid #4bffff;
    background-color: rgba(75, 255, 255, 0.05);
    font-size: 16px;
    color: #fff;
  }
}
/* 左侧边样式 */
.asideRight {
  position: fixed;
  top: calc((100% - 131px) / 2);
  right: 0;
  transform: translateY(calc(-50% + 116px));
  width: 30%;
  height: calc(calc(80% - 120px));
  background-color: rgba(0, 0, 0, 0);
  transition: right 0.8s;
  padding: 0;
  margin: 0;
  &.close {
    right: -30% !important;
  }
  .Right {
    z-index: 1;
    position: absolute;
    top: 50%;
    left: 0;
    transform: translate(-100%, -50%);
    width: 23px;
    height: 64px;
    display: inline-block;
    vertical-align: middle;
    border-radius: 5px 0 0 5px;
    background-color: #dd5043;
    cursor: pointer;
    &.is-active {
      transform: translate(-100%, -50%) rotate(180deg);
      border-radius: 0 5px 5px 0;
    }
  }
  &.weather {
    ::v-deep .el-table {
      background-color: rgba(0, 0, 0, 0);
      thead tr {
        background: rgba(150, 21, 21, 0.89);
        .el-table__cell {
          color: #fff;
          .cell {
            border-right: none;
          }
        }
      }
      .el-icon {
        transform: translateY(2px);
        color: #fff;
        margin: 0;
      }
      th.el-table__cell {
        background-color: rgba(0, 0, 0, 0);
      }
      tbody tr {
        margin: 0;
        background-color: rgba(10, 88, 154, 0);
        // background: linear-gradient(to left, rgba(10, 88, 154, 1),rgba(10, 88, 154, 0.3));
        .el-table__cell {
          color: #fff;
          padding: 5px 0 0;
          border-width: 0 !important;
          .cell {
            height: 35px;
            line-height: 35px;
            background-color: rgba(184, 42, 42, 0.6);
          }
        }
      }
      .el-table__body tr:hover > td.el-table__cell {
        background-color: rgba(226, 75, 75, 0.5) !important;
        .cell {
          background-color: rgba(221, 91, 91, 0.2);
        }
      }
      .el-table__expanded-cell,
      .el-form {
        background-color: rgba(180, 83, 83, 0.404);
        .el-form-item__content {
          background-color: rgba(185, 75, 75, 0.6);
          color: #fff;
          padding-left: 10px;
        }
        .el-form-item__content:hover {
          background-color: rgba(204, 68, 68, 0.479);
        }
        .el-form-item__label {
          padding-left: 10px;
          color: #fff;
        }
        .el-button {
          padding: 3px 10px;
        }
      }
    }
  }
  .shijian_content {
    height: 100%;
    padding: 16px;
  }
  .right-header {
    color: #fff;
    line-height: 40px;
    background: linear-gradient(
      to right,
      rgb(154, 10, 10),
      rgba(154, 10, 10, 0.1)
    );
    display: flex;
    margin-bottom: 12px;
    .header-title {
      flex: 1;
      margin: 0;
      padding-left: 16px;
    }
    .header-button {
      flex: 1;
    }
  }
  .shexiangtou {
    height: 100%;
    padding: 0 16px 0 5px;
    .el-scrollbar {
      height: 100%;
      .camera_title {
        padding: 0 0 0 16px;
        display: block;
        height: 30px;
        line-height: 30px;
        color: #fff;
        font-size: 18px;
        margin-bottom: 5px;
        background: linear-gradient(
          to top,
          rgba(10, 88, 154, 1),
          rgba(10, 88, 154, 0.1),
          rgba(10, 88, 154, 1)
        );
      }
      .camera_box {
        padding: 12px;
        border-radius: 6px;
        border: 2px solid rgb(255, 0, 0);
        margin-bottom: 5px;
      }
    }
  }
}
::v-deep .dv-scroll-board .header {
  font-size: 13px;
}

/* 地图样式 */
#map {
  position: absolute;
  top: 0px;
  bottom: 0;
  width: 100%;
  height: 100%;
}
#chart {
  z-index: 1;
  margin-top: 12px;
  background: linear-gradient(
    to bottom,
    rgba(75, 255, 255, 0.3),
    rgba(10, 88, 154, 0.1)
  );
}
/* 信息框样式 */
.detailSpan {
  span {
    margin-left: 5px;
    font-size: 11px;
  }
}
.menuSpan {
  span {
    margin-left: 5px;
    font-size: 11px;
  }
}
a {
  color: dodgerblue;
}

.el-form-item {
  margin-top: 0px;
  height: 20px;
}
// 输入框透明
::v-deep .el-input-group--append .el-input__inner {
  background-color: rgba(0, 0, 0, 0);
  border: 1px solid;
  border-right: 0px;
  border-color: #ff3333;
  color: white;
}
// 输入框按钮
::v-deep .el-input-group__append {
  background-color: rgba(0, 0, 0, 0);
  border: 1px solid;
  border-left: 0px;
  border-radius: 0px 4px 4px 0px;
  border-color: #ff3333;
  .el-icon-search {
    color: #ff3333;
  }
}
</style>
