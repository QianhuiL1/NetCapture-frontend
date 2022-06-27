<template>
<div class="home_container">
  <div class="center-content">
    <el-row>
      <el-button
        icon="el-icon-plus"
        type="primary"
        size="small"
        @click="handleAdd"
        >上报旅居人员</el-button>
    </el-row>
    <el-card class="table_content">
      <el-form ref="queryForm" :model="queryParams"
      :inline="true" size="medium">
      <el-form-item label="身份证号" prop="id">
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
          >
        </el-form-item>
      </el-form>
    </el-card>
  </div>
  <el-dialog title="旅居人员上报" :visible.sync="dialogVisible" width="40%">
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
    <el-form-item label="性别" prop="sex">
      <el-input
        v-model="formData.sex"
        placeholder="请输入重点人员性别"
        clearable
        prefix-icon="el-icon-mobile"
        :style="{width:'100%'}"
        />
    </el-form-item>
    <el-form-item label="身份证号" prop="id">
      <el-input
        v-model="formData.id"
        placeholder="请输入身份证号"
        clearable
        prefix-icon="el-icon-mobile"
        :style="{width:'100%'}"
        />
    </el-form-item>
    <el-form-item label="现居详细地址" prop="nowAddress">
      <el-input
        v-model="formData.nowAddress"
        placeholder="请输入现居地址"
        clearable
        prefix-icon="el-icon-mobile"
        :style="{width:'100%'}"
        />
    </el-form-item>
    <el-form-item label="来源地" prop="pastAddress">
      <el-input
        v-model="formData.pastAddress"
        placeholder="请输入重点人员姓名"
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


export default {
  name:'importNew',
  components:{
    Pagination,
  },
  created() {
  },
  data() {
    return {
      dialogVisible: false
    }
  },
  methods:{
    handleAdd(){
      this.dialogVisible=true
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
