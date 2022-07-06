<template>
  <div class="home_container">
    <div class="center-content">
      <el-card class="table_content">
        <el-form
          :model="queryParams"
          ref="queryForm"
          size="small"
          :inline="true"
          v-show="showSearch"
          label-width="68px"
        >
          <el-form-item label="用户名" prop="dictName">
            <el-input
              v-model="queryParams.userName"
              placeholder="请输入用户名"
              clearable
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <!-- <el-form-item label="注册角色" prop="type">
            <el-select
              v-model="queryParams.type"
              placeholder="请选择角色"
              clearable
              style="width: 240px"
            >
              <el-option
                v-for="(item, $index) in characterList"
                :key="$index"
                :label="item.name"
                :value="item.value"
              />
            </el-select> 
          </el-form-item>-->
          <el-form-item label="审核状态" prop="status">
            <el-select
              v-model="queryParams.examine"
              placeholder="审核状态"
              clearable
              style="width: 240px"
            >
              <el-option
                v-for="(item, $index) in statusList"
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
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="handleQuery"
              >搜索</el-button
            >
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
              >重置</el-button
            >
          </el-form-item>
        </el-form>
      </el-card>
    </div>

    <div class="center-content">
      <el-card class="table_content">
        <el-table v-loading="loading" :data="tableDataEnd" border :default-sort = "{prop: 'createTime', order: 'descending'}">
          <el-table-column
            label="用户名"
            align="center"
            prop="userName"
            min-width="15%"
          />
          <el-table-column
            label="注册社区"
            align="center"
            prop="community"
            :show-overflow-tooltip="true"
            min-width="15%"
          />
          <el-table-column
            label="注册角色"
            align="center"
            prop="type"
            :show-overflow-tooltip="true"
            min-width="15%"
          />
          <el-table-column
            label="审核状态"
            align="center"
            prop="examine"
            min-width="15%"
          >
            <template slot-scope="scope">
              <!-- <el-popover placement="right" trigger="hover" width="">
                <el-button
                  v-for="(item, index) in statusList"
                  :key="index"
                  size="mini"
                  :type="convertStatusToTag(item.name)"
                  @click="setStatus($event, scope.row, item.key)"
                >
                  {{ item.name }}
                </el-button>-->
                <el-tag
                  slot="reference"
                  :type="convertStatusToTag(scope.row.examine)"
                  effect="dark"
                > 
                  {{ scope.row.examine }}
               </el-tag>
              <!--  </el-popover> -->
            </template>
          </el-table-column>
          <el-table-column
            label="申请时间"
            align="center"
            prop="createTime"
            min-width="20%"
            sortable
          >
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            class-name="small-padding fixed-width"
            min-width="15%"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                size="medium"
                @click="handleClick(scope.row)"
              >
                <i class="icon-view iconfont" style="color: #3388ff" />
                <span style="color: #223355"> 查看详情</span>
              </el-button>
              <el-button
                type="text"
                size="medium"
                @click="handleDelete(scope.row)"
              >
                <i class="el-icon-delete" style="color: #d81e06" />
                <span style="color: #223355"> 删除</span>
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          v-show="total > 0"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 15, 30, 50]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </el-card>
    </div>
    <el-dialog title="注册信息" :visible.sync="dialogVisible" width="30%">
      <span class="noun">姓名： </span>
      <span
        style="float: right; color: #2e2d2d; font-size: 20px; font-weight: 200"
        >{{ user.name }}</span
      >
      <br /><br />
      <span class="noun">身份证号： </span>
      <span
        style="color: #2e2d2d; float: right; font-size: 20px; font-weight: 200"
        >{{ user.id }}</span
      >
      <br /><br />
      <span class="noun">性别： </span>
      <span
        style="float: right; color: #2e2d2d; font-size: 20px; font-weight: 200"
        >{{ user.sex }}</span
      >
      <br /><br />
      <span class="noun">注册角色： </span>
      <span
        style="float: right; color: #2e2d2d; font-size: 20px; font-weight: 200"
        >{{ user.role }}</span
      >
      <br /><br />
      <span class="noun">注册地区： </span>
      <span
        style="color: #2e2d2d; float: right; font-size: 20px; font-weight: 200"
        >{{ user.region }}</span
      >
      <br /><br />
      <span class="noun">电话号码： </span>
      <span
        style="color: #2e2d2d; float: right; font-size: 20px; font-weight: 200"
        >{{ user.phone }}</span
      >
      <br /><br />
      <span class="noun">电子邮箱： </span>
      <span
        style="color: #2e2d2d; float: right; font-size: 20px; font-weight: 200"
        >{{ user.email }}</span
      >
      <br /><br />
      <span class="noun">注册时间： </span>
      <span
        style="color: #2e2d2d; float: right; font-size: 20px; font-weight: 200"
        >{{ user.createTime }}</span
      >
      <span slot="footer" class="dialog-footer">
        <el-button
        type="primary"
          @click="
            dialogVisible = false;
            getAccess();
          "
          >通 过</el-button
        >
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { changeUserStatus, listUser,delUser } from "../../api/system/user";
import { CodeToText } from "element-china-area-data";
export default {
  name: "Dict",
  data() {
    return {
      dialogVisible: false,
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
      total: 0,
      tableDataEnd: [],
      pageSize: 10,
      currentPage: 1,
      // 查询参数
      queryParams: {
        userName: "",
        type: "",
        examine: "",
      },
      characterList: [
        { name: "社区工作人员", value: "4" },
        { name: "疾控工作人员", value: "3" },
      ],
      statusList: [
        { name: "已通过", value: "1" },
        { name: "未通过", value: "0" },
      ],
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        dictName: [
          { required: true, message: "字典名称不能为空", trigger: "blur" },
        ],
        dictType: [
          { required: true, message: "字典类型不能为空", trigger: "blur" },
        ],
      },
      checkList: [],
      user: {},
    };
  },
  created() {
    this.getList();
  },
  methods: {
    handleSizeChange: function (pageSize) {
      // 每页条数切换
      this.pageSize = pageSize;
      this.handleCurrentChange(this.currentPage);
    },
    handleCurrentChange: function (currentPage) {
      //页码切换
      this.currentPage = currentPage;
      this.currentChangePage(this.checkList, currentPage);
    },
    //分页方法
    currentChangePage(list, currentPage) {
      let from = (currentPage - 1) * this.pageSize;
      let to = currentPage * this.pageSize;
      this.tableDataEnd = [];
      for (; from < to; from++) {
        if (list[from]) {
          this.tableDataEnd.push(list[from]);
        }
      }
    },
    // 查询审核注册列表
    getList() {
      this.tableDataEnd = []
      listUser(this.queryParams).then((res) => {
        this.checkList = res.rows;
        this.total = res.rows.length;
        var list = [];
        for (var index in res.rows) {
          this.checkList[index].userName = res.rows[index].userName;
          this.checkList[index].community = CodeToText[res.rows[index].deptId];
          this.checkList[index].examine =
            res.rows[index].examine == 1 ? "已审核" : "未审核";
          if (res.rows[index].roles[0].roleId == 4)
            this.checkList[index].type = "社区工作人员";
          else if (res.rows[index].roles[0].roleId == 3)
            this.checkList[index].type = "疾控工作人员";
          else if (res.rows[index].roles[0].roleId == 1)
            this.checkList[index].type = "管理员";
          else this.checkList[index].type = "普通用户";
          if (index == res.rows.length - 1) {
            if (this.total > this.pageSize) {
              for (let index = 0; index < this.pageSize; index++) {
                this.tableDataEnd.push(this.checkList[index]);
              }
            } else {
              this.tableDataEnd = this.checkList;
            }
            this.loading = false;
          }
        }
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    /** 搜索按钮操作 */
    handleQuery() {
      if (this.queryParams.type != "") {
      }
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams = "";
      this.getList();
    },
    convertStatusToTag(status) {
      if (status === "未审核") {
        return "info";
      } else if (status == "已审核") {
        return "success";
      } else {
        return "primary";
      }
    },
    setStatus(event, row, value) {},
    /** 新增按钮操作 */
    handleAdd() {},

    /** 修改按钮操作 */
    handleUpdate(row) {},

    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm('是否确认删除用户?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function() {
          return delUser(row.userId)
        })
        .then(() => {
          this.getList()
          this.$message.success('删除成功')
        })
        .catch(() => {})
    },
    handleClick(row) {
      listUser({ userId: row.userId }).then((res) => {
        this.user.userId=res.rows[0].userId
        this.user.id = res.rows[0].userName;
        this.user.name = res.rows[0].nickName;
        this.user.email = res.rows[0].email;
        this.user.phone = res.rows[0].phonenumber;
        this.user.sex = res.rows[0].sex == 1 ? "男" : "女";
        this.user.createTime = res.rows[0].createTime;
        this.user.type = res.rows[0].examine == 1 ? "已通过" : "未通过";
        this.user.region = CodeToText[res.rows[0].deptId];
        if (res.rows[0].roles[0].roleId == 4) this.user.role = "社区工作人员";
        else if (res.rows[0].roles[0].roleId == 3) this.user.role = "疾控工作人员";
        else if (res.rows[0].roles[0].roleId == 1) this.user.role = "管理员";
        else user.role = "普通用户";
        this.dialogVisible = true;
      });
    },
    getAccess() {
changeUserStatus({userId:this.user.userId,examine:1}).then(()=>{
  this.$message.success("操作成功")
  this.getList()
})
    },
  },
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
.table_content {
  padding: 10px 5px 0px 0px;
}
.noun{
  float: left;
color:#1E1E1E;
      font-size: 20px;
      font-weight: 600;
}
</style>