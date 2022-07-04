<template>
  <div class="home_container">
    <div class="center-content">
      <el-card class="table_content">
    
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="用户名" prop="dictName">
        <el-input
          v-model="queryParams.userName"
          placeholder="请输入用户名"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="注册角色" prop="type">
        <el-select
         v-model="queryParams.type"
         placeholder="请选择角色"
         clearable
         style="width: 240px"
         >
        <el-option
          v-for="(item,$index) in characterList"
          :key="$index"
          :label="item.name"
          :value="item.value"
          />
         </el-select>
      </el-form-item>
      <el-form-item label="审核状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="审核状态"
          clearable
          style="width: 240px"
        >
          <el-option
            v-for="(item,$index) in statusList"
            :key="$index"
            :label="item.name"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="申请时间">
        <el-date-picker
          v-model="dateRange"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增</el-button>
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
        >删除</el-button>
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
        >导出</el-button>
      </el-form-item>
    </el-form>
    </el-card>
</div>

<div class="center-content">
<el-card class="table_content">
    <el-table v-loading="loading" :data="checkList"
    border @selection-change="handleSelectionChange">
      <el-table-column type="selection" 
      show-overflow-tooltip="true"
      minwidth="10%" align="center" />
      <el-table-column label="用户名" align="center" prop="userName" min-width="15%"/>
      <el-table-column label="注册社区" align="center" prop="community" :show-overflow-tooltip="true" min-width="15%"/>
      <el-table-column label="注册角色" align="center" prop="type" :show-overflow-tooltip="true" min-width="15%"/>
      <el-table-column label="审核状态" align="center" prop="status" min-width="15%">
        <template slot-scope="scope">
          <el-popover placement="right" trigger="hover" width="">
            <el-button
              v-for="(item,index) in statusList"
              :key="index"
              size="mini"
              :type="convertStatusToTag(item.name)"
              @click="setStatus($event,scope.row,item.key)"
              >
              {{item.name}}
              </el-button>
          <el-tag
            slot="reference"
            :type="convertStatusToTag(scope.row.status)"
            effect="dark"
            >
            {{scope.row.status}}
            </el-tag>
            </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="申请时间" align="center" prop="createTime" min-width="20%">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width"
      min-width="15%">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
    </el-card>
    </div>
  </div>
</template>

<script>


export default {
  name: "Dict",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 字典表格数据
      typeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 日期范围
      dateRange: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userName: '',
        type: '',
        status: ''
      },
      characterList:[
        {name:"社区工作人员",value:"社区工作人员"},
        {name:"疾控工作人员",value:"疾控工作人员"}
      ],
      statusList:[
        {name: "已通过",value:"已通过"},
        {name:"未通过",value:"未通过"},
        {name:"未审核",value:"未审核"}
      ],
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        dictName: [
          { required: true, message: "字典名称不能为空", trigger: "blur" }
        ],
        dictType: [
          { required: true, message: "字典类型不能为空", trigger: "blur" }
        ]
      },
      checkList:[
        {userName:"420112199802030909",community:"北京市",type:"社区工作人员",
        status:"未审核",createTime:"2022-07-04"}
      ]
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 查询审核注册列表
    getList() {
      this.loading=false
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      
    },
    /** 搜索按钮操作 */
    handleQuery() {
      
    },
    /** 重置按钮操作 */
    resetQuery() {
      
    },
    convertStatusToTag(status){
      if(status==="未审核"){
        return "info";
      }else if(status=="已通过"){
        return "success";
      }else{
        return "primary";
      }
    },
    setStatus(event,row,value){

    },
    /** 新增按钮操作 */
    handleAdd() {
      
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      
    },
    /** 提交按钮 */
    submitForm: function() {
      
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      
    },
    /** 导出按钮操作 */
    handleExport() {
      
    },
    /** 刷新缓存按钮操作 */
    handleRefreshCache() {
      
    }
  }
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
.table_content{
  padding: 10px 5px 0px 0px;
}

</style>