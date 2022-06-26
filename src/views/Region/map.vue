<template>
  <div class="home">
    <div>
      <!-- // 头部 -->
      <header class="header" style="z-index: 2000l;">
        <h1 style="font-size: 2em;" @click="goHome">
          <span>传染病流调信息化平台</span>
        </h1>
      </header>
      <!-- 地图切换 -->
      <ul class="menu">
        <li
          class="menu-item"
          :class="[menuIndex == 'event' ? 'active' : '']"
          @click="
            menuIndex = 'event';
            asideLeftSwitch = false;
            asideRightSwitch = true;
            clearAllMarker();
            setEventMarker();
          "
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
          人员轨迹
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
          疫情预测
        </li>
      </ul>
    </div>
    <!-- 左侧框 -->
    <aside v-show="asideLeftSwitch" class="aside">
      <div v-if="menuIndex == 'event'" class="yingji_content">
        <el-scrollbar>
          <el-timeline>
            <el-timeline-item
              v-for="(log, index) in logList"
              :key="index"
              :timestamp="log.createTime"
              placement="top"
            >
              <span v-if="log.type === 11"
                ><el-link :href="log.message" target="_blank"
                  >指挥中心：图片链接</el-link
                ></span
              >
              <span v-else>
                {{
                  log.type === 5
                    ? "指挥中心：" + log.message
                    : log.type == 6
                    ? "执行者：" + log.message
                    : log.typeName
                }}
              </span>
            </el-timeline-item>
          </el-timeline>
        </el-scrollbar>
      </div>
      <div v-else-if="menuIndex != 'meteorological'" class="jianzhu_content">
        <div @click="toLeft">
          <svg
            class="left"
            :class="{ 'is-active': isActive }"
            t="1636629893737"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="2549"
            width="32"
            height="32"
          >
            <path
              d="M272.9 512l265.4-339.1c4.1-5.2 0.4-12.9-6.3-12.9h-77.3c-4.9 0-9.6 2.3-12.6 6.1L186.8 492.3c-9.1 11.6-9.1 27.9 0 39.5l255.3 326.1c3 3.9 7.7 6.1 12.6 6.1H532c6.7 0 10.4-7.7 6.3-12.9L272.9 512z"
              p-id="2550"
              fill="#13227a"
            />
            <path
              d="M576.9 512l265.4-339.1c4.1-5.2 0.4-12.9-6.3-12.9h-77.3c-4.9 0-9.6 2.3-12.6 6.1L490.8 492.3c-9.1 11.6-9.1 27.9 0 39.5l255.3 326.1c3 3.9 7.7 6.1 12.6 6.1H836c6.7 0 10.4-7.7 6.3-12.9L576.9 512z"
              p-id="2551"
              fill="#13227a"
            />
          </svg>
        </div>
        <el-tabs v-model="activeName" stretch @tab-click="handleTabClick">
          <el-tab-pane label="点位列表" name="list">
            <!-- 搜索框 -->
            <el-input
              v-model="buildingName"
              placeholder="建筑查询"
              class="input-with-select"
            >
              <el-button slot="append" icon="el-icon-search" />
            </el-input>
            <!-- 树 -->
            <el-scrollbar style="height:calc( 100vh - 320px)">
              <el-tree
                :data="data"
                :props="defaultProps"
                @node-click="handleNodeClick"
              />
            </el-scrollbar>
          </el-tab-pane>
          <el-tab-pane label="视频直播" name="live">
            <!-- 搜索框 -->
            <el-input
              v-model="buildingName"
              placeholder="建筑查询"
              class="input-with-select"
            >
              <el-button slot="append" icon="el-icon-search" />
            </el-input>
            <!-- 树 -->
            <el-scrollbar style="height:calc( 100vh - 320px)">
              <el-tree
                :data="data"
                :props="defaultProps"
                @node-click="handleNodeClick"
              />
            </el-scrollbar>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div v-else class="weather_content">
        <el-tabs
          v-model="weather"
          type="card"
          closable
          @tab-remove="
            asideLeftSwitch = false;
            map.setZoom(12);
          "
        >
          <el-tab-pane
            :label="stationAddress"
            name="weather"
            style="height:70vh"
          >
            <!-- <el-scrollbar style="height:100%"> -->
            <el-descriptions class="margin-top" :column="2" border>
              <el-descriptions-item>
                <template slot="label">
                  路面温度
                </template>
                {{
                  weatherCurrentData.SURTEMP_CURRENT_VALUE
                    ? weatherCurrentData.SURTEMP_CURRENT_VALUE + "℃"
                    : "-"
                }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  天气气温
                </template>
                {{
                  weatherCurrentData.AIRTEMP_CURRENT_VALUE
                    ? weatherCurrentData.AIRTEMP_CURRENT_VALUE + "℃"
                    : "-"
                }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  累计降雨
                </template>
                {{
                  weatherCurrentData.RAIN_CURRENT_VALUE
                    ? weatherCurrentData.RAIN_CURRENT_VALUE + "mm"
                    : "-"
                }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  积水量
                </template>
                {{
                  weatherCurrentData.WATERACCUMULATE_VALUE
                    ? weatherCurrentData.WATERACCUMULATE_VALUE + "mm"
                    : "-"
                }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  能见度
                </template>
                {{
                  weatherCurrentData.VISIBILITY_ONEMINUTE_VALUE
                    ? weatherCurrentData.VISIBILITY_ONEMINUTE_VALUE / 1000 +
                      "km"
                    : "-"
                }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  实时风速
                </template>
                {{
                  weatherCurrentData.WIND_CURRENT_SPEEDVALUE
                    ? weatherCurrentData.WIND_CURRENT_DIRVALUE +
                      " " +
                      weatherCurrentData.WIND_CURRENT_POWERVALUE +
                      "级" +
                      weatherCurrentData.WIND_CURRENT_SPEEDVALUE +
                      "m/s"
                    : "-"
                }}
              </el-descriptions-item>
            </el-descriptions>
            <div id="chart" style="width:37vw;height:50vh;" />
          </el-tab-pane>
        </el-tabs>
      </div>
    </aside>
    <!-- 右侧框 -->
    <aside v-show="asideRightSwitch" class="asideRight weather">
      <div v-if="menuIndex != 'meteorological'">
        <div @click="toRight">
          <svg
            class="Right"
            :class="{ 'is-active': isRightActive }"
            t="1636629893737"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="2549"
            width="32"
            height="32"
          >
            <path
              d="M533.2 492.3L277.9 166.1c-3-3.9-7.7-6.1-12.6-6.1H188c-6.7 0-10.4 7.7-6.3 12.9L447.1 512 181.7 851.1c-4.1 5.2-0.4 12.9 6.3 12.9h77.3c4.9 0 9.6-2.3 12.6-6.1l255.3-326.1c9.1-11.7 9.1-27.9 0-39.5z"
              p-id="8365"
            />
            <path
              d="M837.2 492.3L581.9 166.1c-3-3.9-7.7-6.1-12.6-6.1H492c-6.7 0-10.4 7.7-6.3 12.9L751.1 512 485.7 851.1c-4.1 5.2-0.4 12.9 6.3 12.9h77.3c4.9 0 9.6-2.3 12.6-6.1l255.3-326.1c9.1-11.7 9.1-27.9 0-39.5z"
              p-id="8366"
            />
          </svg>
        </div>
      </div>
      <!-- 现有事件展示框 -->
      <div v-if="menuIndex === 'meteorological'" class="shijian_content">
        <div class="right-header">
          <p class="header-title">
            更新时间<span>{{ staList.updateTime }}</span>
          </p>
          <div class="header-button">
            <el-input
              v-model="stationName"
              placeholder="站点查询"
              class="input-with-select"
              @change="stationNameChange"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="stationNameClick"
              />
            </el-input>
          </div>
        </div>
        <el-table
          :data="staList.data"
          height="50%"
          :highlight-current-row="false"
          @row-dblclick="handleWeatherClick"
        >
          <el-table-column
            label="序号"
            align="center"
            type="index"
            width="55"
          />
          <el-table-column label="站名" align="center" prop="STANAME" />
          <el-table-column
            label="气温/℃"
            align="center"
            prop="AIRTEMP_CURRENT_VALUE"
          />
          <el-table-column
            label="路面温度/℃"
            align="center"
            prop="SURTEMP_CURRENT_VALUE"
          />
          <el-table-column
            label="降雨量/mm"
            align="center"
            prop="RAIN_SUM_VALUE"
          />
          <el-table-column
            label="积水量/mm"
            align="center"
            prop="WATERACCUMULATE_VALUE"
          />
        </el-table>
        <el-table
          :data="staList.data_bridge"
          height="50%"
          style="margin-top: 12px"
          :highlight-current-row="false"
          @row-dblclick="handleWeatherClick"
        >
          <el-table-column
            label="序号"
            align="center"
            type="index"
            width="55"
          />
          <el-table-column label="站名" align="center" prop="STANAME" />
          <el-table-column
            label="气温/℃"
            align="center"
            prop="AIRTEMP_CURRENT_VALUE"
          />
          <el-table-column
            label="路面温度/℃"
            align="center"
            prop="SURTEMP_CURRENT_VALUE"
          />
          <el-table-column
            label="降雨量/mm"
            align="center"
            prop="RAIN_SUM_VALUE"
          />
          <el-table-column
            label="积水量/mm"
            align="center"
            prop="WATERACCUMULATE_VALUE"
          />
        </el-table>
      </div>
      <el-table
        class="yingji_tablecontent"
        v-if="menuIndex == 'event'"
        :data="eventList"
        height="100%"
        @row-dblclick="handleClick"
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" class="demo-table-expand">
              <el-form-item label="录入时间">
                <span>{{ props.row.createTime }}</span>
              </el-form-item>
              <el-form-item label="事件类型">
                <span>{{ props.row.typeName }}</span>
              </el-form-item>
              <el-form-item label="事件内容">
                <el-popover
                  placement="top-start"
                  width="200"
                  trigger="hover"
                  :content="props.row.description"
                >
                  <el-button slot="reference" size="small">查看</el-button>
                </el-popover>
              </el-form-item>
              <el-form-item label="应急等级">
                <span>{{ props.row.levelName }}</span>
              </el-form-item>
              <el-form-item label="处理进度">
                <span>{{ props.row.currentStatusName }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          label="事件地址"
          prop="address"
          show-overflow-tooltip
        />
        <el-table-column
          label="事件类型"
          prop="typeName"
          width="90px"
          align="center"
        />
        <el-table-column label="事件状态" width="90px" align="center">
          <template slot-scope="props">
            {{ props.row.currentStatusName }}
          </template>
        </el-table-column>
        <el-table-column label="更新时间" width="170px" align="center">
          <template slot-scope="props">
            {{ props.row.updateTime }}
          </template>
        </el-table-column>
      </el-table>
      <!-- 建筑检测的摄像头 -->
      <div v-if="menuIndex === 'monitor'" class="shexiangtou">
        <el-scrollbar>
          <div v-for="camera in camera_info" :key="camera.id">
            <span class="camera_title">{{ camera.name }}</span>
            <div class="camera_box">
              <el-image style="width: 100%;" :src="camera.url" fit="fit" />
            </div>
          </div>
        </el-scrollbar>
      </div>
    </aside>

    <!-- 数据面板 -->
    <dataPanel v-if="menuIndex === 'dataPanel'" style="z-index: 1001;" />

    <!-- 高德地图容器 -->
    <div id="map" ></div>
    <!-- 告警音 -->
    <audio id="audio" :src="alarm" />
    <!-- 分派提示框 -->
    <el-dialog title="事件分派" :visible.sync="confirmVisible" width="30%">
      <div style="font-size:20px;text-align:center;">
        <p>
          <span>
            请选择分派单位及时间
            <!-- <span>
              <b>{{ dept }}</b> </span> -->
          </span>
        </p>
        <!-- <el-button type="text">选取二级部门</el-button> -->
      </div>
      <el-form>
        <el-form-item label="发送对象" required>
          <el-cascader
            v-model="dept"
            :props="deptProps"
            :options="deptOptions"
            placeholder="请选择通知对象"
            clearable
            style="width: 78%"
          />
        </el-form-item>
        <el-form-item label="截止日期" required>
          <el-date-picker
            v-model="deadline"
            type="date"
            placeholder="选择日期"
            style="width: 78%"
          />
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="confirmVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmAssign">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import { page } from "@/api/event/basic";
// import { webSocketURL } from "@/settings";
// import {
//   WeatherList,
//   WeatherData,
//   StaList as getStaList
// } from "@/api/event/map";
// import { mapGetters } from "vuex";
// import dataPanel from "@/components/dataPancel";
// import echarts from "echarts";
// import { list as listGroup } from "@/api/system-setup/group.js";
// import { parseTime } from "@/utils/tools";
// import { addNotice } from "@/api/notice/notice";
// import jpg1 from "@/assets/bridge1.jpeg";
// import jpg2 from "@/assets/bridge2.jpeg";
// import jpg3 from "@/assets/bridge3.jpeg";
// import alarm from "@/assets/audio/alarm.mp3";
// import { materialPage, getMaterialTree } from "@/api/thirdparty";
// import { page as logPage } from "@/api/event/eventLog";
const AMap = window.AMap;
export default {
  name: "Map",
  components: {
    dataPanel
  },
  data() {
    return {
      popus:[],
      markers:[],
      alarm: alarm,
      // 气象数据
      stationName: "",
      staList: {
        updateTime: null,
        data: [],
        data_bridge: []
      },
      staListCache: {
        data: [],
        data_bridge: []
      },
      weatherInfo: {},
      weatherData: {},
      notice: {},
      // 分派提示框
      confirmVisible: false,
      // 选中的部门
      dept: "",
      // 截止日期
      deadline: null,
      // 部门属性
      deptProps: {
        multiple: true,
        value: "id",
        label: "name",
        children: "children"
      },
      deptOptions: [],
      weather: "weather",
      stationAddress: "实时监控",
      weatherCurrentData: {
        AIRTEMP_CURRENT_VALUE: null,
        RAIN_CURRENT_VALUE: null,
        RH_CURRENT_VALUE: null,
        SUB10TEMP_CURRENT_VALUE: null,
        VISIBILITY_ONEMINUTE_VALUE: null,
        WIND_CURRENT_DIRVALUE: null,
        WIND_CURRENT_POWERVALUE: null,
        WIND_CURRENT_SPEEDVALUE: null
      },
      // 当前时间
      currentTime: {
        day: null,
        hour: null
      },
      lastTime: {
        day: null,
        hour: null
      },
      weatherMaxList: [
        {
          typeName: "最小能见度",
          address: "姑嫂立交桥",
          time: "11日 18:56",
          value: "1349m"
        },
        {
          typeName: "最高路面温度",
          address: "青菱立交桥",
          time: "10日 14:11",
          value: "15.5℃"
        },
        {
          typeName: "最低路面温度",
          address: "晴川桥",
          time: "12日 05:26",
          value: "7.6℃"
        },
        {
          typeName: "最大风力",
          address: "晴川桥",
          time: "12日 13:43",
          value: "3级 5m/s"
        }
      ],
      // 当前菜单级别
      menuIndex: "event",
      // 地图对象
      map: null,
      // 检索关键字
      search: "",
      // 检索结果数据数据
      searchInfoList: [],
      // 事件列表
      eventList: [],
      // 建筑列表
      buildingList: [
        {
          name: "武汉长江大桥",
          leader: "tom",
          phone: "18236666666",
          status: "正常",
          buildTime: "1957年10月15日",
          longitude: 114.292858,
          latitude: 30.54724
        }
      ],
      // 气象节点信息
      weatherList: [],
      materialList: [],
      // 气象报警信息
      weatherWarnData: [],
      staCode: "",
      // 全局定时器
      timer: null,
      // 响应标签
      activeName: "list",
      // 筛选标签
      queryParams: {
        label: "",
        eventType: "",
        eventLevel: "",
        source: 2,
        total: 0,
        _limit: 1000
      },
      isCollapse: false,
      // left状态
      isActive: false,
      // right按钮状态
      isRightActive: false,
      // asideLeft开关
      asideLeftSwitch: false,
      // asideRight开关
      asideRightSwitch: true,
      // 左侧输入框绑定数据
      buildingName: "",
      // 树相关
      data: [
        {
          label: "桥梁",
          children: [
            {
              label: "武昌区",
              children: [
                {
                  label: "武汉长江大桥"
                },
                {
                  label: "武汉长江二桥"
                }
              ]
            },
            {
              label: "洪山区",
              children: []
            }
          ]
        },
        {
          label: "隧道",
          children: [
            {
              label: "武昌区"
            },
            {
              label: "洪山区"
            }
          ]
        },
        {
          label: "垃圾场",
          children: [
            {
              label: "武昌区"
            },
            {
              label: "洪山区"
            }
          ]
        }
      ],
      defaultProps: {
        children: "children",
        label: "label"
      },
      // 暂时的摄像头图片
      camera_info: [
        {
          id: 1,
          url: jpg1,
          name: "摄像头1"
        },
        {
          id: 2,
          url: jpg2,
          name: "摄像头2"
        },
        {
          id: 3,
          url: jpg3,
          name: "摄像头3"
        }
      ],
      logList: [],
      showYingji: false
    };
  },
  computed: {
    ...mapGetters(["permission_routes"])
  },
  watch: {
    eventList: {
      handler() {
       this.flushMarker();
      },
      deep: true
    },
    menuIndex(newVal, oldVal) {
      if (newVal === "monitor") {
        const asideRight = document.querySelector(".asideRight");
        if (asideRight.classList.contains("weather")) {
          asideRight.classList.remove("weather");
        }
        const aside = document.querySelector(".aside");
        if (aside.classList.contains("weather")) {
          aside.classList.remove("weather");
        }
      } else if (newVal === "event") {
        const aside = document.querySelector(".aside");
        if (aside.classList.contains("weather")) {
          aside.classList.remove("weather");
        }
        const asideRight = document.querySelector(".asideRight");
        if (!asideRight.classList.contains("weather")) {
          asideRight.classList.toggle("weather");
        }
        if (aside.classList.contains("close")) {
          aside.classList.remove("close");
        }
      } else {
        const asideRight = document.querySelector(".asideRight");
        if (!asideRight.classList.contains("weather")) {
          asideRight.classList.toggle("weather");
        }
        if (asideRight.classList.contains("close")) {
          asideRight.classList.remove("close");
        }
        const aside = document.querySelector(".aside");
        if (!aside.classList.contains("weather")) {
          aside.classList.toggle("weather");
        }
      }
    }
  },
  mounted() {
    // 初始化地图页面
    this.initData();
    this.initMap();
    this.initWeatherData();
    this.timer = setInterval(this.initWeatherData, 1000 * 60 * 10);
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods:{

  }
}
</script>

<style lang="scss" scoped>
div {
  #app {
    width: 100vw;
    overflow: hidden;
  }
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
  z-index: 1;
  height: 100%;
  overflow: HIdden;
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
