<template>
  <div class="home_container">
    <div class="center_content">
      <el-card class="table_content">
        <div class="firstLine">
          <div class="theme">
            <span> 重点人员上报记录 </span>
          </div>
          <div>
            <el-button
              icon="el-icon-plus"
              type="primary"
              size="small"
              @click="handleAdd"
              >上报重点人员</el-button
            >
          </div>
        </div>
      </el-card>
    </div>
    <div class="center-content">
      <el-card class="table_content">
        <el-form
          ref="queryForm"
          :model="queryParams"
          :inline="true"
          size="medium"
        >
          <el-form-item
            label="姓名："
            prop="name"
            style="float: left; margin-left: 50px"
          >
            <el-input
              v-model="queryParams.name"
              placeholder="请输入住户姓名"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item
            label="身份证号："
            prop="peopleId"
            style="float: left; margin-left: 50px"
          >
            <el-input
              v-model="queryParams.peopleId"
              placeholder="请输入身份证号"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item
            label="状态："
            prop="type"
            style="float: left; margin-left: 50px"
          >
            <el-select
              v-model="queryParams.type"
              placeholder="请选择人员状态"
              @change="handleQuery"
            >
              <el-option
                v-for="(item, $index) in typeArr"
                :key="$index"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
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
              plain
              >导出</el-button
            >
          </el-form-item>
        </el-form>
      </el-card>
    </div>
    <div class="center_content">
      <el-card class="table_content">
        <el-table
          v-loading="loading"
          id="statisTable"
          :data="tableDataEnd"
          border
          hightlight-current-row
          ref="infectTable"
        >
          <el-table-column
            label="姓名"
            prop="name"
            :show-overflow-tooltip="true"
            min-width="20%"
          />
          <el-table-column label="性别" prop="ownsex" min-width="10%">
            <template slot-scope="scope">
              <span v-if="scope.row.sex == '0'">女</span>
              <span v-else>男</span>
            </template>
          </el-table-column>
          <el-table-column label="身份证号" prop="peopleId" min-width="20%" />
          <el-table-column label="状态" prop="type" min-width="10%">
            <template slot-scope="scope">
              <span v-if="scope.row.status == '0'">健康</span>
              <span v-else-if="scope.row.status == '1'">次密接</span>
              <span v-else-if="scope.row.status == '2'">密接</span>
              <span v-else>阳性</span>
            </template>
          </el-table-column>
          <el-table-column
            label="联系电话"
            prop="phonenumber"
            min-width="20%"
          />
          <el-table-column label="居住地址" prop="address" min-width="30%" />
          <el-table-column
            label="状态更新时间"
            prop="infectTime"
            min-width="20%"
          />
        </el-table>
        <el-pagination
          v-show="total > 0"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 15, 30, 50]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </el-card>
    </div>
    <el-dialog title="重点人员上报" :visible.sync="dialogVisible" width="40%">
      <el-form
        ref="importForm"
        :model="formData"
        size="medium"
        label-width="80px"
      >
        <el-form-item label="姓名" prop="name">
          <el-input
            v-model="formData.name"
            placeholder="请输入重点人员姓名"
            clearable
            prefix-icon="el-icon-user-solid"
            :style="{ width: '100%' }"
          />
        </el-form-item>
        <el-form-item label="身份证号" prop="name">
          <el-input
            v-model="formData.peopleId"
            placeholder="请输入重点人员身份证号"
            clearable
            prefix-icon="el-icon-star-on"
            :style="{ width: '100%' }"
          />
        </el-form-item>
        <el-form-item label="确诊时间" prop="positiveTime">
          <el-date-picker
            v-model="formData.positiveTime"
            type="datetime"
            placeholder="选择日期时间"
            prefix-icon="el-icon-time"
            :style="{ width: '100%' }"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item size="medium">
          <el-button type="primary" @click="submitForm">提交</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  searchByArea,
  updatePersonInfo,
  searchByName,
  searchById,
} from "../../api/Person/basic";
import { CodeToText,TextToCode } from "element-china-area-data";
import {
  getAncestor
} from "../../api/Region/basic";
import FileSaver from "file-saver";
import XLSX from "xlsx";

export default {
  name: "infectTable",
  data() {
    return {
      param: {
        ancestors: "",
      },
      dialogVisible: false,
      typeArr: [
        { name: "阳性", value: "阳性" },
        { name: "密接", value: "密接" },
        { name: "次密接", value: "次密接" },
      ],
      total: 1,
      tableDataEnd: [],
      pageSize: 15,
      currentPage: 1,
      queryParams: {
        name: "",
        type: "",
        peopleId: "",
      },
      infectTable: [],
      formData: {
        name: "",
        peopleId: "",
        positiveTime: "",
      },
      submitData: {
        peopleId: "",
        name: "",
        sex: "",
        phonenumber: "",
        status: "",
        ancestors: "",
        positiveTime: "",
        address: "",
        searchValue: "",
        createBy: "",
        createTime: "",
        remark: "",
        params: {},
      },
      loading: false,
    };
  },
  created() {
    this.getInfectList();
  },
  methods: {
    handleSizeChange: function (pageSize) {
      // 每页条数切换
      this.pageSize = pageSize;
      this.handleCurrentChange(this.currentPage);
    },
    handleCurrentChange: function (currentPage) {
      //页码切换
      this.currentPage = currentPage;
      this.currentChangePage(this.connectList, currentPage);
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
    getInfectList() {
      this.loading = true;
      var temp = [];
      getAncestor(this.$store.state.user.dept).then((res)=>{
        let arr=res.data.ancestors.split(',')
this.param.ancestors=arr[0]+arr[1]+arr[2]
searchByArea(this.param.ancestors).then((res) => {
        res.rows.forEach((item) => {
          if (item.status != "0") {
            item.infectTime = this.formatDate(item.positiveTime);
            temp.push(item);
          }
        });
        this.infectTable = temp;
        this.total = temp.length;
        if (this.total > this.pageSize) {
          for (let index = 0; index < this.pageSize; index++) {
            this.tableDataEnd.push(this.infectTable[index]);
          }
        } else {
          this.tableDataEnd = this.infectTable;
        }
        this.loading = false;
      });
      })
      
    },
    handleQuery() {
      this.loading = true;
      if (this.queryParams.name != "") {
        searchByName(this.queryParams.name).then((res) => {
          if (res.rows.length < 1) {
            this.infectTable = [];
          } else {
            res.rows.forEach((item) => {
              var ancestor = item.ancestors.split(",").join("");
              if (ancestor == this.param.ancestors) {
                if (item.status != "0") {
                  item.infectTime = this.formatDate(item.positiveTime);
                  this.infectTable = [];
                  this.infectTable.push(item);
                  this.total = this.infectTable.length;
                  if (this.total > this.pageSize) {
                    for (let index = 0; index < this.pageSize; index++) {
                      this.tableDataEnd.push(this.infectTable[index]);
                    }
                  } else {
                    this.tableDataEnd = this.infectTable;
                  }
                  this.loading = false;
                }
              }
            });
          }
        });
      } else if (this.queryParams.peopleId != "") {
        searchById(this.queryParams.peopleId).then((res) => {
          this.infectTable = [];
          var ancestor = res.data.ancestors.split(",").join("");
          if (ancestor == this.param.ancestors) {
            if (res.data.status != "0") {
              res.data.infectTime = this.formatDate(res.data.positiveTime);
              this.infectTable.push(res.data);
              this.total = this.infectTable.length;
              if (this.total > this.pageSize) {
                for (let index = 0; index < this.pageSize; index++) {
                  this.tableDataEnd.push(this.infectTable[index]);
                }
              } else {
                this.tableDataEnd = this.infectTable;
              }
              this.loading = false;
            }
          }
        });
      } else if (this.queryParams.type != "") {
        var temp = [];
        searchByArea(this.param.ancestors).then((res) => {
          res.rows.forEach((item) => {
            item.infectTime = this.formatDate(item.positiveTime);
            if (this.queryParams.type == "次密接") {
              if (item.status == "1") {
                temp.push(item);
              }
            } else if (this.queryParams.type == "密接") {
              if (item.status == "2") {
                temp.push(item);
              }
            } else {
              if (item.status == "3") {
                temp.push(item);
              }
            }
          });
          this.infectTable = temp;
          this.total = this.infectTable.length;
          if (this.total > this.pageSize) {
            for (let index = 0; index < this.pageSize; index++) {
              this.tableDataEnd.push(this.infectTable[index]);
            }
          } else {
            this.tableDataEnd = this.infectTable;
          }
          this.loading = false;
        });
      } else {
        this.getInfectList();
      }
    },
    resetQuery() {
      this.queryParams = {
        name: "",
        peopleId: "",
        type: "",
      };
      this.handleQuery();
    },
    handleAdd() {
      this.formData.name = "";
      this.formData.peopleId = "";
      this.dialogVisible = true;
    },
    submitForm() {
      if (this.formData.name == "") {
        this.$message.error("姓名不能为空！");
      } else if (this.formData.peopleId == "") {
        this.$message.error("身份证号不能为空！");
      } else if (this.formData.positiveTime == "") {
        this.$message.error("确诊时间不能为空！");
      } else {
        searchById(this.formData.peopleId).then((res) => {
          if (res.data.name != this.formData.name) {
            this.$message.error("身份证号与姓名不符!");
          } else {
            this.submitData = res.data;
            this.submitData.status = "3";
            updatePersonInfo(this.submitData).then((resp) => {
              this.dialogVisible = false;
              this.getInfectList();
              let ancestor = res.data.ancestors.split(",").join("");
              if (ancestor != this.param.ancestors) {
                this.$message.success("已成功上报非本社区阳性人员");
              } else {
                this.$message.success("已成功上报本社区阳性人员");
              }
              this.getInfectList();
            });
          }
        });
      }
    },
    resetForm() {
      this.formData.name = "";
      this.formData.peopleId = "";
    },
    handleExport() {
      var wb = XLSX.utils.table_to_book(document.querySelector("#statisTable"));
      var wbout = XLSX.write(wb, {
        bookType: "xlsx",
        bookSST: true,
        type: "array",
      });
      try {
        FileSaver.saveAs(
          new Blob([wbout], { type: "application/octet-stream" }),
          "社区重点人员列表" + ".xlsx"
        );
      } catch (e) {
        // if (typeof console !== 'undefined') console.log(e, wbout)
      }
      return wbout;
    },
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
}

.table_content {
  width: 100%;
  padding: 10px 5px 0px 0px;
}
.firstLine {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.first-content {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
}
.center_content {
  margin-top: 3px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.theme {
  color: #1e1e1e;
  font-size: 20px;
  font-weight: 550;
  padding: 0px;
}
.inputTitle {
  font-size: 15px;
  font-weight: 500;
  float: left;
  padding: 2px;
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