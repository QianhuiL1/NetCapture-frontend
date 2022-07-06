<template>
<div class="home_container">
  <div class="center-content">
    <el-card class="table_content">
      <el-form ref="queryForm" :model="queryParams"
      :inline="true" size="medium">
      <el-form-item label="姓名：" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入住户姓名"
          clearable
          @keyup.enter.native="handleQuery"
          />
      </el-form-item>
      <el-form-item label="身份证号：" prop="peopleId">
        <el-input
          v-model="queryParams.peopleId"
          placeholder="请输入身份证号"
          clearable
          @keyup.enter.native="handleQuery"
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
        plain
        @click="handleExport"
      >导出</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
  <div class="center-content">
    <el-card class="table_content">
     
      <el-table
        id="statisTable"
        v-loading="loading"
       :data="tableDataEnd"
       border
       highlight-current-row
       ref="residentTable">
       <el-table-column
          label="姓名"
          prop="name"
          :show-overflow-tooltip="true"
          min-width="10%"
        />
        <el-table-column label="性别" v-model="ownSex" min-width="10%" >
          <template slot-scope="scope">
            <span v-if="scope.row.sex=='0'">女</span>
            <span v-else>男</span>
          </template>
          </el-table-column>
        <el-table-column label="身份证号" prop="peopleId" min-width="20%" />
        <el-table-column label="联系电话" prop="phonenumber" min-width="20%" />
        <el-table-column label="健康状态" v-model="type" min-width="10%">
          <template slot-scope="scope">
            <span v-if="scope.row.status=='0'">健康</span>
            <span v-else-if="scope.row.status=='1'">次密接</span>
            <span v-else-if="scope.row.status=='2'">密接</span>
            <span v-else>阳性</span>
          </template>
        </el-table-column>
        <el-table-column label="居住地址" prop="address" min-width="30%"></el-table-column>
        <el-table-column label="操作" min-width="10%">
          <template slot-scope="scope">
            <el-button
              size="medium"
              type="text"
              @click="handleClick(scope.row)"
            >
              <i class="el-icon-edit" />
              <span style="color: #223355"> 修改信息</span>
            </el-button>
        </template>
      </el-table-column>
       </el-table>
      <el-pagination
       v-show="total > 0"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 15, 30, 50]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>
  </div>
  <el-dialog title="个人信息" :visible.sync="dialogVisible" width="30%">
  <el-form ref="editForm" :model="editFormData"
      :inline="true" size="medium">
      <el-form-item label="姓名：" prop="name">
        <el-input
          v-model="editFormData.name"
          placeholder="请输入住户姓名"
          clearable
          @keyup.enter.native="handleEdit"
          />
      </el-form-item>
      <el-form-item label="身份证号：" prop="peopleId">
        <el-input
          :disabled="true"
          v-model="editFormData.peopleId"
          placeholder="请输入身份证号"
          clearable
          @keyup.enter.native="handleEdit"
          />
      </el-form-item>
      <el-form-item label="联系方式：" prop="phonenumber">
        <el-input
          v-model="editFormData.phonenumber"
          placeholder="请输入联系方式"
          clearable
          @keyup.enter.native="handleEdit"
          />
      </el-form-item>
      <el-form-item label="详细住址：" prop="address">
        <el-input
          v-model="editFormData.address"
          placeholder="请输入联系方式"
          clearable
          @keyup.enter.native="handleEdit"
          />
      </el-form-item>
      <el-form-item>
        <el-button @click="dialogVisible = false">取 消</el-button>        
        <el-button type="primary" @click="handleEdit">确 定</el-button>
      </el-form-item>
      </el-form>
  </el-dialog>
</div>
</template>

<script>
import { searchByArea,updatePersonInfo,deletePersonInfo,searchByName, searchById } from "../../api/Person/basic";
import {
  getAncestor
} from "../../api/Region/basic";

export default{
  name:'residentList',
  data() {
    return {
      loading: false,
      residentTable:[],
      param:{
        ancestors: ""
      },
      queryParams:{
        name: '',
        peopleId: '',
      },
      total: 1,
      tableDataEnd:[],
      pageSize:15,
      currentPage:1,
      dialogVisible: false,
      editFormData: {
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
      rawId:'',
      ownSex:'',
      type:''
    }
  },
  created() {
    this.initTable()
  },
  methods:{
    handleSizeChange: function (pageSize) { // 每页条数切换
        this.pageSize = pageSize;
        this.handleCurrentChange(this.currentPage);
      },
      handleCurrentChange: function (currentPage) {//页码切换
        this.currentPage = currentPage;
        this.currentChangePage(this.residentTable, currentPage);
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
    initTable(){
      this.loading= true
       getAncestor(this.$store.state.user.dept).then((res)=>{
        let arr=res.data.ancestors.split(',')
this.param.ancestors=arr[0]+arr[1]+arr[2]
      searchByArea(this.param.ancestors).then(res=>{
      this.residentTable=res.rows
      this.total=res.rows.length
      if (this.total > this.pageSize) {
        for (let index = 0; index < this.pageSize; index++) {
          this.tableDataEnd.push(this.residentTable[index]);
        }
      } else {
        this.tableDataEnd = this.residentTable;
      }
      this.loading=false
    })
       })
    },
    handleQuery(){
      if(this.queryParams.name==''&&this.queryParams.peopleId=='')
      {
        this.initTable()
      }else if(this.queryParams.peopleId!=''){
        console.log('身份证号不为空')
        console.log(this.queryParams.peopleId)
        searchById(this.queryParams.peopleId).then(res=>{
          console.log(res)
          this.residentTable=[]
          this.residentTable.push(res.data)
          this.total=this.residentTable.length
          this.handleSizeChange(10)
          this.handleCurrentChange(1)
        })
      }else if(this.queryParams.name!=''){
        searchByName(this.queryParams.name).then(response=>{
          if(response.rows.length<1){
            this.residentTable=[]
          }else{
            response.rows.forEach(item=>{
              var ancestor=item.ancestors.split(',').join('')
              if(ancestor==this.param.ancestors){
                this.residentTable=[]
                this.residentTable.push(item)
                this.total=this.residentTable.length
                this.handleSizeChange(10)
                this.handleCurrentChange(1)
              }
            })
          }
        })
      }
    },
    handleClick(row){
      this.dialogVisible = true
      this.editFormData=row
      this.rawId=row.peopleId
    },
    handleEdit(){
      console.log(this.editFormData)
        updatePersonInfo(this.editFormData).then(res=>{
        this.$message.success('修改成功');
        this.dialogVisible= false
      })
    },
    resetQuery(){ 
      this.queryParams={}
    },
    handleExport(){
      this.residentTable.forEach(item=>{
        if(item.sex=='0'){
          item.ownSex = '女'
        }else{
          item.ownSex = '男'
        }
        if(item.status=='0'){
          item.type='健康'
        }else if(item.status=='1'){
          item.type='次密接'
        }else if(item.status=='2'){
          item.type='密接'
        }else{
          item.type='阳性'
        }
      })
      let that = this
      require.ensure([],()=>{
      const { export_json_to_excel } = require('../../excel/Export2Excel'); 
      //使用绝对路径引入Export2Excel.js
      const tHeader = ['姓名','性别','身份证号','电话号码','状态','居住地址']; // 导出的表头名
      const filterVal =['name','ownSex','peopleId','phonenumber','type','address']; // 导出的表头字段名
      const list = that.residentTable;
      const data = that.formatJson(filterVal, list);
      export_json_to_excel(tHeader, data, '社区居民表');
      })
    },
    formatJson (filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    }
  }
}


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
.table_content{
  padding: 10px 5px 0px 0px;
}
.el-icon-edit{
  color: red;
}


</style>