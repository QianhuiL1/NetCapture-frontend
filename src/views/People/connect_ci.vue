<template>
  <div class="home_container">
    <el-card class="table_content">
      <div class="center_content">
        <div class="theme">
          <span> 次密接人员列表 </span>
        </div>
        <div>
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="medium"
            @click="handleAdd"
            >新增人员信息</el-button
          >
        </div>
      </div>
    </el-card>
    <el-card class="table_content">
      <el-form ref="queryForm" :model="queryParams" :inline="true" size="small">
        <el-form-item label="姓名:" prop="name" style="float: left;margin-left:50px;">
          <el-input
            v-model="queryParams.name"
            placeholder="请输入人员姓名"
            clearable
            @keyup.enter.native="getList"
          />
        </el-form-item>
        <el-form-item label="身份证号:" prop="id" style="float: left;margin-left:50px;">
          <el-input
            v-model="queryParams.people_id"
            placeholder="请输入身份证号"
            clearable
            @keyup.enter.native="getList"
          />
        </el-form-item>
        <el-form-item label="家庭住址:" style="float: left;margin-left:50px;">
          <el-input
            v-model="queryParams.address"
            placeholder="请输入家庭住址"
            clearable
            @keyup.enter.native="getList"
          />
        </el-form-item>
         <el-form-item label="地区：" prop="city">
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
            @click="getList"
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
      <p></p>

      <el-table
        v-loading="loading"
        id="statisTable"
        :data="tableDataEnd"
        border
        highlight-current-row
      >
        <el-table-column
          label="姓名"
          prop="name"
          :show-overflow-tooltip="true"
          min-width="20%"
        />
        <el-table-column label="身份证号" prop="people_id" min-width="25%" />
        <el-table-column label="联系电话" prop="phonenumber" min-width="20%" />
        <el-table-column label="家庭住址" prop="address" min-width="30%">
        </el-table-column>
        <el-table-column label="操作" min-width="20%">
          <template slot-scope="scope">
            <el-button size="medium" type="text" @click="handleEdit(scope.row)">
              <i class="el-icon-edit" style="color: #3388ff" />
              <span style="color: #223355"> 编辑</span>
            </el-button>
            <el-button
              size="medium"
              type="text"
              @click="handleDelete(scope.row.people_id)"
            >
              <i class="el-icon-delete" style="color: #d81e06" />
              <span style="color: #223355"> 删除</span></el-button
            >
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
      :total="total">
    </el-pagination>
    </el-card>
    <el-dialog title="编辑" :visible.sync="centerDialogEdit" width="30%">
      <div class="inputTitle"><span> 姓名： </span></div>
      <el-input
        v-model="info.name"
        placeholder="请输入人员姓名"
        @input="change($event)"
      ></el-input>
      <div class="inputTitle"><span> 身份证号： </span></div>
      <el-input
        v-model="info.people_id"
        placeholder="请输入身份证号"
        @input="change($event)"
        disabled='true'
      ></el-input>
      <div class="inputTitle"><span> 联系电话： </span></div>
      <el-input
        v-model="info.phonenumber"
        placeholder="请输入联系电话"
        @input="change($event)"
      ></el-input>
      <div class="inputTitle"><span> 家庭住址： </span></div>
      <el-input
        v-model="info.address"
        placeholder="请输入家庭住址"
        @input="change($event)"
      ></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button
          @click="
            centerDialogEdit = false;
            listID = '';
          "
          >取 消</el-button
        >
        <el-button type="primary" @click="edit">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="新增" :visible.sync="centerDialogAdd" width="30%">
      <div class="inputTitle"><span> 姓名： </span></div>
      <el-input
        v-model="info.name"
        placeholder="请输入人员姓名"
        @input="change($event)"
      ></el-input>
      <div class="inputTitle"><span> 身份证号： </span></div>
      <el-input
        v-model="info.people_id"
        placeholder="请输入身份证号"
        @input="change($event)"
        @keyup.enter.native="queryInfo"
      ></el-input>
      <div class="inputTitle"><span> 联系电话： </span></div>
      <el-input
        v-model="info.phonenumber"
        placeholder="请输入联系电话"
        @input="change($event)"
      ></el-input>
      <div class="inputTitle"><span> 家庭住址： </span></div>
      <el-input
        v-model="info.address"
        placeholder="请输入家庭住址"
        @input="change($event)"
      ></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button
          @click="
            centerDialogAdd = false;
            listID = '';
          "
          >取 消</el-button
        >
        <el-button type="primary" @click="add">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>


<script>
import {
  infectList,
  infectInfo,
  infectUpdate,
} from "../../api/People/infect/basic";
import { regionData} from 'element-china-area-data'
export default {
  name: "connectList",
  created() {
    this.getList();
  },
  data() {
    return {
      // 将省市区数据赋给级联选择器
      options: regionData,
      // 存放用户选择后省市区的信息
      selectedOptions: [],
      total: 1,
      tableDataEnd:[],
      pageSize:10,
      currentPage:1,
      centerDialogAdd: false,
      centerDialogEdit: false,
      centerDialogDel: false,
      info: {
        name: "",
        people_id: "",
        phonenumber: "",
        address: "",
      },
      type: "",
      id: "",
      queryParams: {
        name: "",
        people_id: "",
        address: "",
        status: 1,
      },
      queryDateRange: [],
      connectList: [],
      value: "",
    };
  },
  methods: {
     handleSizeChange: function (pageSize) { // 每页条数切换
        this.pageSize = pageSize;
        this.handleCurrentChange(this.currentPage);
      },
      handleCurrentChange: function (currentPage) {//页码切换
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
}}},
    change(e) {
      this.$forceUpdate();
    },
    handleQuery(){
this.queryParams.ancestors='0'+','+this.selectedOptions[0]+','+this.selectedOptions[2]
      this.getList();
},
    handleEdit(row) {
      this.centerDialogEdit = true;
      this.info.name = row.name;
      this.info.people_id = row.people_id;
      this.info.phonenumber = row.phonenumber;
      this.info.address = row.address;
      this.listID = row.people_id;
    },
    edit() {
      infectUpdate(this.info).then((response) => {
        this.$message.success("修改成功！");
        this.getList();
      });
      this.info.name = "";
      this.info.people_id = "";
      this.info.phonenumber = "";
      this.info.address = "";
      this.centerDialogEdit = false;
    },
    handleAdd() {
      this.info.name = "";
      this.info.people_id = "";
      this.info.phonenumber = "";
      this.info.address = "";
      this.centerDialogAdd = true;
    },
    add() {
      infectInfo(this.info.people_id).then((response) => {
        if (response.data.name === "") {
          this.$message.warning("未查询到有关人员信息！");
          return;
        } else if (response.data.status === "1") {
          this.$message.warning("该次密接人员信息已存在！");
          return;
        } else {
          infectUpdate({ people_id: this.info.people_id, status: 1 });
          this.$message.success("添加成功");
          this.centerDialogAdd = false;
          this.info.name = "";
          this.info.people_id = "";
          this.info.phonenumber = "";
          this.info.address = "";
          this.getList();
        }
      });
    },
    handleDelete(id) {
      if (id.length === 0) return;
      this.$confirm("是否确认删除该次密接人员记录?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return infectUpdate({ people_id: id, status: 0 });
        })
        .then(() => {
          this.getList();
          this.$message.success("删除成功");
        })
        .catch(() => {});
    },
    getList() {
      this.loading = true;
      this.tableDataEnd = []
      infectList(this.queryParams).then((response) => {
        this.total = response.rows.length
        this.connectList = response.rows;
        if (this.total > this.pageSize) {
        for (let index = 0; index < this.pageSize; index++) {
          this.tableDataEnd.push(this.connectList[index]);
        }
      } else {
        this.tableDataEnd = this.connectList;
      }
        this.loading = false;
      });
    },
    resetQuery() {
      this.queryParams.name = "";
      this.queryParams.people_id = "";
      this.queryParams.address = "";
      this.queryParams.ancestors = ""
      this.selectedOptions = '';
      this.getList();
    },
    queryInfo(){
      if(this.info.people_id!=""){
      infectInfo(this.info.people_id).then((response)=>{
      this.info=response.data
    })
  }},
  handleExport(){
      let that = this
      require.ensure([],()=>{
      const { export_json_to_excel } = require('@/excel/Export2Excel'); 
      const tHeader = ['姓名','身份证号','联系电话','家庭住址']; 
      const filterVal =['name','peopleId','phonenumber','address']; 
      const list = that.connectList;
      const data = that.formatJson(filterVal, list);
      export_json_to_excel(tHeader, data, '次密接人员表');
      })
    },
    formatJson (filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    }
  },
};
</script>

<style lang="scss" scoped>
.home_container {
  padding: 2px 5px;
  line-height: 1;
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