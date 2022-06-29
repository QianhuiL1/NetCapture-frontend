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
        </el-form-item>
      </el-form>
    </el-card>
  </div>
  <div class="center-content">
    <el-card class="table_content">
      <el-button
        icon="el-icon-share"
        type="primary"
        size="mini"
        @click="handleExport"
      >导出</el-button>
      <el-table
        id="statisTable"
       :data="residentTable"
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
              <i class="el-icon-edit" style="color: #3388ff" />
              <span style="color: #223355"> 修改信息</span>
            </el-button>
        </template>
      </el-table-column>
       </el-table>
        <!-- <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams._page"
        :limit.sync="queryParams._limit"
        style="float: right; margin: 20px"
        @pagination="getList"
      /> -->
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
import Pagination from "@/components/Pagination";
import { searchByArea,updatePersonInfo,deletePersonInfo,searchByName, searchById } from "../../api/Person/basic";
import FileSaver from 'file-saver'
import XLSX from 'xlsx'


export default{
  name:'residentList',
  component:{
    Pagination,
  },
  data() {
    return {
      residentTable:[],
      param:{
        ancestors: "0,420000,420102"
      },
      queryParams:{
        name: '',
        peopleId: ''
      },
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
      rawId:''
    }
  },
  created() {
    this.initTable()
  },
  methods:{
    initTable(){
      searchByArea(this.param.ancestors).then(res=>{
      this.residentTable=res.rows
    })
    },
    handleQuery(){
      if(this.queryParams.name==''&&this.queryParams.peopleId=='')
      {
        this.initTable()
      }else if(this.queryParams.peopleId!=''){
        searchById(this.queryParams.peopleId).then(res=>{
          this.residentTable=[]
          this.residentTable.push(res.data)
        })
      }else if(this.queryParams.name!=''){
        searchByName(this.queryParams.name).then(response=>{
          if(response.rows.length<1){
            this.residentTable=[]
          }else{
            response.rows.forEach(item=>{
              if(item.ancestors==this.param.ancestors){
                this.residentTable=[]
                this.residentTable.push(item)
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
      deletePersonInfo(this.rawId).then(item=>{
        updatePersonInfo(this.editFormData).then(res=>{
        this.$message.success('修改成功');
        this.dialogVisible= false
      })
      })
    },
    resetQuery(){ 
      this.queryParams={}
    },
    // handleExport(){
    //   let xlsxParam = { raw: true }
    //   var wb = XLSX.utils.table_to_book(document.querySelector('#statisTable'),xlsxParam)
    //   var wbout = XLSX.write(wb, {
    //     bookType: 'xlsx',
    //     bookSST: true,
    //     type: 'array'
    //   })
    //   try {
    //     FileSaver.saveAs(
    //       new Blob([wbout], { type: 'application/octet-stream' }),
    //       "社区居民信息表" + '.xlsx'
    //     )
    //   } catch (e) {
    //     // if (typeof console !== 'undefined') console.log(e, wbout)
    //   }
    //   return wbout
    // }
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



</style>