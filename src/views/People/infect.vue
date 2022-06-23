<template>
<div class="app-container">
    <!-- 搜索框 + 删除按钮 -->
    <el-card class="myCard">
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
<el-card>
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
        <el-table-column label="身份证号" prop="id" min-width="30%" />
        <el-table-column label="联系电话" prop="phone" min-width="10%" />
        <el-table-column label="确诊日期" prop="date" min-width="10%" >
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

  <el-timeline :reverse="reverse">
    <el-timeline-item
      v-for="(activity, index) in activities"
      :key="index"
      :timestamp="activity.timestamp">
      {{activity.content}}
    </el-timeline-item>
  </el-timeline>
  </el-main>
        <el-footer>
          <el-button
              type="text"
              size="small"
             @click="handleClick(id, 'check')"
            >
            <i class="el-icon-odometer" style="color: #3388FF; " />
               <span style="color: #223355; "> 修改轨迹</span>
            </el-button>
        </el-footer>
      </el-container>
    </el-drawer>
    <!-- 详情框 -->
    <el-dialog title="个人信息" :visible.sync="dialogVisible" width="30%">      
    <span>姓名：</span>      
        <span slot="footer" class="dialog-footer">        
        <el-button @click="dialogVisible = false; listID=''">关 闭</el-button>             
    </span>    
</el-dialog>
    </div>
</template>

<script>
import Pagination from "@/components/Pagination";

export default {
  name: "infectList",
  components: {
    Pagination,
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
        _page: 1,
        _limit: 10,
        name: undefined,
        id:'',
        type: "",
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
          id:'430220235522222222',
          phone:'13962462222',
          date: '2016-05-02',
          type:1,
        }, {
           name: '李四',
          id:'430228355522222222',
          phone:'13962462222',
          date: '2016-05-02',
          type:2,
        }, {
           name: '王五',
          id:'430221636522222222',
          phone:'13962462222',
          date: '2016-05-02',
          type:1,
        }],
      value: "",
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
        this.dialogVisible = true;
      } else if (mode === "line") {
        this.drawerVisible = true;
      }else if (mode === "check"){
        this.$router.push('/track');
      }
    },
    getList() {
      this.loading = true;
      listNoticeUser(this.queryParams).then((response) => {
        this.loading = false;
        this.infectList = response.records;
      });
    },
    resetQuery() {
      this.queryParams.name = "";
      this.queryParams.id = "";
      this.queryParams.type = "";
      this.queryDateRange = [];
      this.handleQuery();
    },
  },
};
</script>

<style lang="scss" scoped>
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