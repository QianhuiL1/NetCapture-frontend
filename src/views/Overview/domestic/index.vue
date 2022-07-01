<template>
  <div class="home_container">
    <div class="center-content">
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
                <span class="label">现有确诊</span>
                <span class="count" style="color:#E8317A">{{totalNum.xyqz}}</span>
              </div>
              <div class="event-item" style="background:#FFF7F7">
                <span class="label">现有本土</span>
                <span class="count" style="color:#C23531">{{totalNum.xybt}}</span>
              </div>
              <div class="event-item" style="background:#FEF7FF">
                <span class="label">现有境外</span>
                <span class="count">{{totalNum.xyjw}}</span>
              </div>
              <div class="event-item" style="background:#FEF7FF">
                <span class="label">现有无症状</span>
                <span class="count" style="color:#34C9C3">{{totalNum.xywzz}}</span>
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
    <el-dialog title="疫情数据说明"  :visible.sync="dialogVisible" width="45%" :model="helpItems">
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

export default {
  data() {
    return {
      totalNum: {
        xzqz: '35,835' ,
        xzbt: '9',
        xzjw: '28',
        xzwzz: '1,132',
        xyqz: '3,574,754',
        xybt: '555',
        xyjw: '254',
        xywzz: '1,449',
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
        ],
        // NativeEpidemicData: require()

    }
  },
  component: {
  },
  mounted() {
    this.initCharts()
  },
  created() {
    // this.handleInit()
    // getFromNet('2022053016').then(res=>{
    //   console.log(res)
    // })
  },
  methods: {
    getHelp(){
      this.dialogVisible= true
    },
    handleInit(){
      this.initCharts()
    },
    initCharts(){
      //初始化新增本土趋势折线图
      this.ownAddChart= echarts.init(document.getElementById('ownAddChart'))
      this.ownAddOption = {
        xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            data: [23, 95, 80, 30, 100, 110, 70],
            type: 'line',
            smooth: true
        }]
      };

    this.ownAddChart.setOption(this.ownAddOption)
    // 初始化境外输入趋势折线图
    this.otherAddChart= echarts.init(document.getElementById('otherAddChart'))
    this.otherAddOption={
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
          type: 'value'
      },
      series: [{
          data: [40, 30, 50, 80, 100, 70, 80],
          type: 'line',
          smooth: true
      }]
      }
    this.otherAddChart.setOption(this.otherAddOption)
  }

  }
}

</script>


<style lang="scss" scoped>

.box{
    display: flex;
    flex-direction:column;
}
.home_container {
  padding: 5px 5px;
  line-height: 1;
  .content-top {
    display: flex;
    flex-direction:column;
    height: 170px;
    .event-content {
      height: 85px;
      line-height: 85px;
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
        border-radius: 4px;
        overflow: hidden;
        .label {
          height: 100px;
          width: 120px;
          font-size: 20px;
        }
        .count {
          width: 180px;
          height: 100px;
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
}
.title{
  // color:#C8102E;
  // font-size: 20px;
  // padding:3px;
  // font-weight: 550;
  padding:3px;
  // border-bottom: 1px solid #CCCCCC;
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
    background-image:url(../../../assets/help.png);
    background-size:100% 100%;
    cursor: pointer;
    transition: .2s;
  }

.image:hover{
  background-image: url(../../../assets/help_on.png);
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
      margin-top: 10px;
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
      margin-top: 10px;
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
