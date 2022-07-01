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
       :data="importTable"
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
        <el-table-column label="交通方式" prop="fromAncestors" min-width="20%"></el-table-column>
        <el-table-column label="现居地" prop="toAncestors" min-width="20%"></el-table-column>
        <el-table-column label="详细地址" prop="toAddress" min-width="20%"></el-table-column>
        <el-table-column label="登记时间" prop="recordTime"
        min-width="20%"></el-table-column>
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
        prefix-icon="el-icon-mobile"
        :style="{width:'100%'}"
        />
    </el-form-item>
    <el-form-item label="现居详细地址" prop="toAddress">
      <el-input
        v-model="formData.toAddress"
        placeholder="请输入现居地址"
        clearable
        prefix-icon="el-icon-mobile"
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
          :props="{value: 'id',label: 'name'}"
          @change="areaChange"
          :style="{width:'100%'}"
          ></el-cascader>
        </div>
      </template>
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
import {getAreaById} from '../../api/Ancestor/base'
let pcas = require("./pcas/pcas-code.json")
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
import Pagination from '../../components/Pagination'

export default {
  name:'importNew',
  components:{
    Pagination
  },
  data() {
    return {
      dialogVisible: false,
      queryParams:{id: '',_page: 1,
        _limit: 10,},
      formData:{},
      importTable: [],
      loading: false,
      options: pcas,
      selectedArea: '',
      total:1,
    }
  },
  created() {
    this.initTable()
  },
  methods:{
    initTable(){
      this.loading=true
      var tempArray=[]
      page(this.queryParams).then(response=>{
        console.log(response)
        this.total=response.rows.length
      response.rows.forEach(item => {
        var temp = {}
        temp.toAddress=item.toAddress
        temp.recordTime=item.recordTime
        temp.peopleId = item.peopleId
        getAreaById(item.toAncestors).then(re=>{
          temp.toAncestors = re.data.name
          getAreaById(item.fromAncestors).then(resp=>{
          temp.fromAncestors=resp.data.name
          searchDetail(item.peopleId).then(res=>{
          temp.status=res.data.status
          temp.sex = res.data.sex
          temp.phonenumber=res.data.phonenumber
          temp.name = res.data.name
          tempArray.push(temp)
           this.loading=false
        })
        })        
        })
      });
    })
      this.importTable=tempArray
      // this.sleep1(5000)
    },
    handleAdd(){
      this.dialogVisible=true
    },
    handleChange(value){
    },
    handleQuery(){
      this.importTable=[]
      if(this.queryParams.id==''){
        this.initTable()
      }else{
        searchById(this.queryParams.id).then(res=>{
        if(res.total<1){
          // 若查询为空
        }else{
          var temp = {}
          temp.toAddress=res.rows[0].toAddress
          temp.recordTime=res.rows[0].recordTime
          temp.peopleId = res.rows[0].peopleId
          getAreaById(res.rows[0].toAncestors).then(re=>{
          temp.toAncestors = re.data.name
          getAreaById(res.rows[0].fromAncestors).then(resp=>{
          temp.fromAncestors=resp.data.name
          searchDetail(temp.peopleId).then(res=>{
            temp.phonenumber=res.data.phonenumber
            temp.name = res.data.name
            temp.sex= res.data.sex=="1"?"女":"男"
            if(res.data.status=="0"){
              temp.status = "健康"
            }else if(res.data.status=="1"){
              temp.status ="次密接"
            }else if (res.data.status=="2"){
              temp.status="密接"
            }else{
              temp.status="阳性"
            }
            console.log(temp)
            this.importTable.push(temp)
          })
          })
          })
        }
      })
      }
    },
    resetQuery(){
      this.queryParams={}
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
          this.formData.toAncestors="0,420000,420984"

          this.formData.fromAncestors="0,"+this.selectedArea[0]+"0000,"+this.selectedArea[2]
          this.formData.recordTime=this.getCurrentTime()
          add(this.formData).then(res=>{
            console.log(res)
            this.$message.success('添加成功');
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
