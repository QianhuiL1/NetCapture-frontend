<template>
  <div class="home">
    <div>
      <!-- // 头部 -->
      <header class="header" >
        <h1 style="font-size: 2em;">
          <span>传染病流调信息化平台</span>
        </h1>
      </header>
       <ul class="menu">
        <li
          class="menu-item"
          :class="[menuIndex == 'event' ? 'active' : '']"
          @click="setRegion"
        >
          重点地区
        </li>
        <li
          class="menu-item"
          :class="[menuIndex == 'monitor' ? 'active' : '']"
          @click="
            menuIndex = 'monitor';
            asideLeftSwitch = true;
            asideRightSwitch = true;
            clearAllMarker();
            setBuildingMarker();
          "
        >
          轨迹路线
          <!-- loadMaterialMarker() -->
        </li>
        <li
          class="menu-item"
          :class="[menuIndex == 'dataPanel' ? 'active' : '']"
          @click="
            menuIndex = 'dataPanel';
            asideRightSwitch = false;
            asideLeftSwitch = false;
            clearAllMarker();
          "
        >
          趋势预测
        </li>
      </ul>
    </div>
    <div id="map" ></div>
  </div>
</template>
<script>
import {
  travelList,
  travelAdd,
  travelUpdate,
  travelDelete,
} from "../../api/People/travel/basic";
const AMap = window.AMap;
export default {
  name: "Map",
   mounted() {
    // 初始化地图页面
    //this.initData();
    this.initMap();
  },
   data() {
    return {
      count: true,
      peopleList: [],
      map: null,
      lineArr: [],
      new_time: "",
      new_time1: "",
      new_address: "",
      listID: "",
      centerDialogAdd: false,
      centerDialogEdit: false,
      centerDialogDel: false,
      formQuery: {
        name: "",
        id: "",
        phone: "",
        email: "",
      },
      spot: {
        travelId: "",
        address: "",
        arriveTime: "",
        leftTime: "",
      },
      isCommit: false,
      loading: false,
      tableData: [],
      district:[],
      districtOption:"",
      cityType: [
        {
          value: "#EDCA3E",
          label: "一级防控区"
        },
        {
          value: "#9454D6",
          label: "二级防控区",
          }]
          };
  },
  methods:{
    initMap() {
      this.map = new AMap.Map("map", {
        resizeEnable: true,
        zoom: 10,
        mapStyle: "amap://styles/blue",
        center: [116.491776,40.1287],
      });
      this.map.plugin(["AMap.DistrictSearch"], () => {
        var opts = {
          subdistrict: 0, //获取边界不需要返回下级行政区
          extensions: "all", //返回行政区边界坐标组等具体信息
          level: "district" //查询行政级别为 市
        };
          this.districtOption=new AMap.DistrictSearch(opts)
        })
    },
    setRegion(){
      travelList().then((response) => { 
        for(var index in response.rows){
          this.districtOption.search(response.rows[index].address, (status, result) => {
            console.log(result)
          this.showRegion(result, "#256edc")
        });
        }
  })
    },
showRegion(result, color){
  let bounds = result.districtList[0].boundaries;
      if (bounds) {
        for (let i = 0, l = bounds.length; i < l; i++) {
          //生成行政区划polygon
          let polygon = new AMap.Polygon({
            map: this.map, // 指定地图对象
            strokeWeight: 1, // 轮廓线宽度
            path: bounds[i], //轮廓线的节点坐标数组
            fillOpacity: 0.4, //透明度
            fillColor: color, //填充颜色
            strokeColor: "#256edc" //线条颜色
          });
          this.polygons.push(polygon);
        }
        // 地图自适应
        this.map.setFitView();
      }
}
  }
}
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
      background: url("~@/assets/topbg.png");
      background-repeat: no-repeat;
      background-size: 100%;
      line-height: 70px;
      text-align: center;
      & > span {
        display: inline-block;
        background: linear-gradient(180deg, #fff, #b6f0ed, #0ff);
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
      z-index: 2000;
      height: 45px;
      line-height: 45px;
      padding: 0 20px;
      cursor: pointer;
      color: #4b92e4;
      border-radius: 6px;
      border: 1px solid #4b92e4;
      background-color: rgba(26, 72, 125, 0.2);
      font-size: 18px;
      &:hover,
      &.active {
        color: #4bffff;
        border: 1px solid #4bffff;
        background-color: rgba(75, 255, 255, 0.2);
        border-radius: 6px;
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
    background-color: #4ba1f3;
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
        background: rgba(10, 88, 154, 1);
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
            background-color: rgba(10, 88, 154, 0.6);
          }
        }
      }
      .el-table__body tr:hover > td.el-table__cell {
        background-color: rgba(75, 255, 255, 0) !important;
        .cell {
          background-color: rgba(75, 255, 255, 0.2);
        }
      }
      .el-table__expanded-cell,
      .el-form{
        background-color: rgba(0, 0, 0, 0);
        .el-form-item{
          // margin-bottom: 0!important;
        }
        .el-form-item__content{
          background-color: rgba(10, 88, 154, 0.6);
          color: #fff;
          padding-left: 10px;
        }
        .el-form-item__content:hover{
          background-color: rgba(75, 255, 255, 0.2);
        }
        .el-form-item__label{
          padding-left: 10px;
          color: #fff;
        }
        .el-button{
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
      rgba(10, 88, 154, 1),
      rgba(10, 88, 154, 0.1)
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
        border: 2px solid rgba(10, 88, 154, 1);
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
  border-color: #3388ff;
  color: white;
}
// 输入框按钮
::v-deep .el-input-group__append {
  background-color: rgba(0, 0, 0, 0);
  border: 1px solid;
  border-left: 0px;
  border-radius: 0px 4px 4px 0px;
  border-color: #3388ff;
  .el-icon-search {
    color: #3388ff;
  }
}
</style>
