<template>
  <div class="center-content">
    <el-card class="table_content table_content_all">
        <div class="theme">
          <div class="title">
            <span>国内疫情趋势</span>
            </div>
          <div class="time">
            <span>时间：
          <el-radio-group v-model="period" @change="timeChange" size="small">
            <el-radio-button label="今天"></el-radio-button>
            <el-radio-button label="7天"></el-radio-button>
            <el-radio-button label="14天"></el-radio-button>
            <el-radio-button label="30天"></el-radio-button>
          </el-radio-group>
          </span>
          </div>
        </div>
    <div class="tendencyCard">
      <el-tabs type="border-card">
        <el-tab-pane label="现有确诊" @click="getMap">
          <template>
            <div id="map" style="width: 600px; height: 400px;margin:auto"></div>
          </template>
          </el-tab-pane>
        <el-tab-pane label="新增确诊趋势">
          <div slot="label" @click="getOwnAck">新增确诊趋势</div>
          <template>
          <div id="ownAckChart" style="width: 600px; height: 400px;margin:auto"></div>
          </template>
        </el-tab-pane>
      </el-tabs>
      </div>
    <div class="box">
      <div class="title2">
        <span>全国风险区播报</span>
        </div>
        <el-table :data="dangerArea" strpe style="width:100%" height="250">
        <el-table-column prop="area" label="地区" align="center"></el-table-column>
        <el-table-column prop="danger" label="风险" align="center"></el-table-column>
        </el-table>
        <el-pagination
          background
          layout="prev,pager,next"
          :total="50">
          </el-pagination>
    </div>
    </el-card>
  </div>
</template>

<script>
import echarts from 'echarts'
import "echarts/map/js/china.js"
import $ from 'jquery'
// import "https://www.echartsjs.com/examples/vendors/echarts/echarts.min.js?_v_=1578305236132"
// import "https://www.echartsjs.com/examples/vendors/echarts/map/js/china.js?_v_=1578305236132"
export default {
  data() {
    return {
      period: '今天',
      dangerArea: [],
      ownAddOption:{},
      ownAckOption:{},
      ownAddChart: '',
      ownAckChart: ''
    }
  },
  component: {
  },
  mounted(){
    this.getMap()
  },
  created() {

  },
  methods: {
    getHelp(){
      this.dialogVisible= true
    },
    timeChange(){
      console.log(this.period)
    },
    getMap(){
      $.get('https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json', function (cZjson) {
        echarts.registerMap('滁州', cZjson);
        var chart = echarts.init(document.getElementById('map'));
        let option = {
            title: {
                text: '中国疫情趋势',
                x:'center'
            },
            dataRange:{
            	min:0,
            	max:500,
            	text:['高','低'],
            	realtime:true,
            	calculable:true,
            	color:['orangered','yellow','green']
            },
            series:[
            	{
            		name:'犯罪数量',
            		type:'map',
            		map:'滁州',
            		mapLocation:{
            			y:60
            		},
            		itemSytle:{
            			emphasis:{label:{show:false}}
            		},
            		data:[
            			{name:'琅琊区',value:700},
            			{name:'南谯区',value:600},
            			{name:'定远县',value:500},
            			{name:'凤阳县',value:400},
            			{name:'明光市',value:300},
            			{name:'来安县',value:200},
            			{name:'天长市',value:100}
            		]
            	}
            ],
            grid: {
              x: 50,
              y: 50,
              x2: 50,
              y2: 50,
              borderWidth: 10
            }
        };
        chart.setOption(option);
      });
    },
    getOwnAck() {
      console.log('输出一下')
      this.ownAckChart = echarts.init(document.getElementById('ownAckChart'));
      var dataAxis = [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '];
      var data = [220, 182, 191, 234, 290, 330, 310, 123, 442, 321, 90, 149, 210, 122, 133, 334, 198, 123, 125, 220];
      var yMax = 500;
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
          xAxis: {
              data: dataAxis,
              axisLabel: {
                  inside: true,
                  textStyle: {
                      color: '#fff'
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
                  animation: false
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
}
.title2{
  color:#1E1E1E;
  font-size: 20px;
  padding:3px;
  margin-top: 20px;
}
.title2 span{
  float:left;
}
.box{
    display: flex;
    flex-direction:column;
}
</style>
