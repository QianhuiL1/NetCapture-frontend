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
      <el-card class="table_content table_content_all">
        <div slot="header">
          <span>疫情速报</span>
        </div>
        <el-table
          v-loading="loading"
          :data="quickInfo"
          style="cursor: pointer;"
          height="400px"
          @row-click="getNewsDetail"
          highlight-current-row>
          <el-table-column
          align="center"
            label="日期"
            min-width="25%"
            prop="eventtime"
            :show-overflow-tooltip="true"
            >
            </el-table-column>
          <el-table-column
            align="center"
            label="新闻"
            min-width="75%"
            prop="eventdescription"
            :show-overflow-tooltip="true"
            >
            </el-table-column>
        </el-table>
      </el-card>
    </div>
</div>
</template>

<script>
import echarts from 'echarts'
import "echarts/map/js/china.js"
import $ from 'jquery'
import {page,getAll} from '../../../api/Data/basic'
let cZjson = require("../area/area.json")
import {getNews} from '../../../api/Data/event'
import {getProvince,getCountryList} from '../../../api/Data/total'

export default {
  data() {
    return {
      period: '今天',
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
        quickInfo:[],
        loading: false,
        paramData:{
          totalepidemicDate:'2022-07-02'
        }
    }
  },
  component: {
  },
  mounted(){
    this.initMap()
    this.getOwnAck()
    this.initQuickInfo()
  },
  created() {
    // 3,4,5,6 日有数据
  },
  methods: {
    getHelp(){
      this.dialogVisible= true
    },
    initMap(){
      var today=this.getCurrentTime()
      page(today).then(res=>{
        res.rows.forEach(item=>{
          this.initialArray.forEach(it=>{
            if(it.name===item.province){
              it.value=item.confirm
            }
          })
        })
        echarts.registerMap('滁州', cZjson);
        var chart = echarts.init(document.getElementById('map'));
        chart.showLoading({
          text:'数据加载中......',
          color:"#B2312D",
          textColor:"#B2312D",
          fontSize: 50,
          showSpinner: true,
          spinnerRadius: 20,
          lineWidth: 5,
          zlevel: 0,
        })
        let option = {
            title: {
                text: '中国昨日疫情趋势',
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
        chart.hideLoading()
      })
    },
    getOwnAck() {
      var dateArray= this.getPreWeekTime()
      this.ownAckChart = echarts.init(document.getElementById('ownAckChart'));
      this.ownAckChart.showLoading({
          text:'数据加载中......',
          color:"#B2312D",
          textColor:"#B2312D",
          fontSize: 50,
          showSpinner: true,
          spinnerRadius: 20,
          lineWidth: 5,
          zlevel: 0,
        })
      var dataAxis = dateArray
      var yMax = 50000;
      var dataShadow = [];
      for (var i = 0; i < dataAxis.length; i++) {
          dataShadow.push(yMax);
      }
      var numArray=[]
      for(var m=0;m<dataAxis.length;m++){
        getAll(dataAxis[m]).then(res=>{
          numArray.push(res.data.confirm)
          if(m==dataAxis.length){
            let option = {
            title: {
                text: '新增确诊趋势',
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
                {
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
                    data: numArray
                }
            ]
          };
          this.ownAckChart.setOption(option)
          this.ownAckChart.hideLoading()
          }
        })
      }
    },
    initQuickInfo(){
      this.loading= true
      getNews().then(res=>{
      // 展示前20条新闻
      this.quickInfo = res.rows.reverse().slice(0,20)
      this.loading= false
    })
    },
    getNewsDetail(row){
      window.open(row.eventurl,'_blank') // 在新窗口打开外链接
    },
    getCurrentTime() {
      //获取当前时间并打印
      let yy = new Date().getFullYear();
      let mm = new Date().getMonth()+1;
      mm = mm < 10 ? '0' + mm : mm;
      let dd = new Date().getDate()-1;
      dd = dd < 10 ? '0' + dd : dd;
      var gettime = yy+'-'+mm+'-'+dd
      return gettime
    },
    getPreWeekTime(){
      var now = new Date()
      var array=[]
      for(var j=7;j>=0;j--){
        var date = new Date(now.getTime()-j*24*3600*1000)
        var yy = date.getFullYear()
        var mm = date.getMonth()+1
        var dd = date.getDate()
        mm = mm < 10 ? '0' + mm : mm;
        dd = dd < 10 ? '0' + dd : dd;
        var needDate= yy+'-'+mm+'-'+ dd
        array.push (needDate)
      }
      return array
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
