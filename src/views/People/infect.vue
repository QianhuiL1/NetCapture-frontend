<template>
<div class="home_container">
    <!-- 搜索框 + 删除按钮 -->
    <div class="center-content">
      <el-card class="table_content">
        <el-form ref="queryForm" :model="queryParams" :inline="true" size="small">
        <el-form-item label="姓名:" prop="name">
          <el-input
            v-model="queryParams.name"
            placeholder="请输入人员姓名"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="身份证号:" prop="id">
          <el-input
            v-model="queryParams.id"
            placeholder="请输入身份证号"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="审核状态:">
          <el-select
            v-model="queryParams.type"
            placeholder="请选择审核状态"
            clearable
            @change="handleStatusSelect"
          >
            <el-option
              v-for="(item, $index) in  TypeOptions"
              :key="$index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="日期:">
          <el-date-picker
            v-model="queryDateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="handleQuery"
          />
        </el-form-item>
        <el-form-item style="float: right">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-search"
            @click="handleQuery"
            >搜索</el-button
          >
          <el-button size="mini" icon="el-icon-refresh" @click="resetQuery"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
      </el-card>
    </div>
<div class="center-content">
  <el-card class="table_content">
    <el-table  v-loading="loading"
        :data="infectList"
        :cell-style="cellStyle"
        border
        highlight-current-row 
        ref="EventTable">
      <el-table-column
          label="姓名"
          prop="name"
          :show-overflow-tooltip="true"
          min-width="5%"
        />
        <el-table-column label="身份证号" prop="peopleId" min-width="30%" />
        <el-table-column label="联系电话" prop="phonenumber" min-width="10%" />
        <el-table-column label="确诊日期" prop="createTime" min-width="10%" >
            <template slot-scope="scope">
            <span>{{ scope.row.date }}</span>
          </template></el-table-column>
          <el-table-column label="状态" prop="type" min-width="5%">
          <template slot-scope="scope">
            <span
              ><i
                class="iconfont icon-dian"
                :style="
                  scope.row.type === 1 ? 'color:#11C79B' : 'color:#FF6161'
                "
              />{{ scope.row.type === 1 ? "已审查" : " 未审查" }}</span
            >
          </template>
        </el-table-column>    
        <el-table-column label="操作" min-width="15%">
          <template slot-scope="scope">
            <el-button
              size="medium"
              type="text"
              @click="handleClick(scope.row, 'line')"
            >
              <i class="icon-view iconfont" style="color: #3388ff" />
              <span style="color: #223355"> 活动轨迹</span>
            </el-button>
            <el-button type="text" size="medium" @click="handleClick(scope.row, 'detail')">
              <i class="el-icon-odometer" style="color: #3388ff" />
              <span style="color: #223355"> 查看详情</span>
            </el-button>
     </template>
  </el-table-column>
    </el-table>
    <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams._page"
        :limit.sync="queryParams._limit"
        style="float: right; margin: 20px"
        @pagination="getList"
      />
</el-card>
</div>
    <!-- 人员轨迹框 -->
   <el-drawer
      :with-header="false"
      :visible.sync="drawerVisible"
      append-to-body
    >
      <el-container style="height:100%">
        <el-main>
           <div class="radio">
    排序：
    <el-radio-group v-model="reverse">
      <el-radio :label="true">倒序</el-radio>
      <el-radio :label="false">正序</el-radio>
    </el-radio-group>
  </div> 
 <div class="timeline">
  <el-timeline :reverse="reverse">
    <el-timeline-item
      v-for="(activity, index) in activities"
      :key="index"
      :timestamp="activity.timestamp">
      {{activity.content}}
    </el-timeline-item>
  </el-timeline>
  </div>
  </el-main>
        <el-footer>
          <el-button
              type="text"
             @click="handleClick(id, 'check')"
            >
            <i class="el-icon-odometer" style="color: #3388FF;" />
               <span style="color: #223355; "> 修改轨迹</span>
            </el-button>
        </el-footer>
      </el-container>
    </el-drawer> 
    <!-- 详情框 -->
    <el-dialog title="个人信息"  :visible.sync="dialogVisible" width="30%">
          <span class="noun">姓名： </span>
          <span style="color:#2e2d2d;float:left;
      font-size: 20px;
      font-weight: 200;">{{people.name}}</span>
      <br><br>
      <span class="noun">性别： </span>
          <span style="float:left;
          color:#2e2d2d;
      font-size: 20px;
      font-weight: 200;">{{people.sex}}</span>
      <br><br>
        <span class="noun">身份证号： </span>
          <span style="float:left;
          color:#2e2d2d;
      font-size: 20px;
      font-weight: 200;">{{people.id}}</span>
      <br><br>
       
         <span class="noun">确诊时间： </span>
          <span style="color:#2e2d2d;float:left;
      font-size: 20px;
      font-weight: 200;">{{people.date}}</span>
      <br><br>
        <span class="noun">电话号码： </span>
          <span style="color:#2e2d2d;float:left;
      font-size: 20px;
      font-weight: 200;">{{people.phone}}</span>
     <br><br>
      <span class="noun">家庭住址： </span>
          <span style="color:#2e2d2d;float:left;
      font-size: 20px;
      font-weight: 200;">{{people.address}}</span>
        <span slot="footer" class="dialog-footer">        
        <el-button @click="dialogVisible = false; listID=''">关 闭</el-button>             
    </span>    
  </el-dialog>
</div>
</template>

<script>
import Pagination from "@/components/Pagination";
import {infectList,infectInfo,infectUpdate,infectDelete,infectAdd} from '../../api/People/infect/basic';
import {trackList} from '../../api/People/track/basic';
export default {
  name: "infectList",
  components: {
    Pagination,
  },
  created(){
this.getList()
  },
  data() {
    return {
        id:'',
        drawerVisible:false,
        dialogVisible:false,
      reverse: true,
      activities: [
        {
          content: "活动按期开始",
          timestamp: "2018-04-15",
        },
        {
          content: "通过审核",
          timestamp: "2018-04-13",
        },
        {
          content: "创建成功",
          timestamp: "2018-04-11",
        },
      ],
      queryParams: {
        name: "",
        peopleId:'',
        type: "",
        status:3,
        startDate: "",
        endDate: "",
      },
      queryDateRange: [],
      TypeOptions: [
        {
          value: "1",
          label: "已审查",
        },
        {
          value: "2",
          label: "未审查",
        },
      ],
      infectList: [{
          name: '张三',
          peopleId:'42030219901024737X',
          phonenumber:'13962462222',
          createTime: '2016-05-02',
          type:1,
        }],
      value: "",
      people:{
          id:"",
          sex:"",
          name:"",
          phone:"",
          address:"",
          date:"",
          status:""
        }
    };
  },
  methods: {
    handleQuery() {
      if (this.queryDateRange) {
        this.queryParams.startDate = this.queryDateRange[0];
        this.queryParams.endDate = this.queryDateRange[1];
      } else {
        this.queryParams.startDate = "";
        this.queryParams.endDate = "";
      }
      this.getList();
    },
      handleClick(row, mode) {
      if (mode === "detail") {
        // 加载详情内容
        this.people.id=row.peopleId
        infectInfo(this.people.id).then((response) => {
        this.people.name=response.data.name
        this.people.sex=response.data.sex === 0 ? "女":"男"
        this.people.phone=response.data.phonenumber
        this.people.address=response.data.address
        this.people.date=response.data.updateTime
        this.people.status=response.data.status
        })
        
        this.dialogVisible = true;
      } else if (mode === "line") {
        this.people.id=row.peopleId
        this.people.name=row.name
        this.people.phone=row.phonenumber
        this.activities=[]
        trackList({peopleId:this.people.id}).then((response) => {
          for(var index in response.rows){
          this.activities.push({content:response.rows[index].address,timestamp:response.rows[index].time})
          }
          
        })
        this.drawerVisible = true;
      }else if (mode === "check"){
        this.$router.push({
          name:"track",
          params:{
            peopleId:this.people.id,
            peoplePhone:this.people.phone,
            peopleName:this.people.name,
          }
        });
      }
    },
    getList() {
      this.loading = true;
      infectList(this.queryParams).then((response) => {
        this.loading = false;
        this.infectList = response.rows;
      });
    },
    resetQuery() {
      this.queryParams.status = 3
      this.queryParams.name = "";
      this.queryParams.peopleId = "";
      this.queryParams.type = "";
      this.queryDateRange = [];
      this.handleQuery();
    },
  },
};
</script>

<style lang="scss" scoped>

.home_container {
  padding: 2px 5px;
  line-height: 1;
  height: 100%;
}
  .center-content {
    margin-top: 10px;
    display: flex;
    flex-direction: column;
  }
.radio{
  font-size: 17px;
  font-weight: 500;
  margin-bottom: 30px;
}
.timeline{
  margin-left: 0px;
}
.noun{
  float: left;
color:#1E1E1E;
      font-size: 20px;
      font-weight: 600;
}
.info{
      color:#2e2d2d;
      font-size: 18px;
      font-weight: 200;
}
.el-scrollbar__wrap {
  overflow-x: hidden;
}
.el-card {
  margin-bottom: 10px;
  ::v-deep .el-card__body {
    padding: 10px;
  }
  ::v-deep .el-form-item {
    margin-bottom: 0px;
  }
}
.el-container-1 {
  display: block;
  height: 363px;
  ::v-deep .el-scrollbar__wrap {
    overflow-x: hidden !important;
  }
}
.file {
  color: #1890ff;
}
</style>