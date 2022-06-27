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
      <el-form-item label="身份证号：" prop="id">
        <el-input
          v-model="queryParams.id"
          placeholder="请输入身份证号"
          clearable
          @keyup.enter.native="handleQuery"
          />
      </el-form-item>
      <el-form-item lable="状态：">
        <el-select 
          v-model="queryParams.type"
          placeholder="请选择人员状态"
          @change="getInfectList"
          >
          <el-option
            v-for="(item,$index) in typeArr"
            :key="$index"
            :label="item.name"
            :value="item.key"
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
      <el-table v-loading="loading"
        :data="infectTable"
        :cell-style="cellStyle"
        border
        hightlight-current-row
        ref="infectTable">
        <el-table-column
          label="姓名"
          prop="name"
          :show-overflow-tooltip="true"
          min-width="20%"
          />
          <el-table-column label="性别" prop="sex" min-width="10%"/>
          <el-table-column label="身份证号" prop="peopleId" min-width="10%"/>
          <el-table-column label="状态" prop="type"
          min-widht="10%"/>
          <el-table-column label="联系电话" prop="phone"
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

export default{
  name: 'infectTable',
  created(){
  },
  data() {
    return {
      dialogVisible: false,
      typeArr:[
        {name:'阳性',value:'阳性'},
        {name:'密接',value:'密接'},
        {name:'次密接',value:'次密接'}
      ]
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