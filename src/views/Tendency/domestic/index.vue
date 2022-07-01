<template>
<div class="home_container">
  <div class="center-content">
    <el-card class="table_content">
        <div class="theme">
          <div class="title">
            <span>国内疫情趋势</span>
            </div>
        </div>
    <div class="tendencyCard">
      <el-col :span="12">
      <div class="lmap">
          <template>
            <div id="map" style="width:700px;height: 600px;margin: 0 auto"></div>
          </template>
          </div>
          </el-col>
          <el-col :span="12">
          <div class="rmap">
            <template>
            <div id="ownAckChart" style="width:650px;height: 600px;margin: 0 auto"></div>
            </template>
          </div>
          </el-col>
      </div>
    </el-card>
  </div>
    <div class="center-content">
    <el-col :span="12">
      <el-card class="table_content table_content_all">
        <div slot="header">
          <span>疫情速报</span>
        </div>
        <el-table
          v-loading="loading"
          :data="quickInfo"
          :cell-style="cellStyle"
          highlight-current-row>
          <el-table-column
          align="center"
            label="地区"
            prop="area"
            :show-overflow-tooltip="true"
            >
            </el-table-column>
          <el-table-column
            align="center"
            label="新增本土"
            prop="ownAdd"
            :show-overflow-tooltip="true"
            >
            </el-table-column>
          <el-table-column
            align="center"
            label="新增无症状"
            prop="healthyAdd"
            :show-overflow-tooltip="true"
            >
            </el-table-column>
            <el-table-column
            align="center"
            label="风险区域"
            prop="dangerArea"
            :show-overflow-tooltip="true"
            >
            </el-table-column>
        </el-table>
      </el-card>
      </el-col>
      <el-col :span="12">
      <el-card class="table_content table_content_all">
        <div slot="header">
          <span>风险地区</span>
        </div>
        <el-table
          v-loading="loading"
          :data="dangerData"
          :cell-style="cellStyle"
          highlight-current-row
          >
          <el-table-column
            align="center"
            label="风险等级"
            prop="level"
           :show-overflow-tooltip="true"
            >
            </el-table-column>
          <el-table-column
            align="center"
            label="地区"
            prop="area"
           :show-overflow-tooltip="true"
            >
            </el-table-column>
        </el-table>
      </el-card>
      </el-col>
    </div>
</div>
</template>

<script>
import echarts from 'echarts'
import "echarts/map/js/china.js"
import $ from 'jquery'
import {page} from '../../../api/Data/basic'
let cZjson = require("../area/area.json")

export default {
  data() {
    return {
      period: '今天',
      dangerArea: [],
      ownAddOption:{},
      ownAckOption:{},
      ownAddChart: '',
      ownAckChart: '',
      dangerArea: [
        {
          area: '内蒙古苏尼特左旗赛罕高毕苏木',
          danger: '高风险'
        },
        {
          area:'内蒙古洪格尔苏木',
          danger: '高风险'
        },
        {
          area:'北京市昌平区小汤山镇大汤山村双兴苑小区',
          danger: '高风险'
        },
        {
          area:'上海市闵行区七宝镇华四村一二街坊',
          danger: '中风险'
        },
        {
          area:'上海市静安区共和新路街道谈家桥路163弄',
          danger: '中风险'
        }
      ],
      initialArray:[
        {name:'北京',value:0},
        {name:'天津',value:0},
        {name:'上海',value:0},
        {name:'重庆',value:0},
        {name:'广东',value:0},
        {name:'福建',value:0},
        {name:'广西',value:0},
        {name:'贵州',value:0},
        {name:'甘肃',value:0},
        {name:'海南',value:0},
        {name:'安徽',value:0},
        {name:'河南',value:0},
        {name:'黑龙江',value:0},
        {name:'湖北',value:0},
        {name:'湖南',value:0},
        {name:'河北',value:0},
        {name:'江苏',value:0},
        {name:'江西',value:0},
        {name:'吉林',value:0},
        {name:'辽宁',value:0},
        {name:'宁夏',value: 0},
        {name:'内蒙古',value:0},
        {name:'青海',value:0},
        {name:'山东',value:0},
        {name:'山西',value:0},
        {name:'陕西',value:0},
        {name:'四川',value:0},
        {name:'台湾',value:0},
        {name:'西藏',value: 0},
        {name:'新疆',value:0},
        {name:'云南',value:0},
        {name:'浙江',value: 0},
        {name:'香港',value:0},
        {name:'澳门',value:0},
      ],
      dangerData:[
          {
            level: '高风险',
            area: '内蒙古锡林郭勒盟'
          },{
            level:'高风险',
            area:'北京市昌平区'
          },
          {
            level:'中风险',
            area:'上海市闵行区'
          }
        ],
        quickInfo:[
          {
            area: '北京市',
            ownAdd: 2,
            healthyAdd:7,
            dangerArea:'经济开发区'
          },
          {
            area:'上海市',
            ownAdd: 0,
            healthyAdd: 5,
            dangerArea:'七宝镇航华四村'
          }
        ]
    }
  },
  component: {
  },
  mounted(){
    this.getOwnAck()
  },
  created() {
    this.initMap()
    this.getOwnAck()
  },
  methods: {
    getHelp(){
      this.dialogVisible= true
    },
    initMap(){
      page().then(res=>{
        res.rows.forEach(item=>{
          this.initialArray.forEach(it=>{
            if(it.name==item.province){
              it.value=item.confirm
            }
          })
        })
        echarts.registerMap('滁州', cZjson);
        var chart = echarts.init(document.getElementById('map'));
        let option = {
            title: {
                text: '中国今日疫情趋势',
                x:'center'
            },
            dataRange:{
            	min:0,
            	max:20,
            	text:['高','低'],
            	realtime:true,
            	calculable:true,
            	color:['#C80E1E','#FA3939','#FBEED2']
            },
            tooltip: {
            trigger: 'item', 
            formatter: '{b}<br/>新增确诊 {c} 例'
            },
            toolbox:{
              show: false,
              orient: 'vertical',
              x:'left',
              y:'center',
              padding: 5
            },
            series:[
            	{
            		name:'国内疫情趋势',
            		type:'map',
            		map:'滁州',
                zoom: 1.2,
                roam: true,
                scaleLimit: { 
                  min: 1,
                  max: 3
                },
            		layoutCenter: ['50%', '50%'],
            		itemStyle:{
                  normal: {
                    borderColor: '#1E1E1E',
                    borderWidth: 0.5,
                    shaddowColor: '#ECF0F1'
                  },
            			emphasis:{label:{show:false}}
            		},
            		data: this.initialArray
            	}
            ],
        };
        chart.setOption(option);
      })
    },
    getOwnAck() {
      console.log('输出一下')
      this.ownAckChart = echarts.init(document.getElementById('ownAckChart'));
      var dataAxis = ['6-01', '6-02', '6-03', '6-04', '6-05', '6-06', '6-07', '6-08', '6-09', '6-10', '6-11', '6-12', '6-13', '6-14', '6-15', '6-16', '6-17', '6-18', '6-19', '6-20','6-21'];
      var data = [3, 5, 10, 40, 30, 20, 40, 20,10, 22, 3, 49, 23, 19, 13, 14, 8, 23, 25, 20];
      var yMax = 50;
      var dataShadow = [];
      for (var i = 0; i < data.length; i++) {
          dataShadow.push(yMax);
      }
      let option = {
          title: {
              text: '新增确诊趋势',
              // subtext: ''
              x: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{b}日<br/>新增 {c}   例'
          },
          xAxis: {
              data: dataAxis,
              axisLabel: {
                  inside: false,
                  textStyle: {
                      color: '#1E1E1E'
                  }
              },
              axisTick: {
                  show: false
              },
              axisLine: {
                  show: false
              },
              z: 10
          },
          yAxis: {
              axisLine: {
                  show: true
              },
              axisTick: {
                  show: true
              },
              axisLabel: {
                  textStyle: {
                      color: '#999'
                  }
              }
          },
          dataZoom: [
              {
                  type: 'inside'
              }
          ],
          series: [
              { // For shadow
                  type: 'bar',
                  itemStyle: {
                      color: 'rgba(0,0,0,0.05)'
                  },
                  barGap: '-100%',
                  barCategoryGap: '40%',
                  data: dataShadow,
                  animation: false,
                  zoom: 0.5,
              },
              {
                  type: 'bar',
                  itemStyle: {
                      color: new echarts.graphic.LinearGradient(
                          0, 0, 0, 1,
                          [
                           {offset: 0, color: '#D92121'},
                           {offset: 0.7, color: '#EC8152'},
                           {offset: 1, color: '#F9C273'}
                          ]
                      )
                  },
                  emphasis: {
                      itemStyle: {
                          color: new echarts.graphic.LinearGradient(
                              0, 0, 0, 1,
                              [
                                  {offset: 0, color: '#D92121'},
                                  {offset: 0.7, color: '#F9C273'},
                                  {offset: 1, color: '#D92121'}
                              ]
                          )
                      }
                  },
                  data: data
              }
          ]
      };
    this.ownAckChart.setOption(option)
    }
  }
}

</script>


<style lang="scss" scoped>
.home_container {
  padding: 5px 5px;
  line-height: 1;
}
  .center-content {
    margin-top: 20px;
    display: flex;
    width: 100%;
    background-color: transparent!important;
  }
  .table_content{
    display:flex;
    flex-direction: column;
    width: 100%;
    margin: 5px 10px;
  }
.theme{
    display: flex;
    flex-direction:column;
    .title{
      color:#1E1E1E;
      font-size: 20px;
      font-weight: 600;
      padding: 3px;
      flex: 5px;
      margin-top: 0px;
    }
    .title span{
      float: left;
    }
    .time{
      color:#858585;
      font-size: 15px;
      font-weight: 400;
      padding: 3px;
      flex: 10px;
      margin-top: 10px;
    }
    .time span{
      float: left;
    }
}
.tendencyCard{
  margin-top: 10px;
  display:flex;
  flex-direction:row;
  justify-content: center;
}
.title2{
  color:#1E1E1E;
  font-size: 20px;
  font-weight: 550;
  padding:2px;
}
.title2 span{
  float:left;
  margin-bottom: 20px;
}
.box{
    display: flex;
    flex-direction:column;
}
::v-deep .el-pagination.is-background .el-pager li:not(.disabled).active {
    background-color: #ff2832;
}
</style>
