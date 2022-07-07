<template>
<div class="home_container">
  <div class="center-content">
    <el-card class="table_content">
      <div class="main">
        <template>
          <div id="topology" style="width:100%;height:500px;margin: 0 auto"></div>
        </template>
      </div>
    </el-card>
  </div>
</div>

</template>

<script>
import echarts from 'echarts'
import { getAncestor } from '../../api/Region/basic'
import {getSpreadList,getPersonList,getList} from '../../api/Topology/topology'

export default{
  components: {},
  data() {
    return {
    }
  },
  mounted(){
    this.initMap()
  },
  created(){
  },
  methods:{
    initMap(){
      var myChart = echarts.init(document.getElementById('topology'))
      myChart.showLoading({
        text:'数据加载中......',
        color:"#B2312D",
        textColor:"#B2312D",
        fontSize: 50,
        showSpinner: true,
        spinnerRadius: 20,
        lineWidth: 5,
        zlevel: 0,
      })
      var categories=[{name:'阳性'},{name:'密接'},{name:'次密接'}]
      var data=[]
      var linkData=[]
      getPersonList().then(resp=>{
        resp.rows.forEach(it=>{
          var dataItem={}
          dataItem.name=it.name
          if(it.status=='1'){
            dataItem.des='次密接<br/>'+ it.phonenumber +'<br/>'+it.address+'<br/>'+it.ancestors
            dataItem.symbolSize=40
            dataItem.category=2
          }else if(it.status=='2'){
            dataItem.des='密接<br/>'+ it.phonenumber +'<br/>'+it.address+'<br/>'+it.ancestors
            dataItem.symbolSize=50
            dataItem.category=1
          }else if(it.status=='3'){
            dataItem.des='阳性<br/>'+ it.phonenumber +'<br/>'+it.address+'<br/>'+it.ancestors
            dataItem.symbolSize=70
            dataItem.category=0
          }
          data.push(dataItem)
        })
        getList().then(res=>{
          for(var j=0;j<res.rows.length;j++){
            var linkItem={}
            console.log(j)
            linkItem.source=res.rows[j].dadname
            linkItem.target=res.rows[j].sonname
            linkItem.name=''
            linkData.push(linkItem)
            if(j==res.rows.length-1){
              var option = {
                // 图的标题
                title: {
                  text: '感染人员拓扑图'
                },
                // 提示框的配置
                tooltip: {
                  formatter: function (x) {
                    return x.data.des;
                  }
                },
                // 工具箱
                toolbox: {
                  // 显示工具箱
                  show: true,
                  feature: {
                  mark: {
                  show: true
                  },
                // 还原
                restore: {
                  show: true
                },
                // 保存为图片
                saveAsImage: {
                  show: true
                }
                }
                },
                legend: [{
                  // selectedMode: 'single',
                  data: categories.map(function (a) {
                    return a.name;
                  })
                }],
                series: [{
                type: 'graph', // 类型:关系图
                layout: 'force', // 图的布局，类型为力导图
                symbolSize: 40, // 调整节点的大小
                roam: true, // 是否开启鼠标缩放和平移漫游。默认不开启。如果只想要开启缩放或者平移,可以设置成 'scale' 或者 'move'。设置成 true 为都开启
                edgeSymbol: ['circle', 'arrow'],
                edgeSymbolSize: [2, 10],
                edgeLabel: {
                normal: {
                  textStyle: {
                    fontSize: 25
                    }
                  }
                },
                force: {
                  repulsion: 900,
                  edgeLength: [10, 20],
                  layoutAnimation: true
                },
                draggable: true,
                lineStyle: {
                normal: {
                    curveness: 0.3,
                    color:'target'
                  }
                },
                edgeLabel: {
                normal: {
                  show: true,
                  formatter: function (x) {
                  return x.data.name;
                }
                }
                },
                label: {
                  normal: {
                  show: true,
                  textStyle: {}
                }
                },
                  // 数据
                  data: data,
                  links: linkData,
                  categories: categories,
                }]
                };
                myChart.setOption(option);
                myChart.hideLoading()
            }
          }
        })
      })
    }
  }
}

</script>

<style lang="scss" scoped>
.home_container {
  padding: 5px 5px;
  line-height: 1;
  height: 100%;
}
  .center-content {
    margin-top: 20px;
    display: flex;
    width: 100%;
    background-color: transparent!important;
  }
  .table_content{
    display:flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    margin: 5px 10px;
  }
</style>
    