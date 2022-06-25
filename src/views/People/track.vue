
<template>
  <div>
      <el-card class="myCard">重点人员轨迹</el-card>
    <el-card class="myCard">
      <div>
        姓名：
        <el-input
          v-model="formQuery.name"
          style="width: 200px; margin: 10px"
        />身份证号：
        <el-input
          v-model="formQuery.id"
          style="width: 200px; margin: 10px"
        />电话号码：
        <el-input
          v-model="formQuery.phone"
          style="width: 200px; margin: 10px"
        /> <el-button type="primary" icon="el-icon-plus" @click="handleAdd"
        >新增轨迹点</el-button
      ><el-button type="success" icon="el-icon-check" @click="handleCommit"
        >提交</el-button
      >
        <div class="con-list">         
      <el-table
    :data="tableData"
    :default-sort = "{prop: 'date', order: 'ascending'}"
    style="width: 100%;" height="20%">
    <el-table-column
    fixed
    prop="date"
      label="时间"
      sortable
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
        <i class="el-icon-map-location"></i>
        <span style="margin-left: 10px">{{ scope.row.spot }}</span>
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
    <span style="color: #223355"> 编辑</span></el-button>
  <el-button
    size="medium"
    type="text"
    @click="handleDelete(scope.$index, tableData)"
  >
    <i class="el-icon-delete" style="color: #d81e06" />
    <span style="color: #223355"> 删除</span></el-button>
      </template>
    </el-table-column>
  </el-table>        
</div>
      </div>
    </el-card>
<el-card><div id="amap" class="amap"></div></el-card>
    <el-dialog title="修改轨迹信息" :visible.sync="centerDialogEdit" width="40%">    
      时间：<el-date-picker
    id="time2"
      v-model="new_time"
      type="datetime"
      placeholder="请选择具体时间"
      default-time="12:00:00"
      style="width: 400px; margin: 10px;">
    </el-date-picker>         <p></p>地点：<el-input id="complete2" v-model="new_address" placeholder="请输入具体地点" style="width: 400px; margin: 10px"/>
        <span slot="footer" class="dialog-footer">        
        <el-button @click="centerDialogEdit = false; listID=''">取 消</el-button>        
        <el-button type="primary" @click="edit">确 定</el-button>      
    </span>    
</el-dialog>

<el-dialog title="新增轨迹信息" :visible.sync="centerDialogAdd" width="40%">      
    时间：<el-date-picker
    id="time1"
      v-model="new_time"
      type="datetime"
      placeholder="请选择具体时间"
      default-time="12:00:00"
      style="width: 400px; margin: 10px;">
    </el-date-picker>     
    <p></p>地点：<el-input
          type="text" id="complete1" v-model="new_address" placeholder="请输入具体地点" style="width: 400px; margin: 10px;"/>
        <span slot="footer" class="dialog-footer">        
        <el-button @click="centerDialogAdd = false; listID=''">取 消</el-button>        
        <el-button type="primary" @click="add">确 定</el-button>      
    </span>    
</el-dialog>
<el-dialog title="删除" :visible.sync="centerDialogDel" width="40%">      
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
  components: {
  geoCoder: ''
  },
 mounted(){
   this.formQuery.name=this.$route.params.peopleName
   this.formQuery.id=this.$route.params.peopleId
   this.formQuery.phone=this.$route.params.peoplePhone
   setTimeout(() => {
      this.initMap() // 异步加载（否则报错initMap is not defined）
    }, 1000)
 },
  data() {
    return {
      map: null,
      lineArr:[],
      new_time:'',
      new_address:'',
        listID: '',      
centerDialogAdd: false,      
centerDialogEdit: false,      
centerDialogDel: false, 
      formQuery: {
        name: "",
        id: "",
        phone: "",
        email: "",
        contactPersonName: "",
        contactPhone: "",
        note: "",
      },
      tableData: [{
          date: '2016-05-02',
          spot: '武汉大学'
        }, {
          date: '2016-05-04',
          spot: '武汉长江大桥'
        }, {
          date: '2016-05-01',
          spot: '武汉火车站'
        }, {
          date: '2016-05-03',
          spot: '武昌火车站'
        }]
    };
  },
 
  methods: {
    initMap() {
      this.map = new AMap.Map("amap", {
        resizeEnable: true,
        zoom: 12,
        mapStyle: "amap://styles/whitesmoke",
        center: [114.306434, 30.5988]
      })
    //   AMap.plugin(['AMap.ToolBar', 'AMap.Scale'], function () {
    //                     _this.map.addControl(new AMap.ToolBar())
    //                     _this.map.addControl(new AMap.Scale())
    //                 })
                    AMap.plugin('AMap.Driving',function(){
    });
        AMap.plugin('AMap.Autocomplete', function() {
      AMap.plugin('AMap.Geocoder', function() {
      })
      })
      this.$nextTick(()=>{
         var autoOption1 = {
          // input 为绑定输入提示功能的input的DOM ID
          city: '全国',
          input: 'complete1',
          citylimit: true
        }
        const autoComplete1 = new AMap.Autocomplete(autoOption1)
         var autoOption2 = {
          // input 为绑定输入提示功能的input的DOM ID
          city: '全国',
          input: 'complete2',
          citylimit: true
        }
        const autoComplete2 = new AMap.Autocomplete(autoOption2)
      })
      var geoOption = {
          city: '全国',
          citylimit: true
        }
      this.geoCoder = new AMap.Geocoder(geoOption)
      this.setMarker();
      this.initLine()
      this.initroad()
      },


      setMarker(){
const map = this.map;
        const tmp_this = this;
        var lng=""
        var lat=""
        this.lineArr=[]
for (const index in this.tableData) {
        const spot = this.tableData[index].spot;
        const time = this.tableData[index].date
        this.geoCoder.getLocation(spot, function(status, result) {
        if (status === "complete" && result.geocodes.length) {
          var lnglat = result.geocodes[0].location;
          lng = lnglat.lng;
          lat = lnglat.lat;
          tmp_this.lineArr.push([lng,lat])
          if(tmp_this.lineArr.length === tmp_this.tableData.length){
          tmp_this.initroad()
          tmp_this.initLine()
          }
          var markerspot = new AMap.CircleMarker({
          center: [lng, lat],
          radius: 20, //3D视图下，CircleMarker半径不要超过64px 大小
          strokeColor: "white", // 边框颜色
          strokeWeight: 2,
          strokeOpacity: 0.5,
          fillColor: "#9b9a99", // 背景色
          fillOpacity: 1, //透明度
          zIndex: 1000,
          bubble: true,
          cursor: "pointer",
          clickable: true,
        });
          let index1=parseInt(index)+1
          map.add(markerspot)
          var text = new AMap.Text({
          text: index1,
          anchor: "center", // 设置文本标记锚点
          // draggable: true, // 是否可移动文本
          cursor: "pointer",
          angle: 10,
          style: {
            // padding: ".75rem 1.25rem",
            // "margin-bottom": "1rem",
            // "border-radius": ".25rem",
            "margin-top": "2px",
            "background-color": "#9b9a99",
            opacity: "1",
            // width: "100%",
            "border-width": 0,
            // "box-shadow": "0 2px 6px 0 rgba(114, 124, 245, .5)",
            "text-align": "center",
            "font-size": "20px",
            color: "#fff",
          },
          position:[lng, lat],
        });
        text.setMap(map);
//         var marker = new AMap.Marker({
//           position: null
//         });
//         map.add(marker);
//         marker.setPosition([lng,lat])
//         marker.show()
//         var infoWindow = new AMap.InfoWindow({ offset: new AMap.Pixel(0, -30) });
//         marker.content = "第" + index1 + "个轨迹点"+"<br>"+"具体时间: "+time+"<br>"+"详细地址: "+spot;
//         marker.on("click", markerClick);
//         //marker.emit("click", { target: marker });
//         function markerClick(e) {
//         infoWindow.setContent(e.target.content);
//         infoWindow.open(map, e.target.getPosition());
// }
map.setFitView();
        }
        })
      }
      

      },
      initLine(){
        let Driving_obj = new AMap.Driving({
          map: this.map, // map 指定将路线规划方案绘制到对应的AMap.Map对象上
        })
        Driving_obj.clear()
        var path =[]
        for (const index in this.tableData) {
        const spot = this.tableData[index].spot;
              path.push({keyword:spot,city:'武汉'})
        }
Driving_obj.search(path,function(status, result) { 
  if (status === 'complete') {
                if (result.routes && result.routes.length) {
                  drawRoute(result.routes[0], f)
                }
              } 
});
      },
      initroad () {
      this.polyline = new AMap.Polyline({
        map: this.map,
        path: null,
        showDir: true,
        strokeColor: '#77DDFF', // 线颜色--浅蓝色
        // strokeOpacity: 1,     //线透明度
        strokeWeight: 2, // 线宽
        // strokeStyle: "solid"  //线样式
        lineJoin: 'round' // 折线拐点的绘制样式
      })
      this.polyline.setPath(this.lineArr)
      this.polyline.show()
      this.map.setFitView() // 合适的视口
    },

    handleEdit (index, row) {   
    this.centerDialogEdit = true   
    this.new_time=row.date
    this.new_address=row.spot
    this.listID=index;   
    this.initMap()
}, 
edit () {      
    const i = this.listID      
    this.tableData[parseInt(i)].date = document.getElementById("time2").value
    this.tableData[parseInt(i)].spot=document.getElementById("complete2").value
    document.getElementById("time2").value = ''   
    document.getElementById("complete2").value = ''   
    this.centerDialogEdit = false 
    this.$message("修改成功！")
    this.initMap()
},
handleAdd () {  
    this.centerDialogAdd = true  
    this.initMap()  
    },    
add () {      
    this.tableData.push({date:document.getElementById("time1").value,spot:document.getElementById("complete1").value})      
    document.getElementById("time1").value = ''   
    document.getElementById("complete1").value = ''       
    this.centerDialogAdd = false    
    this.$message("添加成功！")
    this.initMap()
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
    this.initMap()
},
  },
};
</script>
 
 
<style lang="scss" scoped>
.amap {
  height: 500px;
  width: 100%;
}
.amap-sug-result { 
  visibility: visible;
  z-index: 9999999999 !important;
   } 
.show_table {
  position: relative;
  width: 100%;
  height: 500px; //高度加到这里
  overflow: auto;
}
</style>