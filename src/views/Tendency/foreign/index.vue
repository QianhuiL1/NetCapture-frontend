<template>
  <div class="center-content">
    <el-card class="table_content table_content_all">
        <div class="theme">
          <div class="title">
            <span>国外疫情趋势</span>
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
        <el-tab-pane label="现有确诊">现有确诊</el-tab-pane>
        <el-tab-pane label="新增确诊趋势">新增确诊趋势</el-tab-pane>
      </el-tabs>
      </div>
    <div class="box">
      <div class="title2">
        <span>国外各国家疫情统计汇总</span>
        </div>
        <el-table :data="dangerArea" strpe style="width:100%" height="250">
        <el-table-column prop="area" label="地区" align="center"></el-table-column>
        <el-table-column  sortable prop="add" label="新增" align="center"></el-table-column>
        <el-table-column sortable prop="total" label="累计" align="center"></el-table-column>
        <el-table-column sortable prop="cure" label="治愈" align="center"></el-table-column>
        <el-table-column sortable prop="dead" label="死亡" align="center"></el-table-column>
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
export default {
  data() {
    return {
      period: '今天'
    }
  },
  component: {
  },
  created() {

  },
  methods: {
    getHelp(){
      this.dialogVisible= true
    },
    timeChange(){
      console.log(this.period)
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
