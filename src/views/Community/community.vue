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
      <el-form-item label="身份证号：" prop="id">
        <el-input
          v-model="queryParams.id"
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
      <el-table v-loading="loading"
       :data="residentTable"
       :cell-style="cellStyle"
       border
       highlight-current-row
       ref="residentTable">
       <el-table-column
          label="姓名"
          prop="name"
          :show-overflow-tooltip="true"
          min-width="20%"
        />
        <el-table-column label="性别" prop="sex" min-width="10%" />
        <el-table-column label="身份证号" prop="peopleId" min-width="10%" />
        <el-table-column label="联系电话" prop="phonenumber" min-width="10%" />
        <el-table-column label="健康状态" prop="type" min-width="10%"></el-table-column>
        <el-table-column label="居住地址" prop="address" min-width="30%"></el-table-column>
        <el-table-column label="操作" min-width="15%">
          <template slot-scope="scope">
            <el-button
              size="medium"
              type="text"
              @click="handleClick(scope.row, 'line')"
            >
              <i class="el-icon-edit" style="color: #3388ff" />
              <span style="color: #223355"> 修改信息</span>
            </el-button>
        </template>
      </el-table-column>
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
  <el-dialog title="个人信息" :visible.sync="dialogVisible" width="30%">
  <div class="info"><span></span></div>
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
      <el-form-item label="身份证号：" prop="id">
        <el-input
          v-model="editFormData.id"
          placeholder="请输入身份证号"
          clearable
          @keyup.enter.native="handleEdit"
          />
      </el-form-item>
      <el-form-item label="联系方式：" prop="phone">
        <el-input
          v-model="editFormData.phone"
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
      </el-form>
  </el-dialog>
</div>
</template>

<script>
import Pagination from "@/components/Pagination";

export default{
  name:'residentList',
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
    handleClick(row){
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