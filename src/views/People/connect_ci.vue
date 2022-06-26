<template>
<div class="home_container">
    <el-card class="table_content">  
      <div class="center_content">
      <div class="theme">
        <span>
      次密接人员列表
      </span>
      </div>
      <div>
      <el-button type="primary" icon="el-icon-plus" size="medium" @click="handleAdd"
        >新增人员信息</el-button
      >
      </div>
      </div>
    </el-card>
    <el-card class="table_content">
        <el-form ref="queryForm" :model="queryParams" :inline="true" size="small">
        <el-form-item label="姓名:" prop="name">
          <el-input
            v-model="queryParams.name"
            placeholder="请输入人员姓名"
            clearable
            @keyup.enter.native="getList1"
          />
        </el-form-item>
        <el-form-item label="身份证号:" prop="id">
          <el-input
            v-model="queryParams.peopleId"
            placeholder="请输入身份证号"
            clearable
            @keyup.enter.native="getList1"
          />
        </el-form-item>
        <el-form-item label="家庭住址:">
          <el-input
            v-model="queryParams.address"
            placeholder="请输入家庭住址"
            clearable
            @keyup.enter.native="getList1"
          />
        </el-form-item>
        <el-form-item style="float: right">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-search"
            @click="getList1"
            >搜索</el-button
          >
          <el-button size="mini" icon="el-icon-refresh" @click="resetQuery1"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
<p></p>
    <el-table  v-loading="loading"
        :data="connectList"
        :cell-style="cellStyle"
        border
        highlight-current-row >
      <el-table-column
          label="姓名"
          prop="name"
          :show-overflow-tooltip="true"
          min-width="20%"
        />
        <el-table-column label="身份证号" prop="peopleId" min-width="25%" />
        <el-table-column label="联系电话" prop="phonenumber" min-width="20%" />
          <el-table-column label="家庭住址" prop="address" min-width="30%">
        </el-table-column>    
       <el-table-column label="操作" min-width="20%">
      <template slot-scope="scope">
             <el-button
    size="medium"
    type="text"
    @click="handleEdit(scope.row,1)"
  >
    <i class="el-icon-edit" style="color: #3388ff" />
    <span style="color: #223355"> 编辑</span>
  </el-button>
     <el-button
    size="medium"
    type="text"
    @click="handleDelete(scope.row.peopleId, 1)"
  >
    <i class="el-icon-delete" style="color: #d81e06" />
    <span style="color: #223355"> 删除</span></el-button>
      </template>
    </el-table-column>
    </el-table>
    <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams._page"
        :limit.sync="queryParams._limit"
        style="float: right; margin: 20px"
        @pagination="getList1"
      />
</el-card>
 <el-dialog title="编辑" :visible.sync="centerDialogEdit" width="30%">    
  <div class="inputTitle"><span>
      姓名：
      </span>
      </div>
      <el-input v-model="info.name" placeholder="请输入人员姓名" @input="change($event)"></el-input>      
      <div class="inputTitle"><span>
      身份证号：
      </span>
      </div><el-input v-model="info.id" placeholder="请输入身份证号" @input="change($event)"></el-input>  
      <div class="inputTitle"><span>
      联系电话：
      </span>
      </div><el-input v-model="info.phone" placeholder="请输入联系电话" @input="change($event)"></el-input>  
      <div class="inputTitle"><span>
      家庭住址：
      </span>
      </div><el-input v-model="info.address" placeholder="请输入家庭住址" @input="change($event)"></el-input>  
        <span slot="footer" class="dialog-footer">        
        <el-button @click="centerDialogEdit = false; listID=''">取 消</el-button>        
        <el-button type="primary" @click="edit">确 定</el-button>      
    </span>    
</el-dialog>
<el-dialog title="新增" :visible.sync="centerDialogAdd" width="30%">     
  <div class="inputTitle"><span>
      姓名：
      </span>
      </div><el-input v-model="new_name" placeholder="请输入人员姓名" @input="change($event)"></el-input>      
      <div class="inputTitle"><span>
      身份证号：
      </span>
      </div><el-input v-model="new_id" placeholder="请输入身份证号" @input="change($event)"></el-input>  
     <div class="inputTitle"><span>
      联系电话：
      </span>
      </div><el-input v-model="new_phone" placeholder="请输入联系电话" @input="change($event)"></el-input>  
    <div class="inputTitle"><span>
      家庭住址：
      </span>
      </div><el-input v-model="new_status" placeholder="请输入家庭住址" @input="change($event)"></el-input>  
        <span slot="footer" class="dialog-footer">        
        <el-button @click="centerDialogAdd = false; listID=''">取 消</el-button>        
        <el-button type="primary" @click="add">确 定</el-button>      
    </span>    
</el-dialog>
    </div>
</template>


<script>
import {List1,connectUpdate1,connectDelete1,connectAdd1} from '../../api/People/connect/base';
import {List2,connectUpdate2,connectDelete2,connectAdd2} from '../../api/People/connect/basic';
import {infectList,infectInfo,infectUpdate,infectDelete,infectAdd} from '../../api/People/infect/basic';
const ids = new Set()
export default {
  name: "connectList",
  created(){
    this.getList1()
  },
  data() {
    return {
      ids1:ids,
      ids2:ids,
        centerDialogAdd: false,      
centerDialogEdit: false,      
centerDialogDel: false, 
        info:{
            name:'',
            id:'',
            phone:'',
            address:'',
        },
        type:'',
        id:'',
      queryParams: {
        _page: 1,
        _limit: 10,
        name: "",
        peopleId:'',
        address:'',
        status: 1,
      },
      queryDateRange: [],
      connectList: [],

        connectList1: [],
      value: "",
    };
  },
  methods: {
      change (e) {
    this.$forceUpdate()
},
handleEdit (row,type) {   
    this.centerDialogEdit = true   
    if(type === 1){
        this.type=true
    }
    else{
        this.type=false
    }
    this.info.name=row.name
    this.info.id=row.peopleId
    this.info.phone=row.phonenumber
    this.info.address=row.address
    this.listID=row.peopleId;   
}, 
edit () {      
    const i = this.listID      
    if(this.type ===true){
      connectUpdate1(i).then(response => {
          this.connectList1();
          this.$message("修改成功！")
        });
    // this.connectList[parseInt(i)].status=this.info.status
    // this.connectList[parseInt(i)].name=this.info.name
    // this.connectList[parseInt(i)].phone=this.info.phone
    // this.connectList[parseInt(i)].id=this.info.id
    }else{
       connectUpdate2(i).then(response => {
          this.connectList2();
          this.$message("修改成功！")
        });
    //     this.connectList1[parseInt(i)].status=this.info.status
    // this.connectList1[parseInt(i)].name=this.info.name
    // this.connectList1[parseInt(i)].phone=this.info.phone
    // this.connectList1[parseInt(i)].id=this.info.id
    }
    this.info.name=''
    this.info.id=''
    this.info.phone=''
    this.info.status=''
    this.centerDialogEdit = false 
    
},
handleAdd () {      
    this.centerDialogAdd = true    
    },    
add () {     
    if(this.type ===true){ 
      if (this.ids1.has(this.info.id)) {
        this.$message.warning('该密接人员已经添加！')
        this.info={
            name:'',
            id:'',
            phone:'',
            status:'',
        }
        return
      } else {
      connectAdd1(this.info)
      this.$message.success('添加成功')
      this.centerDialogAdd = false   
    this.getList1()  
      } 
    }
    else{
    if (this.ids2.has(this.info.id)) {
        this.$message.warning('该次密接人员已经添加！')
        this.info={
            name:'',
            id:'',
            phone:'',
            status:'',
        }
        return
      } else {
      connectAdd2(this.info)
      this.$message.success('添加成功')
      this.centerDialogAdd = false   
    this.getList2()  
      }    
    }
    this.info.name=''
    this.info.id=''
    this.info.phone=''
    this.info.status=''  
},
handleDelete (index, type) {          
  if (index.length === 0) return
  if(type === 1){
   this.$confirm('是否确认删除该密接人员记录?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function() {
          return connectDelete1({ id: index })
        })
        .then(() => {
          this.getList1()
          this.msgSuccess('删除成功')
        })
        .catch(() => {})
  }else{
    this.$confirm('是否确认删除该密接人员记录?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function() {
          return connectDelete2({ id: index })
        })
        .then(() => {
          this.getList2()
          this.msgSuccess('删除成功')
        })
        .catch(() => {})
  }
},
    getList1() {
      this.loading = true;
      infectList(this.queryParams).then((response) => {
        this.loading = false;
        this.connectList = response.rows;
        this.ids1=response.records.id;
      });
    },
    getList2() {
      this.loading = true;
      List2(this.queryParams).then((response) => {
        this.loading = false;
        this.connectList = response.records;
        this.ids2=response.records.id;
      });
    },
    resetQuery1() {
      this.queryParams.name = "";
      this.queryParams.id = "";
      this.queryParams.type = "";
      this.getList1();
    },
    resetQuery2() {
      this.queryParams.name = "";
      this.queryParams.id = "";
      this.queryParams.type = "";
      this.getList2();
    },
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