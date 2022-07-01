<template>
  <div class="home_container">
      <el-card class="table_content">
        <div class="center_content">
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
      <el-card class="table_content">
        <el-form
          ref="queryForm"
          :model="queryParams"
          :inline="true"
          size="medium"
        >
          <el-form-item label="姓名：" prop="name" style="float: left;margin-left:50px;">
            <el-input
              v-model="queryParams.name"
              placeholder="请输入住户姓名"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="身份证号：" prop="peopleId" style="float: left;margin-left:50px;">
            <el-input
              v-model="queryParams.peopleId"
              placeholder="请输入身份证号"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="状态：" prop="type" style="float: left;margin-left:50px;">
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
    
    <div class="center-content">
      <el-card class="table_content">
        <el-table
          v-loading="loading"
          id="statisTable"
          :data="infectTable"
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
          <el-table-column label="状态更新时间" prop="infectTime" min-width="20%"/>
        </el-table>
        <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams._page"
        :limit.sync="queryParams._limit"
        style="float: right; margin: 20px"
        @pagination="getInfectList"
      />
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
            prefix-icon="el-icon-mobile"
            :style="{ width: '100%' }"
          />
        </el-form-item>
        <el-form-item label="身份证号" prop="name">
          <el-input
            v-model="formData.name"
            placeholder="请输入重点人员身份证号"
            clearable
            prefix-icon="el-icon-mobile"
            :style="{ width: '100%' }"
          />
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
  deletePersonInfo,
  searchByName,
  searchById,
} from "../../api/Person/basic";
import FileSaver from "file-saver";
import XLSX from "xlsx";
import Pagination from '../../components/Pagination'

export default {
  name: "infectTable",
  components: {
    Pagination
  },
  data() {
    return {
      param: {
        ancestors: "0,420000,420102",
      },
      dialogVisible: false,
      typeArr: [
        { name: "阳性", value: "阳性" },
        { name: "密接", value: "密接" },
        { name: "次密接", value: "次密接" },
      ],
      total:1,
      queryParams: {
        _page: 1,
        _limit: 10,
        name: "",
        type: "",
        peopleId: "",
      },
      infectTable:[],
      formData:{
        peopleId: '',
        name: '',
        sex: '',
        phonenumber: '',
        status:'',
        ancestors:'',
        address: '',
        searchValue:'',
        createBy:'',
        createTime:'',
        remark:'',
        params:{}
      },
      loading: false
    }
  },
  created() {
     this.getInfectList();
  },
  methods: {
    getInfectList() {
      this.loading = true;
      var temp = [];
      searchByArea(this.param.ancestors).then((res) => {
        res.rows.forEach((item) => {
          if (item.status != "0") {
            item.infectTime=this.formatDate(item.positiveTime)
            console.log(item.infectTime)
            temp.push(item);
          }
        });
        this.infectTable = temp;
        this.total = res.rows.length
        this.loading = false;
      });
    },
    handleQuery() {
      this.loading = true;
      if (this.queryParams.name != "") {
        console.log("姓名不为空");
        searchByName(this.queryParams.name).then((res) => {
          console.log(res);
          if (res.rows.length < 1) {
            this.infectTable = [];
          } else {
            res.rows.forEach((item) => {
              if (item.ancestors == this.param.ancestors) {
                if (item.status != "0") {
                  this.infectTable = [];
                  this.infectTable.push(item);
                }
              }
            });
          }
        });
      } else if (this.queryParams.peopleId != "") {
        console.log("id不为空");
        searchById(this.queryParams.peopleId).then((res) => {
          this.infectTable = [];
          if (res.data.ancestors == this.param.ancestors) {
            if (res.data.status != "0") {
              this.infectTable.push(res.data);
            }
          }
        });
      } else if (this.queryParams.type != "") {
        var temp = [];
        searchByArea(this.param.ancestors).then((res) => {
          res.rows.forEach((item) => {
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
        });
        console.log("type不为空");
      } else {
        console.log("都为空");
        this.getInfectList();
      }
      this.loading = false;
    },
    resetQuery() {
      this.queryParams = {
        name:'',
        peopleId: '',
        type: ''
      }
    },
    handleAdd(){
      this.formData.name=''
      this.formData.peopleId=''
      this.dialogVisible=true
    },
    submitForm(){
      if(this.formData.name==''){
        this.$message.error('姓名不能为空!')
      }else if(this.formData.peopleId==''){
        this.$message.error('身份证号不能为空!');
      }else{
        searchById(this.formData.peopleId).then(res=>{
          if(res.data.name!=this.formData.name){
            this.$message.error('身份证号与姓名不符!');
          }else{
            this.formData=res.data
            this.formData.status='3'
            updatePersonInfo(this.formData).then(resp=>{
              this.$message.success('修改成功');
              this.dialogVisible= false
              this.initTable()
            })
          }
        })
      }
    },
    resetForm(){
      this.formData.name=''
      this.formData.peopleId=''
    },
    handleExport(){
      var wb = XLSX.utils.table_to_book(document.querySelector('#statisTable'))
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
			let time =new Date(value);
			let Y = time.getFullYear();
			let M = time.getMonth() + 1;
			let D = time.getDate();
			let h = time.getHours();
			let m = time.getMinutes();
			let s = time.getSeconds();
			return Y + '-' + (M < 10 ? '0' + M : M) + '-' + (D < 10 ? '0' + D : D) + ' ' + (h < 10 ? '0' + h : h) + ':' + (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s);
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
.center_content{
    margin-top: 3px;
    display: flex;
    flex-direction:row;
    justify-content: space-between;
}
  .theme{
    color:#1E1E1E;
    font-size: 20px;
    font-weight: 550;
    padding:0px;
  }
  .inputTitle{
    font-size: 15px;
    font-weight: 500;
    float:left;
    padding: 2px
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