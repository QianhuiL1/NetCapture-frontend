<template>
<div class="home_container">
  <div class="center-content">
    <el-row>
      <el-button
        icon="el-icon-plus"
        type="primary"
        size="small"
        @click="handleAdd"
      >上报重点人员</el-button>
    </el-row>
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
      <el-form-item lable="状态：" prop="type">
        <el-select 
          v-model="queryParams.type"
          placeholder="请选择人员状态"
          @change="handleQuery"
          >
          <el-option
            v-for="(item,$index) in typeArr"
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
      <el-table v-loading="loading"
        id="statisTable"
        :data="infectTable"
        border
        hightlight-current-row
        ref="infectTable">
        <el-table-column
          label="姓名"
          prop="name"
          :show-overflow-tooltip="true"
          min-width="20%"
          />
          <el-table-column label="性别" prop="ownsex" min-width="10%">
            <template slot-scope="scope">
            <span v-if="scope.row.sex=='0'">女</span>
            <span v-else>男</span>
          </template>
          </el-table-column>
          <el-table-column label="身份证号" prop="peopleId" min-width="20%"/>
          <el-table-column label="状态" prop="type"
          min-width="10%">
          <template slot-scope="scope">
            <span v-if="scope.row.status=='0'">健康</span>
            <span v-else-if="scope.row.status=='1'">次密接</span>
            <span v-else-if="scope.row.status=='2'">密接</span>
            <span v-else>阳性</span>
          </template>
          </el-table-column>
          <el-table-column label="联系电话" prop="phonenumber"
          min-width="20%"/>
          <el-table-column label="居住地址" prop="address"
          min-width="30%"/>
      </el-table>
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
        :style="{width:'100%'}"
        />
    </el-form-item>
    <el-form-item label="身份证号" prop="name">
      <el-input
        v-model="formData.name"
        placeholder="请输入重点人员身份证号"
        clearable
        prefix-icon="el-icon-mobile"
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
import { searchByArea,deletePersonInfo,searchByName, searchById } from "../../api/Person/basic";
import FileSaver from 'file-saver'
import XLSX from 'xlsx'

export default{
  name: 'infectTable',
  data() {
    return {
      param:{
        ancestors: "0,420000,420102"
      },
      dialogVisible: false,
      typeArr:[
        {name:'阳性',value:'阳性'},
        {name:'密接',value:'密接'},
        {name:'次密接',value:'次密接'}
      ],
      queryParams:{
        name: '',
        type: '',
        peopleId: ''
      },
      infectTable:[],
      formData:{},
      loading: false
    }
  },
  created(){
    this.getInfectList()
  },
  methods:{
    getInfectList(){
      this.loading=true
      var temp = []
      searchByArea(this.param.ancestors).then(res=>{
        res.rows.forEach(item=>{
          if(item.status!='0'){
            temp.push(item)
          }
        })
        this.infectTable=temp
        this.loading=false
      })
    },
    handleQuery(){
      this.loading =true
      if(this.queryParams.name!=''){
        console.log('姓名不为空')
        searchByName(this.queryParams.name).then(res=>{
          console.log(res)
          if(res.rows.length<1){
            this.infectTable=[]
          }else{
            res.rows.forEach(item=>{
              if(item.ancestors==this.param.ancestors){
                if(item.status!='0'){
                  this.infectTable=[]
                  this.infectTable.push(item)
                }
              }
            })
          }
        })
      }else if(this.queryParams.peopleId!=''){
        console.log('id不为空')
        searchById(this.queryParams.peopleId).then(res=>{
          this.infectTable=[]
          if(res.data.ancestors==this.param.ancestors){
            if(res.data.status!='0'){
              this.infectTable.push(res.data)
            }
          }
        })
      }else if(this.queryParams.type!=''){
        var temp = []
        searchByArea(this.param.ancestors).then(res=>{
          res.rows.forEach(item=>{
            if(this.queryParams.type=='次密接'){
              if(item.status=='1'){
                temp.push(item)
              }
            }else if(this.queryParams.type=='密接'){
              if(item.status=='2'){
                temp.push(item)
              }
            }else{
              if(item.status=='3'){
                temp.push(item)
              }
            }
          })
          this.infectTable=temp
        })
        console.log('type不为空')
      }else{
        console.log('都为空')
        this.getInfectList()
      }
      this.loading =false
    },
    resetQuery(){
      this.queryParams={}
    },
    handleAdd(){
      this.dialogVisible=true
    },
    submitForm(){

    },
    resetForm(){

    },
    handleExport(){
      var wb = XLSX.utils.table_to_book(document.querySelector('#statisTable'))
      var wbout = XLSX.write(wb, {
        bookType: 'xlsx',
        bookSST: true,
        type: 'array'
      })
      try {
        FileSaver.saveAs(
          new Blob([wbout], { type: 'application/octet-stream' }),
          "社区重点人员列表" + '.xlsx'
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
  height: 100%;
}
.center-content {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
}



</style>