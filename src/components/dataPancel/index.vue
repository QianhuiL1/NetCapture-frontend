<template>
  <div class="home1" style="z-index: 1001;">
    <div class="center-content" style="height:30%">
    <el-card  class="table_content table_content_all">
      <div class="box">
        <div class="theme">
      <div class="title">
        <span>国内疫情</span>
        </div>
        <div class="image" @click="getHelp">
        </div>
        </div>
          <div class="content-top">
            <div class="event-content">
              <div class="event-item" style="background:#FFF4F4">
                <span class="label">新增确诊</span>
                <span class="count" style="color:red">{{totalNum.xzqz}}</span>
              </div>
              <div class="event-item" style="background:#FFFAF7">
                <span class="label">新增本土</span>
                <span class="count" style="color:#FF7357">{{totalNum.xzbt}}</span>
              </div>
              <div class="event-item" style="background:#FFF4F4">
                <span class="label">新增境外</span>
                <span class="count">{{totalNum.xzjw}}</span>
              </div>
              <div class="event-item" style="background:#FFFAF7">
                <span class="label">新增无症状</span>
                <span class="count" style="color:#26AEB5">{{totalNum.xzwzz}}</span>
              </div>
              </div>
              <div class="event-content">
              <div class="event-item" style="background:#FFF4F4">
                <span class="label">新增现有确诊</span>
                <span class="count" style="color:#E8317A">{{totalNum.xyqz}}</span>
              </div>
              <div class="event-item" style="background:#FFF7F7">
                <span class="label">现有本土</span>
                <span class="count" style="color:#C23531">{{totalNum.xybt}}</span>
              </div>
              <div class="event-item" style="background:#FEF7FF">
                <span class="label">新增治愈</span>
                <span class="count" style="color:#34C9C3">{{totalNum.xzzy}}</span>
              </div>
              <div class="event-item" style="background:#FEF7FF">
                <span class="label">新增死亡</span>
                <span class="count" >{{totalNum.xzsw}}</span>
              </div>
            </div>
      </div>
    </div>
    </el-card>
    </div>
    <div class="center-content">
     <el-col :span="12">
      <el-card  class="table_content table_content_all">
        <div slot="header">
          <span>新增本土趋势</span>
        </div>
        <template>
          <div id="ownAddChart" style="height: 50vh"></div>
        </template>
      </el-card>
     </el-col>
     <el-col :span="12">
      <el-card  class="table_content table_content_all">
        <div slot="header">
          <span>境外输入趋势</span>
        </div>
        <template>
          <div id="otherAddChart" class="rChart" style="height: 50vh;margin:auto"></div>
        </template>
      </el-card>
     </el-col>
    </div>
    <el-dialog  :visible.sync="dialogVisible" width="45%" :model="helpItems"   append-to-body title="疫情数据说明">
      <div
        v-for="(item,index) in helpItems"
        :key="index"
        class="help_item" >
        <div class="noun">
          <span>{{item.noun}}</span>
          </div>
        <div class="detail">
          <span>{{item.detail}}</span>
        </div>
      </div>
      <div class="more_item">
        <span>当各省公布数据总和大于国家卫健委公布的数据时，全国数据切换为各省合计数</span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import echarts from 'echarts'
import { getAll } from '../../api/Data/basic'
export default {
  data() {
    return {
      totalNum: {
        xzqz: '35,835' ,
        xzbt: '9',
        xzjw: '28',
        xzwzz: '1,132',
        xyqz: '4,754',
        xybt: '555',
        xzzz: '254',
        xzsw: '9',
      },
        dialogVisible: false,
        helpItems:[
          {
            noun: '新增确诊',
            detail:'来自国家、各省市卫健委及港澳台公布的新增确诊病例'
          },
          {
            noun: '新增本土',
            detail:'来自国家、各省市卫健委及港澳台公布的新增确诊病例'
          },
          {
            noun: '新增无症状',
            detail:'无症状数据取自国家卫健委每日最新公布的“无症状感染者”的数据（不包括港澳台）'
          },
          {
            noun: '现有确诊',
            detail: '计算方法为：现确诊数=累计确诊数-累计治愈数-累计死亡数'
          },
          {
            noun: '数据来源',
            detail: '用户从指定页面离开应用挥着不再进行进一步操作的概率'
          },
          {
            noun: '数据统计规则',
            detail: '每日上午全国数据会优先使用国家卫健委公布的数据'
          }
        ],
        ownAddOption:{},
        otherAddOption:{},
        ownAddChart: '',
        otherAddChart: '',

    }
  },
  component: {
  },
  mounted() {
    this.initCharts()
  },
  created() {
    this.initForm()
  },
  methods: {
    initForm(){
      var today = this.getCurrentTime()
      console.log('初始化')
      getAll(today).then(res=>{
        console.log('访问接口成功')
        console.log(res)
        this.totalNum.xzqz=res.data.confirm
        this.totalNum.xzbt=res.data.confirm-res.data.input
        this.totalNum.xzjw=res.data.input
        this.totalNum.xzwzz= res.data.incrNoSymptom
        this.totalNum.xyqz= res.data.storeconfirm
        this.totalNum.xybt= res.data.storeconfirm-res.data.input
        this.totalNum.xzzy= res.data.heal
        this.totalNum.xzsw=res.data.dead
        
    })
    },
    getHelp(){
      this.dialogVisible= true
    },
    handleInit(){
      this.initCharts()
    },
    initCharts(){
      // 新增本土趋势图
      this.ownAddChart= echarts.init(document.getElementById('ownAddChart'))
      var lchartDate=this.getPreWeekTime()
      console.log(lchartDate)
      var lchartNum=[]
        for(var i=0;i<lchartDate.length;i++){
          getAll(lchartDate[i]).then(res=>{
            lchartNum.push(res.data.confirm-res.data.input)
            if(i==lchartDate.length){
                    this.ownAddOption = {
          xAxis: {
              type: 'category',
              data: lchartDate
          },
          yAxis: {
              type: 'value'
          },
          tooltip: {
              trigger: 'item',
              formatter: '{b} <br/>新增 {c}   例'
          },
          series: [{
              data: lchartNum,
              type: 'line',
              smooth: true
          }]
        };
        this.ownAddChart.setOption(this.ownAddOption)
          }
        })
      }
    // 初始化境外输入趋势折线图
    this.otherAddChart= echarts.init(document.getElementById('otherAddChart'))
    var rchartNum=[]
    for(var i=0;i<lchartDate.length;i++){
        getAll(lchartDate[i]).then(res=>{
          rchartNum.push(res.data.input)
          if(i==lchartDate.length){
            this.otherAddOption={
              xAxis: {
                type: 'category',
                data: lchartDate
              },
              yAxis: {
                  type: 'value'
              },
              tooltip: {
                    trigger: 'item',
                    formatter: '{b} <br/>新增 {c}   例'
              },
              series: [{
                  data: rchartNum,
                  type: 'line',
                  smooth: true
              }]
              }
            this.otherAddChart.setOption(this.otherAddOption)
          }
        })
      }
   
  },
      getCurrentTime() {
      //获取当前时间并打印
      let yy = new Date().getFullYear();
      let mm = new Date().getMonth()+1;
      mm = mm < 10 ? '0' + mm : mm;
      let dd = new Date().getDate();
      dd = dd < 10 ? '0' + dd : dd;
      var gettime = yy+'-'+mm+'-'+dd;
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

.el-dialog{
  left: 50%;
}
.box{
    display: flex;
    flex-direction:column;
}
.home1 {
  // padding: 5px 5px;
  // padding-left: 50px;
  // padding-right: 50px;
  line-height: 1;
  position: relative;
  // background: url('/img/bazs_bodybg.png');
  // background-size: 100%, 100%;
  // width: 170vh;
  overflow: hidden;
  // height: 85vh;
  // background-repeat: no-repeat;
  
  }
  .content-top {
    display: flex;
    flex-direction:column;
    height: 170px;
    .event-content {
      height: 70px;
      line-height: 70px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      .event-item {
        display:flex;
        flex-direction:row;
        justify-content: space-between;
        flex: 1;
        width: 300px;
        font-weight: 600;
        color: #1E1E1E;
        margin-top:10px;
        margin-right: 10px;
        border-radius: 10px;
        overflow: hidden;
        .label {
          height: 70px;
          width: 120px;
          font-size: 20px;
        }
        .count {
          width: 180px;
          height: 70px;
          font-size: 33px;
          font-weight: 550;
          margin: 0;
        }
      }
      .event-item:nth-last-of-type(1) {
        margin-right: 0;
      }
    }
    .tips-content {
      height: 85px;
      padding: 0 0 15px;
      display: flex;
      flex-direction: column;
      align-content: space-between;
      li {
        display: flex;
        > p {
          font-size: 16px;
          font-weight: 500;
          color: #4a4a4a;
          margin: 0 0 16px;
        }
        p:nth-last-of-type(1) {
          margin-bottom: 0;

        }
    }
    }
  }
::v-deep .center-content{
  background-color: transparent !important
}
  .center-content {
    margin-top: 20px;
    display: flex;
    background-color: transparent!important;
    .op-card {
      flex: 1;
    }
    ::v-deep .el-table {
      // margin: 20px 0 10px;
      // border: 1px solid #DFE6EC;
      .status {
        display: flex;
        align-items: center;
        justify-content: center;
        color: #606266;
        .circle {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          overflow: hidden;
          margin-right: 6px;
        }
      }
    }
}
.table_content {
    background-color: rgba(255, 255, 255, 0.5);
}
.title{
  padding:3px;
}
.title span{
  float:left;
}

.app-container {
  height: 100%;
  padding: 17px 26px;
}
.content{
    height: 100%;
    display: flex;
}
.table_content{
    flex: 6;
}
  .table_content:nth-last-of-type(1) {
    flex: 4;
    margin-left: 20px;
    // width: calc( 100% - 400px );
  }
  .theme{
    color:#950008;
    font-size: 20px;
    font-weight: 550;
    padding:3px;
    float:left;
    display:flex;
    flex-direction: row;
  }
    .image {
    width: 20px;
    height: 20px;
    margin-left: 5px;
    margin-top: 2px;
    background-image:url(../../assets/help.png);
    background-size:100% 100%;
    cursor: pointer;
    transition: .2s;
  }
.table_content {
    background-color: rgba(255, 255, 255, 0.9);
}
.image:hover{
  background-image: url(../../assets/help_on.png);
  background-size:100% 100%;
}
.help_item{
    display: flex;
    flex-direction:column;
    .noun{
      color:#1E1E1E;
      font-size: 20px;
      font-weight: 600;
      padding: 3px;
      flex: 5px;
      margin-top: 1px;
    }
    .noun span{
      float: left;
    }
    .detail{
      color:#858585;
      font-size: 15px;
      font-weight: 400;
      padding: 3px;
      flex: 10px;
      margin-left: 30px;
      margin-top: 1px;
    }
    .detail span{
      float: left;
    }
}
.more_item{
    color:#262626;
    font-size: 13px;
    font-weight: 400;
    padding: 3px;
    flex: 10px;
    margin-left: 30px;
    margin-top: 20px;
    border-top: 1px solid #262626
}
.rChart{
  margin: auto;
}
</style>
