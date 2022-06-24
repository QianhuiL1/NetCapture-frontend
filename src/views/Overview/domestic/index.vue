<template>
  <div class="home_container">
  <div class="center-content">
    <el-card class="table_content table_content_all">
        <div class="theme">
          <span>新型冠状病毒肺炎</span>
          </div>
        <div class="image" @click="getHelp">
        </div>
    </el-card>
    </div>
    <div class="center-content">
    <el-card  class="table_content table_content_all">
      <div class="box">
      <div class="title">
        <span>国内疫情</span>
        </div>
          <div class="content-top">
            <div class="event-content">
              <div class="event-item" style="background:#B3D8FF">
                <span class="label">新增确诊</span>
                <span class="count">{{totalNum.xzqz}}</span>
              </div>
              <div class="event-item" style="background:#B3D8FF">
                <span class="label">新增本土</span>
                <span class="count">{{totalNum.xzbt}}</span>
              </div>
              <div class="event-item" style="background:#B3D8FF">
                <span class="label">新增境外</span>
                <span class="count">{{totalNum.xzjw}}</span>
              </div>
              <div class="event-item" style="background:#B3D8FF">
                <span class="label">新增无症状</span>
                <span class="count">{{totalNum.xzwzz}}</span>
              </div>
              </div>
              <div class="event-content">
              <div class="event-item" style="background:#B3D8FF">
                <span class="label">现有确诊</span>
                <span class="count">{{totalNum.xyqz}}</span>
              </div>
              <div class="event-item" style="background:#B3D8FF">
                <span class="label">现有本土</span>
                <span class="count">{{totalNum.xybt}}</span>
              </div>
              <div class="event-item" style="background:#B3D8FF">
                <span class="label">现有境外</span>
                <span class="count">{{totalNum.xyjw}}</span>
              </div>
              <div class="event-item" style="background:#B3D8FF">
                <span class="label">现有无症状</span>
                <span class="count">{{totalNum.xywzz}}</span>
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
          <div id="otherAddChart" style="height: 50vh"></div>
        </template>
      </el-card>
     </el-col>
    </div>
  <div class="center-content">
    <el-col :span="12">
      <el-card class="table_content table_content_all">
        <div slot="header">
          <span>疫情速报</span>
        </div>
        <el-table
          class="table_tree">
          <el-table-column
            label="地区"
            >
            </el-table-column>
          <el-table-column
            label="新增本土"
            >
            </el-table-column>
          <el-table-column
            label="新增无症状"
            >
            </el-table-column>  
            <el-table-column
            label="风险区域"
            >
            </el-table-column>
        </el-table>
      </el-card>
      </el-col>
      <el-col :span="12">
      <el-card class="table_content table_content_all">
        <div slot="header">
          <span>中风险地区</span>
        </div>
                <el-table
          class="table_tree">
          <el-table-column
            label="风险"
            >
            </el-table-column>
          <el-table-column
            label="地区"
            >
            </el-table-column>
        </el-table>
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
            detail:'“无症状”数据取自国家卫健委每日最新公布的“无症状感染者”的数据（不包括港澳台）'
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
        otherAddChart: ''
    }
  },
  component: {
  },
  mounted() {
    this.initCharts()
  },
  created() {
    // this.handleInit()
  },
  methods: {
    getHelp(){
      this.dialogVisible= true
    },
    handleInit(){
      this.initCharts()
    },
    initCharts(){
      
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
    // 初始化境外输入趋势折线图
    this.otherAddChart= echarts.init(document.getElementById('otherAddChart'))
    const data = [["2000-06-05", 116], ["2000-06-06", 129], ["2000-06-07", 135], ["2000-06-08", 86], ["2000-06-09", 73], ["2000-06-10", 85], ["2000-06-11", 73], ["2000-06-12", 68], ["2000-06-13", 92], ["2000-06-14", 130], ["2000-06-15", 245], ["2000-06-16", 139], ["2000-06-17", 115], ["2000-06-18", 111], ["2000-06-19", 309], ["2000-06-20", 206], ["2000-06-21", 137], ["2000-06-22", 128], ["2000-06-23", 85], ["2000-06-24", 94], ["2000-06-25", 71], ["2000-06-26", 106], ["2000-06-27", 84], ["2000-06-28", 93], ["2000-06-29", 85], ["2000-06-30", 73], ["2000-07-01", 83], ["2000-07-02", 125], ["2000-07-03", 107], ["2000-07-04", 82], ["2000-07-05", 44], ["2000-07-06", 72], ["2000-07-07", 106], ["2000-07-08", 107], ["2000-07-09", 66], ["2000-07-10", 91], ["2000-07-11", 92], ["2000-07-12", 113], ["2000-07-13", 107], ["2000-07-14", 131], ["2000-07-15", 111], ["2000-07-16", 64], ["2000-07-17", 69], ["2000-07-18", 88], ["2000-07-19", 77], ["2000-07-20", 83], ["2000-07-21", 111], ["2000-07-22", 57], ["2000-07-23", 55], ["2000-07-24", 60]];
    const dateList = data.map(function (item) {
      return item[0];
    });
    const valueList = data.map(function (item) {
      return item[1];
    });
    this.otherAddChart.setOption({
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

  .center-content {
    margin-top: 20px;
    display: flex;
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
  color:#1E1E1E;
  font-size: 20px;
  padding:3px;
  font-weight: 550;
  border-bottom: 1px solid #CCCCCC
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
    color:#1E1E1E;
    font-size: 20px;
    font-weight: 550;
    padding:3px;
    float:left;
  }
    .image {
    width: 20px;
    height: 20px;
    margin-left: 180px;
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
</style>
