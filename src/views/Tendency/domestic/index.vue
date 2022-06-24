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
        <el-tab-pane label="新增本土趋势" @click="getOwnAdd">
          <template>
          <div id="ownAddChart" style="height: 50vh"></div>
          </template>
        </el-tab-pane>
        <el-tab-pane label="新增确诊趋势" @click="getownAck">
          <template>
          <div id="ownAckChart" style="height: 50vh"></div>
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
                text: '全国现有确诊',
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
    getOwnAdd() {
      this.ownAddChart= echarts.init(document.getElementById('ownAddChart'))
      this.ownAddOption={
        dataset: [
        {
          dimensions: ['name', 'age', 'profession', 'score', 'date'],
          source: [
            ['Hannah Krause', 41, 'Engineer', 314, '2011-02-12'],
            ['Zhao Qian', 20, 'Teacher', 351, '2011-03-01'],
            ['Jasmin Krause ', 52, 'Musician', 287, '2011-02-14'],
            ['Li Lei', 37, 'Teacher', 219, '2011-02-18'],
            ['Karle Neumann', 25, 'Engineer', 253, '2011-04-02'],
            ['Adrian Groß', 19, 'Teacher', '-', '2011-01-16'],
            ['Mia Neumann', 71, 'Engineer', 165, '2011-03-19'],
            ['Böhm Fuchs', 36, 'Musician', 318, '2011-02-24'],
            ['Han Meimei', 67, 'Engineer', 366, '2011-03-12']
          ]
        },
        {
          transform: {
            type: 'sort',
            config: { dimension: 'score', order: 'desc' }
          }
        }
      ],
      xAxis: {
        type: 'category',
        axisLabel: { interval: 0, rotate: 30 }
      },
      yAxis: {},
      series: {
        type: 'bar',
        encode: { x: 'name', y: 'score' },
        datasetIndex: 1
      }
      }
    this.ownAddChart.setOption(this.ownAddOption)
    },
    getOwnAck() {
      this.ownAckChart= echarts.init(document.getElementById('ownAckChart'))
      const data = [["2000-06-05", 116], ["2000-06-06", 129], ["2000-06-07", 135], ["2000-06-08", 86], ["2000-06-09", 73], ["2000-06-10", 85], ["2000-06-11", 73], ["2000-06-12", 68], ["2000-06-13", 92], ["2000-06-14", 130], ["2000-06-15", 245], ["2000-06-16", 139], ["2000-06-17", 115], ["2000-06-18", 111], ["2000-06-19", 309], ["2000-06-20", 206], ["2000-06-21", 137], ["2000-06-22", 128], ["2000-06-23", 85], ["2000-06-24", 94], ["2000-06-25", 71], ["2000-06-26", 106], ["2000-06-27", 84], ["2000-06-28", 93], ["2000-06-29", 85], ["2000-06-30", 73], ["2000-07-01", 83], ["2000-07-02", 125], ["2000-07-03", 107], ["2000-07-04", 82], ["2000-07-05", 44], ["2000-07-06", 72], ["2000-07-07", 106], ["2000-07-08", 107], ["2000-07-09", 66], ["2000-07-10", 91], ["2000-07-11", 92], ["2000-07-12", 113], ["2000-07-13", 107], ["2000-07-14", 131], ["2000-07-15", 111], ["2000-07-16", 64], ["2000-07-17", 69], ["2000-07-18", 88], ["2000-07-19", 77], ["2000-07-20", 83], ["2000-07-21", 111], ["2000-07-22", 57], ["2000-07-23", 55], ["2000-07-24", 60]];
      const dateList = data.map(function (item) {
        return item[0];
    });
    const valueList = data.map(function (item) {
      return item[1];
    });
    this.ownAckChart.setOption({
      // Make gradient line here
        visualMap: [
          {
            show: false,
            type: 'continuous',
            seriesIndex: 0,
            min: 0,
            max: 400
          },
          {
            show: false,
            type: 'continuous',
            seriesIndex: 1,
            dimension: 0,
            min: 0,
            max: dateList.length - 1
          }
        ],
        title: [
          {
            left: 'center',
            text: 'Gradient along the y axis'
          },
          {
            top: '55%',
            left: 'center',
            text: 'Gradient along the x axis'
          }
        ],
        tooltip: {
          trigger: 'axis'
        },
        xAxis: [
          {
            data: dateList
          },
          {
            data: dateList,
            gridIndex: 1
          }
        ],
        yAxis: [
          {},
          {
            gridIndex: 1
          }
        ],
        grid: [
          {
            bottom: '60%'
          },
          {
            top: '60%'
          }
        ],
        series: [
          {
            type: 'line',
            showSymbol: false,
            data: valueList
          },
          {
            type: 'line',
            showSymbol: false,
            data: valueList,
            xAxisIndex: 1,
            yAxisIndex: 1
          }
        ]
    })
    this.ownAckChart.setOption(this.foreignAddOption)
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
