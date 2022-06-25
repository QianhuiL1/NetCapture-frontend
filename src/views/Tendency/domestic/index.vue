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
    </el-card>
  </div>
    <div class="box">
      <el-card class="table_content">
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
      </el-card>
    </div>
</div>
</template>

<script>
import echarts from 'echarts'
import "echarts/map/js/china.js"
import $ from 'jquery'

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
      ]
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
            	max:100,
            	text:['高','低'],
            	realtime:true,
            	calculable:true,
            	color:['#C80E1E','#FA3939','#FBEED2']
            },
            tooltip: {
            trigger: 'item',
            formatter: '{b}<br/>新增 {c}   例'
            },
            toolbox:{
              show: true,
              orient: 'vertical',
              left:'right',
              top:'center',
              Location: {
                y:100,
                x:40
              }
            },
            series:[
            	{
            		name:'犯罪数量',
            		type:'map',
            		map:'滁州',
            		mapLocation:{
            			y:100
            		},
            		itemStyle:{
            			emphasis:{label:{show:false}}
            		},
            		data:[
            			{name:'北京市',value:30},
            			{name:'天津市',value:20},
            			{name:'上海市',value:40},
            			{name:'重庆市',value:40},
            			{name:'广东省',value:10},
            			{name:'福建省',value:20},
            			{name:'广东省',value:10},
                  {name:'广西壮族自治区',value:0},
                  {name:'贵州省',value:0},
                  {name:'甘肃省',value:0},
                  {name:'海南省',value:10},
                  {name:'安徽省',value:10},
                  {name:'河南省',value:10},
                  {name:'黑龙江省',value:0},
                  {name:'湖北省',value:10},
                  {name:'湖南省',value: 0},
                  {name:'河北省',value:10},
                  {name:'江苏省',value:0},
                  {name:'江西省',value:5},
                  {name:'吉林省',value:5},
                  {name:'辽宁省',value:7},
                  {name:'宁夏回族自治区',value: 2},
                  {name:'内蒙古自治区',value:3},
                  {name:'青海省',value:3},
                  {name:'山东省',value:3},
                  {name:'山西省',value:3},
                  {name:'陕西省',value:3},
                  {name:'四川省',value:6},
                  {name:'台湾省',value:6},
                  {name:'西藏自治区',value: 2},
                  {name:'新疆维吾尔自治区',value:3},
                  {name:'云南省',value:3},
                  {name:'浙江省',value: 2},
                  {name:'香港自治区',value:10},
                  {name:'澳门自治区',value:2},
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
      var dataAxis = ['6-01', '6-02', '6-03', '6-04', '6-05', '6-06', '6-07', '6-08', '6-09', '6-10', '6-11', '6-12', '6-13', '6-14', '6-15', '6-16', '6-17', '6-18', '6-19', '6-20'];
      var data = [3, 5, 10, 40, 30, 20, 40, 20,10, 22, 3, 49, 23, 19, 13, 14, 8, 23, 25, 20];
      var yMax = 100;
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
.home_container {
  padding: 5px 5px;
  line-height: 1;
}
  .center-content {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
  }
  .table_content{
    display:flex;
    flex-direction: column;
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
</style>
