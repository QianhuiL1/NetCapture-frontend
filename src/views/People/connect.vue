<template>
<div class="app-container">
    <el-card>  <el-button type="primary" icon="el-icon-plus" @click="handleAdd"
        >新增人员信息</el-button
      >
    </el-card>
    <el-card>密接人员列表
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
            v-model="queryParams.id"
            placeholder="请输入身份证号"
            clearable
            @keyup.enter.native="getList1"
          />
        </el-form-item>
        <el-form-item label="健康状态:">
          <el-select
            v-model="queryParams.type"
            placeholder="请选择健康状态"
            clearable
            @change="handleStatusSelect"
          >
            <el-option
              v-for="(item, $index) in  TypeOptions"
              :key="$index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
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
          min-width="5%"
        />
        <el-table-column label="身份证号" prop="id" min-width="30%" />
        <el-table-column label="联系电话" prop="phone" min-width="10%" />
          <el-table-column label="状态" prop="status" min-width="5%">
        </el-table-column>    
       <el-table-column label="操作">
      <template slot-scope="scope">
             <el-button
    size="medium"
    type="text"
    @click="handleEdit(scope.$index, scope.row,1)"
  >
    <i class="el-icon-edit" style="color: #3388ff" />
    <span style="color: #223355"> 编辑</span>
  </el-button>
     <el-button
    size="medium"
    type="text"
    @click="handleDelete(scope.$index, tableData)"
  >
    <i class="el-icon-edit" style="color: #d81e06" />
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
<el-card>次密接人员列表

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
            v-model="queryParams.id"
            placeholder="请输入身份证号"
            clearable
            @keyup.enter.native="getList1"
          />
        </el-form-item>
        <el-form-item label="健康状态:">
          <el-select
            v-model="queryParams.type"
            placeholder="请选择健康状态"
            clearable
            @change="handleStatusSelect"
          >
            <el-option
              v-for="(item, $index) in  TypeOptions"
              :key="$index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
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
        :data="connectList1"
        :cell-style="cellStyle"
        border
        highlight-current-row >
      <el-table-column
          label="姓名"
          prop="name"
          :show-overflow-tooltip="true"
          min-width="5%"
        />
        <el-table-column label="身份证号" prop="id" min-width="30%" />
        <el-table-column label="联系电话" prop="phone" min-width="10%" />
          <el-table-column label="状态" prop="status" min-width="5%">
        </el-table-column>    
       <el-table-column label="操作">
      <template slot-scope="scope">
          <el-button
    size="medium"
    type="text"
    @click="handleEdit(scope.$index, scope.row,2)"
  >
    <i class="el-icon-edit" style="color: #3388ff" />
    <span style="color: #223355"> 编辑</span>
  </el-button>
     <el-button
    size="medium"
    type="text"
    @click="handleDelete(scope.$index, tableData)"
  >
    <i class="el-icon-edit" style="color: #d81e06" />
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
        @pagination="getList2"
      />
</el-card>
 <el-dialog title="编辑" :visible.sync="centerDialogEdit" width="30%">    
      <div class="radio">
    <el-radio-group v-model="type">
      <el-radio :label="true">密接人员</el-radio>
      <el-radio :label="false">次密接人员</el-radio>
    </el-radio-group>
  </div> 
      姓名：<el-input v-model="info.name" placeholder="请输入人员姓名" @input="change($event)"></el-input>      
    身份证号：<el-input v-model="info.id" placeholder="请输入身份证号" @input="change($event)"></el-input>  
    联系电话：<el-input v-model="info.phone" placeholder="请输入联系电话" @input="change($event)"></el-input>  
    健康状况：<el-input v-model="info.status" placeholder="请输入健康状况" @input="change($event)"></el-input>  
        <span slot="footer" class="dialog-footer">        
        <el-button @click="centerDialogEdit = false; listID=''">取 消</el-button>        
        <el-button type="primary" @click="edit">确 定</el-button>      
    </span>    
</el-dialog>
<el-dialog title="新增" :visible.sync="centerDialogAdd" width="30%">     
     <div class="radio">
    <el-radio-group v-model="type">
      <el-radio :label="true">密接人员</el-radio>
      <el-radio :label="false">次密接人员</el-radio>
    </el-radio-group>
  </div> 
          姓名：<el-input v-model="new_name" placeholder="请输入人员姓名" @input="change($event)"></el-input>      
    身份证号：<el-input v-model="new_id" placeholder="请输入身份证号" @input="change($event)"></el-input>  
    联系电话：<el-input v-model="new_phone" placeholder="请输入联系电话" @input="change($event)"></el-input>  
    健康状况：<el-input v-model="new_status" placeholder="请输入健康状况" @input="change($event)"></el-input>  
        <span slot="footer" class="dialog-footer">        
        <el-button @click="centerDialogAdd = false; listID=''">取 消</el-button>        
        <el-button type="primary" @click="add">确 定</el-button>      
    </span>    
</el-dialog>
<el-dialog title="删除" :visible.sync="centerDialogDel" width="30%">      
    <span>确认删除该密接者信息吗？</span>      
        <span slot="footer" class="dialog-footer">        
        <el-button @click="centerDialogDel = false; listID=''">取 消</el-button>        
        <el-button type="primary" @click="del">确 定</el-button>      
    </span>    
</el-dialog>
    </div>
</template>


<script>
import Pagination from "@/components/Pagination";
export default {
  name: "connectList",
  components: {
    Pagination,
  },
  data() {
    return {
        centerDialogAdd: false,      
centerDialogEdit: false,      
centerDialogDel: false, 
        info:{
            name:'',
            id:'',
            phone:'',
            status:'',
        },
        type:'',
        id:'',
      queryParams: {
        _page: 1,
        _limit: 10,
        name: undefined,
        id:'',
        type: "",
      },
      queryDateRange: [],
      TypeOptions: [
        {
          value: "1",
          label: "健康",
        },
        {
          value: "2",
          label: "发热",
        },
        {
          value: "3",
          label: "发热",
        },
      ],
      connectList: [{
          name: '张三',
          id:'430220235522222222',
          phone:'13962462222',
          status:"健康",
        }, {
           name: '李四',
          id:'430228355522222222',
          phone:'13962462222',
          status:"健康",
        }, {
           name: '王五',
          id:'430221636522222222',
          phone:'13962462222',
          status:"发热",
        }],

        connectList1: [{
          name: '张三',
          id:'430220235522222222',
          phone:'13962462222',
          status:"健康",
        }, {
           name: '李四',
          id:'430228355522222222',
          phone:'13962462222',
          status:"健康",
        }, {
           name: '王五',
          id:'430221636522222222',
          phone:'13962462222',
          status:"发热",
        }],
      value: "",
    };
  },
  methods: {
      change (e) {
    this.$forceUpdate()
},
       handleEdit (index, row,type) {   
    this.centerDialogEdit = true   
    if(type === 1){
        this.type=true
    }
    else{
        this.type=false
    }
    this.info.name=row.name
    this.info.id=row.id
    this.info.phone=row.phone
    this.info.status=row.status
    this.listID=index;   
}, 
edit () {      
    const i = this.listID      
    if(this.type ===true){
    this.connectList[parseInt(i)].status=this.info.status
    this.connectList[parseInt(i)].name=this.info.name
    this.connectList[parseInt(i)].phone=this.info.phone
    this.connectList[parseInt(i)].id=this.info.id
    }else{
        this.connectList1[parseInt(i)].status=this.info.status
    this.connectList1[parseInt(i)].name=this.info.name
    this.connectList1[parseInt(i)].phone=this.info.phone
    this.connectList1[parseInt(i)].id=this.info.id
    }
    this.info.name=''
    this.info.id=''
    this.info.phone=''
    this.info.status=''
    this.centerDialogEdit = false 
    this.$message("修改成功！")
},
handleAdd () {      
    this.centerDialogAdd = true    
    },    
add () {     
    if(this.type ===true){ 
    this.connectList.push(this.info)      
    }
    else{
    this.connectList1.push(this.info)     
    }
    this.info.name=''
    this.info.id=''
    this.info.phone=''
    this.info.status=''  
    this.centerDialogAdd = false    
    this.$message("添加成功！")
},
handleDelete (index, rows) {      
    this.centerDialogDel = true    
    this.listID=index
},    
del () {      
    const i = this.listID      
    this.connectList.splice(i,1)     
    this.centerDialogDel = false    
    this.$message("删除成功！")
},
    getList1() {
      this.loading = true;
      listNoticeUser(this.queryParams).then((response) => {
        this.loading = false;
        this.connectList = response.records;
      });
    },
    resetQuery1() {
      this.queryParams.name = "";
      this.queryParams.id = "";
      this.queryParams.type = "";
      this.getList1();
    },
  },
};
</script>

<style lang="scss" scoped>
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