<template>
  <div class="home_container">
    <!-- 搜索框 + 删除按钮 -->
    <div class="center-content">
      <el-card class="table_content">
        <el-form
          ref="queryForm"
          :model="queryParams"
          :inline="true"
          size="small"
        >
          <el-form-item
            label="姓名:"
            prop="name"
            style="float: left; margin-left: 50px"
          >
            <el-input
              v-model="queryParams.name"
              placeholder="请输入人员姓名"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item
            label="身份证号:"
            prop="id"
            style="float: left; margin-left: 50px"
          >
            <el-input
              v-model="queryParams.peopleId"
              placeholder="请输入身份证号"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="日期:" style="float: left; margin-left: 50px">
            <el-date-picker
              v-model="queryDateRange"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="handleQuery"
            />
          </el-form-item>
          <el-form-item label="地区" prop="city">
            <el-cascader
              v-model="selectedOptions"
              :options="options"
              filterable
              clearable
              style="width: 250px"
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
            <el-button
              icon="el-icon-share"
              type="primary"
              size="mini"
              @click="handleExport"
              >导出</el-button
            >
          </el-form-item>
        </el-form>
      </el-card>
    </div>
    <div class="center-content">
      <el-card class="table_content">
        <el-table
          v-loading="loading"
          :data="tableDataEnd"
          border
          highlight-current-row
          ref="EventTable"
        >
          <el-table-column
            label="姓名"
            prop="name"
            :show-overflow-tooltip="true"
            min-width="10%"
          />
          <el-table-column label="身份证号" prop="peopleId" min-width="20%" />
          <el-table-column
            label="联系电话"
            prop="phonenumber"
            min-width="10%"
          />
          <el-table-column label="确诊时间" prop="positiveTime" min-width="20%">
            <template slot-scope="scope">
              <span>{{ scope.row.positiveTime | formatDate }}</span>
            </template></el-table-column
          >
          <el-table-column label="操作" min-width="15%">
            <template slot-scope="scope">
              <el-button
                size="medium"
                type="text"
                @click="handleClick(scope.row, 'line')"
              >
                <i class="el-icon-odometer" style="color: #3388ff" />
                <span style="color: #223355"> 活动轨迹</span>
              </el-button>
              <el-button
                type="text"
                size="medium"
                @click="handleClick(scope.row, 'detail')"
              >
                <i class="icon-view iconfont" style="color: #3388ff" />
                <span style="color: #223355"> 查看详情</span>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          v-show="total > 0"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </el-card>
    </div>
    <!-- 人员轨迹框 -->
    <el-drawer
      :with-header="false"
      :visible.sync="drawerVisible"
      append-to-body
    >
      <el-container style="height: 100%">
        <el-main>
          <i
            class="el-icon-odometer"
            style="color: #3388ff; margin-left: 28px; font-size: 20px"
          />
          <span
            style="
              margin-left: 10px;
              margin-top: 10px;
              font-size: 20px;
              font-weight: 800;
            "
            >人员轨迹路线</span
          >
          <div class="timeline">
            <el-timeline
              :reverse="reverse"
              style="margin-top: 30px; font-size: 18px"
            >
              <el-timeline-item
                v-for="(activity, index) in activities"
                :key="index"
                :timestamp="activity.timestamp"
              >
                {{ activity.content }}
              </el-timeline-item>
            </el-timeline>
          </div>
        </el-main>
        <el-footer>
          <el-button type="text" @click="handleClick(id, 'check')">
            <i
              class="el-icon-edit"
              style="color: #3388ff; margin-left: 28px; font-size: 20px"
            />
            <span
              style="
                color: #223355;
                font-size: 20px;
                font-weight: 800;
                margin-bottom: 100px;
              "
            >
              修改轨迹</span
            >
          </el-button>
        </el-footer>
      </el-container>
    </el-drawer>
    <!-- 详情框 -->
    <el-dialog title="个人信息" :visible.sync="dialogVisible" width="30%">
      <span class="noun">姓名： </span>
      <span
        style="color: #2e2d2d; float: left; font-size: 20px; font-weight: 200"
        >{{ people.name }}</span
      >
      <br /><br />
      <span class="noun">性别： </span>
      <span
        style="float: left; color: #2e2d2d; font-size: 20px; font-weight: 200"
        >{{ people.sex }}</span
      >
      <br /><br />
      <span class="noun">身份证号： </span>
      <span
        style="float: left; color: #2e2d2d; font-size: 20px; font-weight: 200"
        >{{ people.id }}</span
      >
      <br /><br />

      <span class="noun">确诊时间： </span>
      <span
        style="color: #2e2d2d; float: left; font-size: 20px; font-weight: 200"
        >{{ people.date }}</span
      >
      <br /><br />
      <span class="noun">电话号码： </span>
      <span
        style="color: #2e2d2d; float: left; font-size: 20px; font-weight: 200"
        >{{ people.phone }}</span
      >
      <br /><br />
      <span class="noun">家庭住址： </span>
      <span
        style="color: #2e2d2d; float: left; font-size: 20px; font-weight: 200"
        >{{ people.address }}</span
      >
      <span slot="footer" class="dialog-footer">
        <el-button
          @click="
            dialogVisible = false;
            listID = '';
          "
          >关 闭</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  infectList,
  infectInfo,
  TimeList,
} from "../../api/People/infect/basic";
import { trackList } from "../../api/People/track/basic";
import { travelList } from "../../api/People/travel/basic";
import { regionData } from "element-china-area-data";
import FileSaver from "file-saver";
import XLSX from "xlsx";

export default {
  name: "infectList",
  created() {
    this.getList();
  },
  filters: {
    formatDate(value) {
      // 计算日期相关值
      let time = new Date(value);
      let Y = time.getFullYear();
      let M = time.getMonth() + 1;
      let D = time.getDate();
      let h = time.getHours();
      let m = time.getMinutes();
      let s = time.getSeconds();
      return (
        Y +
        "-" +
        (M < 10 ? "0" + M : M) +
        "-" +
        (D < 10 ? "0" + D : D) +
        " " +
        (h < 10 ? "0" + h : h) +
        ":" +
        (m < 10 ? "0" + m : m) +
        ":" +
        (s < 10 ? "0" + s : s)
      );
    },
  },
  data() {
    return {
      // 将省市区数据赋给级联选择器
      options: regionData,
      // 存放用户选择后省市区的信息
      selectedOptions: [],
      id: "",
      drawerVisible: false,
      dialogVisible: false,
      reverse: true,
      activities: [],
      total: 1,
      tableDataEnd: [],
      pageSize: 10,
      currentPage: 1,
      queryParams: {
        name: "",
        peopleId: "",
        type: "",
        status: 3,
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
      infectList: [],
      value: "",
      people: {
        id: "",
        sex: "",
        name: "",
        phone: "",
        address: "",
        date: "",
        status: "",
      },
      startDate: "",
      endDate: "",
    };
  },
  methods: {
    formatDate(value) {
      // 计算日期相关值
      let time = new Date(value);
      let Y = time.getFullYear();
      let M = time.getMonth() + 1;
      let D = time.getDate();
      let h = time.getHours();
      let m = time.getMinutes();
      let s = time.getSeconds();
      return (
        Y +
        "-" +
        (M < 10 ? "0" + M : M) +
        "-" +
        (D < 10 ? "0" + D : D) +
        " " +
        (h < 10 ? "0" + h : h) +
        ":" +
        (m < 10 ? "0" + m : m) +
        ":" +
        (s < 10 ? "0" + s : s)
      );
    },
    handleSizeChange: function (pageSize) {
      // 每页条数切换
      this.pageSize = pageSize;
      this.handleCurrentChange(this.currentPage);
    },
    handleCurrentChange: function (currentPage) {
      //页码切换
      this.currentPage = currentPage;
      this.currentChangePage(this.infectList, currentPage);
    },
    //分页方法
    currentChangePage(list, currentPage) {
      let from = (currentPage - 1) * this.pageSize;
      let to = currentPage * this.pageSize;
      this.tableDataEnd = [];
      for (; from < to; from++) {
        if (list[from]) {
          this.tableDataEnd.push(list[from]);
        }
      }
    },
    handleQuery() {
      if(this.selectedOptions.length > 0){
this.queryParams.ancestors =
        "0" + "," + this.selectedOptions[0] + "," + this.selectedOptions[2];
      }
      if (this.queryDateRange.length>0) {
        this.startDate = this.queryDateRange[0];
        this.endDate = this.queryDateRange[1];
      } else {
        this.startDate = "";
        this.endDate = "";
      }
      this.getList();
    },
    handleClick(row, mode) {
      if (mode === "detail") {
        // 加载详情内容
        this.people.id = row.peopleId;
        infectInfo(this.people.id).then((response) => {
          this.people.name = response.data.name;
          this.people.sex = response.data.sex === 0 ? "女" : "男";
          this.people.phone = response.data.phonenumber;
          this.people.address = response.data.address;
          this.people.date = this.formatDate(response.data.positiveTime);
          this.people.status = response.data.status;
        });

        this.dialogVisible = true;
      } else if (mode === "line") {
        this.people.id = row.peopleId;
        this.people.name = row.name;
        this.people.phone = row.phonenumber;
        this.activities = [];
        travelList({ peopleId: this.people.id }).then((response) => {
          if (response.rows.length === 0) {
            trackList({ peopleId: this.formQuery.id }).then((res) => {
              for (var index in res.rows) {
                this.activities.push({
                  content: response.rows[index].address,
                  timestamp: response.rows[index].time,
                });
              }
            });
          } else {
            for (var index in response.rows) {
              this.activities.push({
                content: response.rows[index].address,
                timestamp: response.rows[index].arriveTime,
              });
            }
          }
        });
        this.drawerVisible = true;
      } else if (mode === "check") {
        this.$router.push({
          name: "track",
          params: {
            peopleId: this.people.id,
            peoplePhone: this.people.phone,
            peopleName: this.people.name,
          },
        });
      }
    },
    getList() {
      this.loading = true;
      var list = [];
      infectList(this.queryParams).then((response) => {
        this.total = response.rows.length;
        this.infectList = response.rows;
        if (this.startDate != "") {
          TimeList(this.startDate, this.endDate).then((res) => {
            for (var i in this.infectList) {
              for (var index in res.rows) {
                if (res.rows[index].peopleId === this.infectList[i].peopleId) {
                  list.push(res.rows[index]);
                  continue;
                }
              }
            }
            this.total = list.length;
            this.infectList = list;
            if (this.total > this.pageSize) {
              for (let index = 0; index < this.pageSize; index++) {
                this.tableDataEnd.push(this.infectList[index]);
              }
            } else {
              this.tableDataEnd = this.infectList;
            }
          });
        }
        if (this.total > this.pageSize) {
          for (let index = 0; index < this.pageSize; index++) {
            this.tableDataEnd.push(this.infectList[index]);
          }
        } else {
          this.tableDataEnd = this.infectList;
        }
        this.loading = false;
      });
    },
    resetQuery() {
      this.queryParams.status = 3;
      this.queryParams.name = "";
      this.queryParams.peopleId = "";
      this.queryParams.type = "";
      this.queryDateRange = [];
      this.queryParams.ancestors = "";
      this.selectedOptions = "";
      this.startDate = "";
      this.endDate = "";
      //this.handleQuery();
      this.getList();
    },
    handleExport() {
      let that = this;
      require.ensure([], () => {
        const { export_json_to_excel } = require("@/excel/Export2Excel");
        const tHeader = ["姓名", "身份证号", "联系电话", "确诊时间"];
        const filterVal = ["name", "peopleId", "phonenumber", "positiveTime"];
        const list = that.infectList;
        const data = that.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, "感染人员表");
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]));
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
.radio {
  font-size: 17px;
  font-weight: 500;
  margin-bottom: 30px;
}
.timeline {
  margin-left: 0px;
}
.noun {
  float: left;
  color: #1e1e1e;
  font-size: 20px;
  font-weight: 600;
}
.info {
  color: #2e2d2d;
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