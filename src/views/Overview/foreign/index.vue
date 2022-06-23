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
        <span>国外疫情</span>
        </div>
          <div class="content-top">
            <div class="event-content">
              <div class="event-item" style="background:#5290FD">
                <span class="label">新增确诊</span>
                <span class="count">{{xzqz}}</span>
              </div>
              <div class="event-item" style="background:#5290FD">
                <span class="label">新增死亡</span>
                <span class="count">{{xzsw}}</span>
              </div>
              <div class="event-item" style="background:#5290FD">
                <span class="label">现有确诊</span>
                <span class="count">{{xyqz}}</span>
              </div>
              </div>
              <div class="event-content">
              <div class="event-item" style="background:#5290FD">
                <span class="label">现有确诊</span>
                <span class="count">{{xyqz}}</span>
              </div>
              <div class="event-item" style="background:#5290FD">
                <span class="label">累计死亡</span>
                <span class="count">{{ljsw}}</span>
              </div>
              <div class="event-item" style="background:#5290FD">
                <span class="label">累计治愈</span>
                <span class="count">{{xyjw}}</span>
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
          <div>新增本土趋势图</div>
        </template>
      </el-card>
     </el-col>
     <el-col :span="12">
      <el-card  class="table_content table_content_all">
        <div slot="header">
          <span>新增本土趋势</span>
        </div>
        <template>
          <div>境外输入趋势图</div>
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
    <el-dialog title="帮助"  :visible.sync="dialogVisible" width="45%" :model="helpItems">
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
export default {
  data() {
    return {
        xzqz: '35,835' ,
        xzsw: '9',
        xyqz: '28',
        ljsw: '1,132',
        ljzy: '3,574,754',
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
        ]
    }
  },
  component: {
  },
  created() {

  },
  methods: {
    getHelp(){
      this.dialogVisible= true
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
  padding: 12px 24px;
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
        // display:flex;
        // flex-direction:column;
        flex: 1;
        width: 300px;
        font-weight: 600;
        color: #1E1E1E;
        margin-top:10px;
        margin-right: 10px;
        border-radius: 2px;
        overflow: hidden;
        .label {
          height: 100px;
          font-size: 20px;
          margin: 0;
        }
        .count {
          height: 100px;
          font-size: 35px;
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