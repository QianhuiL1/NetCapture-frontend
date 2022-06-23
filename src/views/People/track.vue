
<template>
  <div>
      <el-card>重点人员轨迹</el-card>
    <el-card>
      <div>
        姓名：
        <el-input
          v-model="formQuery.name"
          style="width: 200px; margin: 10px"
        />身份证号：
        <el-input
          v-model="formQuery.address"
          style="width: 200px; margin: 10px"
        />电话号码：
        <el-input
          v-model="formQuery.phone"
          style="width: 200px; margin: 10px"
        />
        <div class="con-list">         
      <el-table
    :data="tableData"
    style="width: 100%">
    <el-table-column
      label="时间"
      style="width: 30%">
      <template slot-scope="scope">
        <i class="el-icon-time"></i>
        <span style="margin-left: 10px">{{ scope.row.date }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="地点"
      style="width: 40%">
     <template slot-scope="scope">
        <i class="el-icon-time"></i>
        <span style="margin-left: 10px">{{ scope.row.spot }}</span>
      </template>
    </el-table-column>
    <el-table-column label="操作" style="width: 10%">
      <template slot-scope="scope">
        <el-button
          size="mini"
          @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        <el-button
          size="mini"
          type="danger"
          @click="handleDelete(scope.$index, tableData)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>        
</div>
      </div>
      <el-button type="primary" icon="el-icon-plus" @click="handleAdd"
        >新增轨迹点</el-button
      >
    </el-card>
    <el-dialog title="编辑" :visible.sync="centerDialogEdit" width="30%">    
      时间：<el-input v-model="new_time" placeholder="请输入具体时间" width="10px"></el-input>      
    地点：<el-input v-model="new_address" placeholder="请输入具体地点"></el-input>  
        <span slot="footer" class="dialog-footer">        
        <el-button @click="centerDialogEdit = false; listID=''">取 消</el-button>        
        <el-button type="primary" @click="edit">确 定</el-button>      
    </span>    
</el-dialog>
<el-dialog title="新增" :visible.sync="centerDialogAdd" width="30%">      
    时间：<el-input v-model="new_time" placeholder="请输入具体时间" width="10px"></el-input>      
    地点：<el-input v-model="new_address" placeholder="请输入具体地点"></el-input>  
        <span slot="footer" class="dialog-footer">        
        <el-button @click="centerDialogAdd = false; listID=''">取 消</el-button>        
        <el-button type="primary" @click="add">确 定</el-button>      
    </span>    
</el-dialog>
<el-dialog title="删除" :visible.sync="centerDialogDel" width="30%">      
    <span>确认删除该轨迹信息吗？</span>      
        <span slot="footer" class="dialog-footer">        
        <el-button @click="centerDialogDel = false; listID=''">取 消</el-button>        
        <el-button type="primary" @click="del">确 定</el-button>      
    </span>    
</el-dialog>
  </div>
  
</template>
 
<script>
const AMap = window.AMap;
export default {
 mounted(){
   this.initMap();
 },
  data() {
    return {
      new_time:'',
      new_address:'',
        listID: '',      
centerDialogAdd: false,      
centerDialogEdit: false,      
centerDialogDel: false, 
      formQuery: {
        name: "",
        address: "",
        phone: "",
        email: "",
        contactPersonName: "",
        contactPhone: "",
        note: "",
      },
 
      tableData: [{
          date: '2016-05-02',
          spot: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          spot: '上海市普陀区金沙江路 1517 弄'
        }, {
          date: '2016-05-01',
          spot: '上海市普陀区金沙江路 1519 弄'
        }, {
          date: '2016-05-03',
          spot: '上海市普陀区金沙江路 1516 弄'
        }]
    };
  },
 
  mounted() {

  },
  methods: {
    initMap() {
      this.map = new AMap.Map("amap", {
        resizeEnable: true,
        zoom: 12,
        mapStyle: "amap://styles/blue",
        center: [114.306434, 30.5988]
      })},
    handleEdit (index, row) {   
    this.centerDialogEdit = true   
    this.new_time=row.date
    this.new_address=row.spot
    this.listID=index;   
}, 
edit () {      
    const i = this.listID      
    this.tableData[parseInt(i)].date = this.new_time    
    this.tableData[parseInt(i)].spot=this.new_address 
    this.new_time = ''   
    this.new_address = ''   
    this.centerDialogEdit = false 
    this.$message("修改成功！")
},
handleAdd () {      
    this.centerDialogAdd = true    
    },    
add () {      
  const new_time=this.new_time
  const new_address=this.new_address
    this.tableData.push({new_time,new_address})      
    this.new_time = ''   
    this.new_address = ''      
    this.centerDialogAdd = false    
    this.$message("添加成功！")
},
handleDelete (index, rows) {      
    this.centerDialogDel = true    
    this.listID=index
},    
del () {      
    const i = this.listID      
    this.tableData.splice(i,1)     
    this.centerDialogDel = false    
    this.$message("删除成功！")
},
  },
};
</script>
 
 
<style lang="scss" scoped>

</style>