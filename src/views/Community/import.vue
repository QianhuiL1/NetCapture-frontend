<template>
<div class="home_container">
  <el-card class="table_content">  
      <div class="center_content">
      <div class="theme">
        <span>
      旅居人员上报记录
      </span>
      </div>
      <div>
      <el-button
        icon="el-icon-plus"
        type="primary"
        size="small"
        @click="handleAdd"
        >上报旅居人员</el-button>
      </div>
      </div>
    </el-card>
      <div class="center-content">
    <el-card class="table_content">
      <el-form ref="queryForm" :model="queryParams"
      :inline="true" size="medium">
      <el-form-item label="身份证号" prop="id" style="float: left;margin-left:50px;">
        <el-input
          v-model="queryParams.id"
          placeholder="请输入旅居人员身份证号"
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
          ><el-button
        icon="el-icon-share"
        type="primary"
        size="mini"
        @click="handleExport"
        plain
      >导出</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
  <div class="center-content">
    <el-card class="table_content">
      <el-table
       v-loading="loading"
       id="statisTable"
       :data="tableDataEnd"
       border
       highlight-current-row
       ref="importTable">
       <el-table-column
          label="姓名"
          prop="name"
          :show-overflow-tooltip="true"
          min-width="10%"
        />
        <el-table-column label="性别" prop="ownsex" min-width="10%" >
          <template slot-scope="scope">
            <span v-if="scope.row.sex=='0'">女</span>
            <span v-else>男</span>
          </template>
        </el-table-column>
        <el-table-column label="身份证号" prop="peopleId" min-width="20%" />
        <el-table-column label="联系电话" prop="phonenumber" min-width="20%" />
        <el-table-column label="状态" prop="type" min-width="10%">
          <template slot-scope="scope">
            <span v-if="scope.row.status=='0'">健康</span>
            <span v-else-if="scope.row.status=='1'">次密接</span>
            <span v-else-if="scope.row.status=='2'">密接</span>
            <span v-else>阳性</span>
          </template>
        </el-table-column>
        <el-table-column label="来源地" prop="fromAncestors" min-width="20%"></el-table-column>
        <el-table-column label="交通方式" prop="transportation" min-width="20%"></el-table-column>
        <el-table-column label="现居地" prop="toAncestors" min-width="20%"></el-table-column>
        <el-table-column label="详细地址" prop="toAddress" min-width="20%"></el-table-column>
        <el-table-column label="登记时间" prop="recordTime"
        min-width="20%"></el-table-column>
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
  <el-dialog title="旅居人员上报" :visible.sync="dialogVisible" width="40%">
  <el-form
    ref="importForm"
    :model="formData"
    size="medium"
    label-width="100px"
    >
    <el-form-item label="身份证号" prop="peopelId">
      <el-input
        v-model="formData.peopleId"
        placeholder="请输入重点人员身份证号"
        clearable
        prefix-icon="el-icon-star-on"
        :style="{width:'100%'}"
        />
    </el-form-item>
    <el-form-item label="现居详细地址" prop="toAddress">
      <el-input
        v-model="formData.toAddress"
        placeholder="请输入现居地址"
        clearable
        prefix-icon="el-icon-location-information"
        :style="{width:'100%'}"
        />
    </el-form-item>
    <el-form-item label="来源地">
    <template>
        <div>
          <el-cascader 
          v-model="selectedArea" 
          :options="options" 
          placeholder="请选择来源地"
          prefix-icon="el-icon-place"
          :props="{value: 'id',label: 'name'}"
          @change="areaChange"
          :style="{width:'100%'}"
          ></el-cascader>
        </div>
      </template>
    </el-form-item>
    <el-form-item label="交通工具" prop="transportation">
      <el-input
        v-model="formData.transportation"
        placeholder="请输入交通工具"
        clearable
        prefix-icon="el-icon-position"
        :style="{width:'100%'}"
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
import {page,searchById,add,update,deleteById} from '../../api/Community/base'
import {searchById as searchDetail} from '../../api/Person/basic'
import {
  getAncestor
} from "../../api/Region/base";
let pcas = require("./pcas/pcas-code.json")
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
import {CodeToText} from 'element-china-area-data'

export default {
  name:'importNew',
  data() {
    return {
      dialogVisible: false,
      queryParams:{id: ''},
      ancestors: '0,420000,420302',
      formData:{},
      importTable: [],
      loading: false,
      options: pcas,
      selectedArea: '',
      total:1,
      tableDataEnd:[],
      pageSize:15,
      currentPage:1,
      tempItem:{
        name:'',
        sex: '',
        peopleId: '',
        phonenumber: '',
        status:'',
        fromAncestors:'',
        toAncestors:'',
        transportation:'',
        toAddress:'',
        recordTime:''
      }
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
    initTable(){
      this.loading=true
      var tempArray=[]
       getAncestor(this.$store.state.user.dept).then((res)=>{
      page(this.ancestors).then(response=>{
        console.log(response)
        response.rows.forEach(item => {
          this.tempItem=item
          this.tempItem.name=item.personInfo.name
          this.tempItem.phonenumber=item.personInfo.phonenumber
          this.tempItem.toAddress=item.personInfo.address
          this.tempItem.sex=item.personInfo.sex
          this.tempItem.status=item.personInfo.status
          var fromArray=item.fromAncestors.split(',')
          var name1=''
          for(var i=1;i<fromArray.length;i++){
            name1+= CodeToText[fromArray[i]]+' '
          }
          this.tempItem.fromAncestors=name1
          var toArray =item.toAncestors.split(',')
          var name2=''
          for(var j=1;j<toArray.length;j++){
            name2+=CodeToText[toArray[j]]+' '
          }
          this.tempItem.toAncestors=name2
          tempArray.push(this.tempItem)
        });
        this.importTable=tempArray
        this.total=this.importTable.length
        if (this.total > this.pageSize) {
          for (let index = 0; index < this.pageSize; index++) {
            this.tableDataEnd.push(this.importTable[index]);
          }
        } else {
          this.tableDataEnd = this.importTable;
        }
        this.loading= false;
    })
       })
    },
    handleAdd(){
      this.dialogVisible=true
    },
    handleChange(value){
    },
    handleQuery(){
      this.loading=true
      this.importTable=[]
      if(this.queryParams.id==''){
        this.initTable()
      }else{
        searchById(this.queryParams.id).then(res=>{
          console.log(res)
        if(res.total<1){
          console.log('小于1')
          this.importTable=[]
          this.total=0
          if (this.total > this.pageSize) {
          for (let index = 0; index < this.pageSize; index++) {
            this.tableDataEnd.push(this.importTable[index]);
          }
          } else {
            this.tableDataEnd = this.importTable;
          }
          this.loading=false
          // 若查询为空
        }else{
          this.tempItem=res.rows[0]
          this.tempItem.name=res.rows[0].personInfo.name
          this.tempItem.peopleId=res.rows[0].personInfo.peopleId
          this.tempItem.phonenumber=res.rows[0].personInfo.phonenumber
          this.tempItem.toAddress=res.rows[0].personInfo.address
          this.tempItem.sex=res.rows[0].personInfo.sex
          this.tempItem.status=res.rows[0].personInfo.status
          var fromArray=res.rows[0].fromAncestors.split(',')
          var name1=''
          for(var i=1;i<fromArray.length;i++){
            name1+= CodeToText[fromArray[i]]+' '
          }
          this.tempItem.fromAncestors=name1
          var toArray =res.rows[0].toAncestors.split(',')
          var name2=''
          for(var j=1;j<toArray.length;j++){
            name2+=CodeToText[toArray[j]]+' '
          }
          this.tempItem.toAncestors=name2
          this.total=1
          this.importTable.push(this.tempItem)
          this.loading=false
          if (this.total > this.pageSize) {
          for (let index = 0; index < this.pageSize; index++) {
            this.tableDataEnd.push(this.importTable[index]);
          }
          } else {
            this.tableDataEnd = this.importTable;
          }
        }
      })
      }
    },
    resetQuery(){
      this.queryParams={
        id:''
      }
    },
    areaChange(){
    },
    submitForm(){
      if(this.formData.peopleId==''||this.formData.toAddress==''){
        this.$message.error('身份证号和现居地不能为空');
      }else{
        if(this.selectedArea==''){
        this.$message.error('来源地不能为空');
        }else{
          this.formData.toAncestors=this.ancestors
          this.formData.fromAncestors="0,"+this.selectedArea[0]+"0000,"+this.selectedArea[2]
          this.formData.recordTime=this.getCurrentTime()
          add(this.formData).then(res=>{
            console.log(res)
            this.$message.success('添加成功');
            this.initTable()
            this.dialogVisible= false
          })
        }
      }
    },
    resetForm(){
      this.formData={}
    },
    getCurrentTime() {
        //获取当前时间并打印
        let yy = new Date().getFullYear();
        let mm = new Date().getMonth()+1;
        let dd = new Date().getDate();
        var gettime = yy+'-'+mm+'-'+dd
        return gettime
    },
    handleExport(){
      let xlsxParam = { raw: true }
      var wb = XLSX.utils.table_to_book(document.querySelector('#statisTable'),xlsxParam)
      var wbout = XLSX.write(wb, {
        bookType: 'xlsx',
        bookSST: true,
        type: 'array'
      })
      try {
        FileSaver.saveAs(
          new Blob([wbout], { type: 'application/octet-stream' }),
          "旅居人员登记列表" + '.xlsx'
        )
      } catch (e) {
        // if (typeof console !== 'undefined') console.log(e, wbout)
      }
      return wbout
    }
  }
}
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
