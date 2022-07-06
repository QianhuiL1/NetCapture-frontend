
<template>
  <div class="home_container">
    <div class="center-content">
      <el-card class="table_content table_content_all">
        <div class="theme">
          <span> 重点人员轨迹 </span>
        </div></el-card
      >
      <div class="center-content">
        <el-card class="table_content table_content_all">
          <div class="inputItems">
            姓名：
            <el-select
              filterable
              v-model="formQuery.name"
              placeholder="请选择人员姓名"
              style="width: 300px; margin: 10px"
              @change="queryInfo"
            >
              <el-option
                v-for="item in peopleList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            身份证号：
            <el-input
              v-model="formQuery.id"
              clearable
              style="width: 300px; margin: 10px"
              placeholder="请输入身份证号"
            />电话号码：
            <el-input
            :maxlength="11"
              v-model="formQuery.phone"
              clearable
              style="width: 300px; margin: 10px"
              placeholder="请输入电话号码"
            />
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
              >新增轨迹点</el-button
            >
            <el-button
              type="success"
              icon="el-icon-check"
              size="mini"
              @click="handleCommit"
              >提交</el-button
            > <el-button
                  icon="el-icon-share"
                  type="primary"
                  size="mini"
                  @click="handleExport"
                  plain
                >导出</el-button>  
            <div class="con-list">   
              <el-table
                :row-class-name="tableRowClassName"
                :data="tableDataEnd"
                v-loading="loading"
                :default-sort="{ prop: 'date', order: 'ascending' }"
                style="width: 100%; height: 30%"
              >
                <el-table-column
                  fixed
                  prop="date"
                  label="到达时间"
                  sortable
                  style="width: 30%"
                >
                  <template slot-scope="scope">
                    <i class="el-icon-time"></i>
                    <span style="margin-left: 10px">{{
                      scope.row.arriveTime
                    }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  fixed
                  prop="date1"
                  label="离开时间"
                  style="width: 30%"
                >
                  <template slot-scope="scope">
                    <i class="el-icon-time"></i>
                    <span style="margin-left: 10px">{{
                      scope.row.leftTime
                    }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="地点" style="width: 40%">
                  <template slot-scope="scope">
                    <i class="el-icon-map-location"></i>
                    <span style="margin-left: 10px">{{
                      scope.row.address
                    }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" style="width: 10%">
                  <template slot-scope="scope">
                    <el-button
                      size="medium"
                      type="text"
                      @click="handleEdit(scope.$index, scope.row)"
                    >
                      <i class="el-icon-edit" style="color: #3388ff" />
                      <span style="color: #223355"> 编辑</span></el-button
                    >
                    <el-button
                      size="medium"
                      type="text"
                      @click="handleDelete(scope.row)"
                    >
                      <i class="el-icon-delete" style="color: #d81e06" />
                      <span style="color: #223355"> 删除</span></el-button
                    >
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
      :total="total">
    </el-pagination>
            </div>
          </div>
        </el-card>
      </div>
      <div class="center-content">
        <el-card class="table_content table_content_all">
          <div id="amap" class="amap"></div>
        </el-card>
      </div>
    </div>
    <el-dialog
      title="修改轨迹信息"
      :visible.sync="centerDialogEdit"
      width="40%"
    >
      到达时间：<el-date-picker
        id="time2"
        v-model="new_time"
        type="datetime"
        placeholder="请选择具体时间"
        default-time="12:00:00"
        style="width: 400px; margin: 10px"
      >
      </el-date-picker>
      <p></p>
      离开时间：<el-date-picker
        id="time22"
        v-model="new_time1"
        type="datetime"
        placeholder="请选择具体时间"
        default-time="12:00:00"
        style="width: 400px; margin: 10px"
      >
      </el-date-picker>
      <p></p>
      地点：<el-input
        id="complete2"
        v-model="new_address"
        placeholder="请输入具体地点"
        style="width: 400px; margin: 10px"
      />
      <span slot="footer" class="dialog-footer">
        <el-button
          @click="
            centerDialogEdit = false;
            listID = '';
          "
          >取 消</el-button
        >
        <el-button type="primary" @click="edit">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="新增轨迹信息" :visible.sync="centerDialogAdd" width="40%">
      到达时间：<el-date-picker
        id="time1"
        v-model="new_time"
        type="datetime"
        placeholder="请选择具体时间"
        default-time="12:00:00"
        style="width: 400px; margin: 10px"
      >
      </el-date-picker>
      <p></p>
      离开时间：<el-date-picker
        id="time11"
        v-model="new_time1"
        type="datetime"
        placeholder="请选择具体时间"
        default-time="12:00:00"
        style="width: 400px; margin: 10px"
      >
      </el-date-picker>
      <p></p>
      地点：<el-input
        type="text"
        id="complete1"
        v-model="new_address"
        placeholder="请输入具体地点"
        style="width: 400px; margin: 10px"
      />
      <span slot="footer" class="dialog-footer">
        <el-button
          @click="
            centerDialogAdd = false;
            listID = '';
          "
          >取 消</el-button
        >
        <el-button type="primary" @click="add">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="删除" :visible.sync="centerDialogDel" width="40%">
      <span>确认删除该轨迹信息吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button
          @click="
            centerDialogDel = false;
            listID = '';
          "
          >取 消</el-button
        >
        <el-button type="primary" @click="del">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { infectList, infectInfo } from "../../api/People/infect/basic";
import { trackList } from "../../api/People/track/basic";
import {
  travelList,
  travelAdd,
  travelUpdate,
  travelDelete,
} from "../../api/People/travel/basic";
import { connectList } from "../../api/People/connect/basic";
const AMap = window.AMap;
import Pagination from '../../components/Pagination'

export default {
  components: {
    geoCoder: "",
    Pagination
  },
  created() {
    setTimeout(() => {
    if(this.$route.params.peopleId === undefined){
      this.queryPeople();
    }},1000);
  },
  mounted() {
    this.formQuery.name = this.$route.params.peopleName;
    this.formQuery.id = this.$route.params.peopleId;
    this.formQuery.phone = this.$route.params.peoplePhone;
    this.getList()
    setTimeout(() => {
      this.initMap();
    }, 1000);
  },
  data() {
    return {
      tableDataEnd:[],
      pageSize:15,
      currentPage:1,
      total: 1,
      count: true,
      peopleList: [],
      map: null,
      lineArr: [],
      new_time: "",
      new_time1: "",
      new_address: "",
      listID: "",
      centerDialogAdd: false,
      centerDialogEdit: false,
      centerDialogDel: false,
      formQuery: {
        name: "",
        id: "",
        phone: "",
        email: "",
      },
      spot: {
        travelId: "",
        address: "",
        arriveTime: "",
        leftTime: "",
      },
      isCommit: false,
      loading: false,
      tableData: [],
    };
  },

  methods: {
    handleSizeChange: function (pageSize) { // 每页条数切换
        this.pageSize = pageSize;
        this.handleCurrentChange(this.currentPage);
      },
      handleCurrentChange: function (currentPage) {//页码切换
        this.currentPage = currentPage;
        this.currentChangePage(this.tableData, currentPage);
      },
      //分页方法
      currentChangePage(list, currentPage) {
        let from = (currentPage - 1) * this.pageSize;
        let to = currentPage * this.pageSize;
        this.tableDataEnd = [];
for (; from < to; from++) {
          if (list[from]) {
            this.tableDataEnd.push(list[from]);
}}},
    initMap() {
      this.map = new AMap.Map("amap", {
        resizeEnable: true,
        zoom: 12,
        mapStyle: "amap://styles/whitesmoke",
        center: [114.306434, 30.5988],
      });

      AMap.plugin("AMap.Driving", function () {});
      AMap.plugin("AMap.Autocomplete", function () {
        AMap.plugin("AMap.Geocoder", function () {});
      });
      this.$nextTick(() => {
        var autoOption1 = {
          // input 为绑定输入提示功能的input的DOM ID
          city: "全国",
          input: "complete1",
          citylimit: true,
        };
        const autoComplete1 = new AMap.Autocomplete(autoOption1);
        var autoOption2 = {
          // input 为绑定输入提示功能的input的DOM ID
          city: "全国",
          input: "complete2",
          citylimit: true,
        };
        const autoComplete2 = new AMap.Autocomplete(autoOption2);
      });
      var geoOption = {
        city: "全国",
        citylimit: true,
      };
      this.geoCoder = new AMap.Geocoder(geoOption);
      this.setMarker();
      this.initLine();
      //this.initroad();
    },

    setMarker() {
      const map = this.map;
      const tmp_this = this;
      var lng = "";
      var lat = "";
      this.lineArr = [];
      for (const index in this.tableData) {
        const spot = this.tableData[index].address;
        const time = this.tableData[index].time;
        this.geoCoder.getLocation(spot, function (status, result) {
          if (status === "complete" && result.geocodes.length) {
            var lnglat = result.geocodes[0].location;
            lng = lnglat.lng;
            lat = lnglat.lat;
            tmp_this.lineArr.push([lng, lat]);
            if (tmp_this.lineArr.length === tmp_this.tableData.length) {
              //tmp_this.initroad();
              tmp_this.initLine();
            }
        // tmp_this.set(lng,lat)
        
            // let index1 = parseInt(index) + 1;
            // var text = new AMap.Text({
            //   text: index1,
            //   anchor: "center", // 设置文本标记锚点
            //   // draggable: true, // 是否可移动文本
            //   cursor: "pointer",
            //   angle: 10,
            //   style: {
            //     // padding: ".75rem 1.25rem",
            //     // "margin-bottom": "1rem",
            //     // "border-radius": ".25rem",
            //     "margin-top": "2px",
            //     "background-color": "#cccccc",
            //     opacity: "0.7",
            //     // width: "100%",
            //     "border-width": 0,
            //     "box-shadow": "0 2px 6px 0 rgba(114, 124, 245, .5)",
            //     "text-align": "center",
            //     "font-size": "20px",
            //     "font-weight": "500",
            //     color: "#000000",
            //   },
            //   position: [lng, lat],
            // });
            // text.setMap(map);
            map.setFitView();
          }
        });
      }
    },
//     set(lng, lat){
//       var markerspot = null
//       const map = this.map;
//       var isAdd = false;
//       var radius = 20
// setInterval(()=>{
//           // 修改半径
//           if(radius == 20){
//             isAdd = true;
//           } 
//           if(radius == 50){
//             isAdd = false;
//           }
//           if(isAdd){
//             radius+=2;
//           } else {
//             radius-=2;
//           }
//           markerspot && map.remove(markerspot)
//           markerspot = new AMap.CircleMarker({
//               center: [lng, lat],
//               radius: radius, 
//               strokeColor: "white", // 边框颜色
//               strokeWeight: 2,
//               strokeOpacity: 0.5,
//               fillColor: "#cccccc", // 背景色
//               fillOpacity: 0.7, //透明度
//               zIndex: 1000,
//               bubble: true,
//               cursor: "pointer",
//               clickable: true,
//             });
//             map.add(markerspot);
//         },50)
//     },

    initLine() {
      let Driving_obj = new AMap.Driving({
        map: this.map,
      });
      Driving_obj.clear();
      var path = [];
      for (const index in this.tableData) {
        const spot = this.tableData[index].address;
        path.push({ keyword: spot, city: "全国" });
      }
      Driving_obj.search(path, function (status, result) {
        if (status === "complete") {
          if (result.routes && result.routes.length) {
            drawRoute(result.routes[0], f);
          }
        }
      });
    },
    initroad() {
      this.polyline = new AMap.Polyline({
        map: this.map,
        path: null,
        showDir: true,
        strokeColor: "#77DDFF", // 线颜色--浅蓝色
        // strokeOpacity: 1,     //线透明度
        strokeWeight: 2, // 线宽
        // strokeStyle: "solid"  //线样式
        lineJoin: "round", // 折线拐点的绘制样式
      });
      this.polyline.setPath(this.lineArr);
      this.polyline.show();
      this.map.setFitView(); // 合适的视口
    },

    queryPeople() {
      infectList({ status: 3 }).then((response) => {
        for (var index in response.rows) {
          this.peopleList.push({
            label: response.rows[index].name,
            value: response.rows[index].peopleId,
          });
        }
        this.formQuery.name = response.rows[0].name;
        this.queryInfo(response.rows[0].peopleId);
      });
    },
    queryInfo(id) {
      if (id != "") {
        infectInfo(id).then((response) => {
          this.formQuery.name = response.data.name;
          this.formQuery.id = response.data.peopleId;
          this.formQuery.phone = response.data.phonenumber;
          this.getList();
        });
      } else if (this.formQuery.name != "") {
        infectInfo(this.formQuery.name).then((response) => {
          this.formQuery.name = response.data.name;
          this.formQuery.id = response.data.peopleId;
          this.formQuery.phone = response.data.phonenumber;
          this.getList();
        });
      }
    },
    getList() {
      this.loading = true;
      travelList({ peopleId: this.formQuery.id }).then((response) => {
        if (response.rows.length === 0) {
          trackList({ peopleId: this.formQuery.id }).then((res) => {
            this.loading = false;
            this.tableData = res.rows;
            this.total = res.rows.length
            this.spot.recordId = Math.random() * 10000000;
            for (var index in res.rows) {
              this.tableData[index].arriveTime = res.rows[index].time;
              this.tableData[index].leftTime = res.rows[index].time;
              this.tableData[index].recordId = this.spot.recordId;
            }
        if (this.total > this.pageSize) {
        for (let index = 0; index < this.pageSize; index++) {
          this.tableDataEnd.push(this.tableData[index]);
        }
      } else {
        this.tableDataEnd = this.tableData;
      }
            this.commitTravel();
            this.initMap();
          });
        } else {
          this.loading = false;
          this.tableData = response.rows;
          this.total = response.rows.length
          this.spot.recordId = response.rows[0].recordId
          if (this.total > this.pageSize) {
        for (let index = 0; index < this.pageSize; index++) {
          this.tableDataEnd.push(this.tableData[index]);
        }
      } else {
        this.tableDataEnd = this.tableData;
      }
          this.initMap();
        }
      });
      this.loading = false
    },
    commitTravel() {
      setTimeout(() => {
        travelList({ peopleId: this.formQuery.id }).then((response) => {
          if (response.rows.length === 0) {
            for (var index in this.tableData) {
              travelAdd({
                address: this.tableData[index].address,
                arriveTime: this.tableData[index].arriveTime,
                leftTime: this.tableData[index].leftTime,
                peopleId: this.formQuery.id,
                recordId: this.tableData[index].recordId,
              });
            }
          }
        });
      }, 1000);
    },
    handleEdit(index, row) {
      this.new_time = row.arriveTime;
      this.new_time1 = row.leftTime;
      this.new_address = row.address;
      this.spot.travelId = row.travelId;
      this.listID = index;
      this.centerDialogEdit = true;
      travelList({ peopleId: this.formQuery.id }).then((response) => {
          if (response.rows.length === 0) {
            for (var index in this.tableData) {
              travelAdd({
                address: this.tableData[index].address,
                arriveTime: this.tableData[index].arriveTime.toString(),
                leftTime: this.tableData[index].leftTime.toString(),
                peopleId: this.formQuery.id,
                recordId: this.tableData[index].recordId,
              });
            }
          }
        });
      this.initMap();
    },
    tableRowClassName({ row, rowIndex }) {
      row.index = rowIndex;
    },
    edit() {
      const i = this.listID;
      this.spot.arriveTime = document.getElementById("time2").value;
      this.spot.leftTime = document.getElementById("time22").value;
      this.spot.address = document.getElementById("complete2").value;
      travelUpdate(this.spot).then(()=>{
        this.$message.success("修改成功")
        this.getList();
      });
      this.centerDialogEdit = false;
      this.initMap();
    },
    handleAdd() {
      this.centerDialogAdd = true;
      this.initMap();
    },
    add() {
      travelAdd({
        address: document.getElementById("complete1").value,
        arriveTime: document.getElementById("time1").value,
        leftTime: document.getElementById("time11").value,
        peopleId: this.formQuery.id,
        recordId: this.spot.recordId,
      }).then(()=>{
this.$message.success("添加成功！")
this.getList();
      document.getElementById("time1").value = "";
      document.getElementById("time11").value = "";
      document.getElementById("complete1").value = "";
      this.centerDialogAdd = false;
      this.initMap();
      });
      
    },
    handleDelete(row) {
      this.centerDialogDel = true;
      this.spot.travelId = row.travelId;
    },
    del() {
      travelDelete(this.spot.travelId).then(
        this.$message.success("删除成功！")
      );
      this.centerDialogDel = false;
      this.initMap();
      this.getList();
    },
    handleCommit() {
      const this_ = this
      var codes = []
      for (var index in this.tableData) {
        this.geoCoder.getLocation(
          this.tableData[index].address,
          function (status, result) {
            if (status === "complete" && result.geocodes.length) {
              if(!codes.includes(result.geocodes[0].adcode))
              codes.push(result.geocodes[0].adcode)
            }
          }
        );
      }
      connectList(this.spot.recordId).then(()=>{
        this.$message.success("提交成功")
      }).catch(() => {})
    },
    handleExport(){
      let that = this
      require.ensure([],()=>{
      const { export_json_to_excel } = require('@/excel/Export2Excel'); 
      const tHeader = ['到达时间','离开时间','地点']; 
      const filterVal =['arriveTime','leftTime','address']; 
      const list = that.tableData;
      const data = that.formatJson(filterVal, list);
      export_json_to_excel(tHeader, data, this.formQuery.id+'人员出行轨迹表');
      })
    },
    formatJson (filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    }
  },
};
</script>
 
 
<style lang="scss" scoped>
.home_container {
  padding: 5px 5px;
  line-height: 1;
  .center-content {
    margin-top: 3px;
    display: flex;
    flex-direction: column;
  }
}
.theme {
  color: #1e1e1e;
  font-size: 20px;
  font-weight: 550;
  margin-bottom: 2px;
  text-align: center;
  padding: 0px;
}
.amap {
  height: 500px;
  width: 100%;
}
.show_table {
  position: relative;
  width: 100%;
  height: 500px; //高度加到这里
  overflow: auto;
}
</style>