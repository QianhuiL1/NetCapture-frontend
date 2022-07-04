<template>
<div class="home_container">
  <div class="center-content">
    <el-card class="table_content">
      <div class="map">
          <template>
            <div id="Mymap" style="height: 700px;margin: 0 auto"></div>
          </template>
          </div>
    </el-card>
    </div>
    </div>

</template>

<script>
import echarts from 'echarts';
export default{
  data(){
    return {
      
    }
  },
  created(){
    this.initMap()
  },
  methods:{
    initMap(){
      var ownMap = echarts.init(document.getElementById('Mymap'));
      var data = {
        "name": "flare",
        "children": [
            {
                "name": "data",
                "children": [
                    {
                        "name": "converters",
                        "children": [
                          {"name": "Converters", "value": 721},
                          {"name": "DelimitedTextConverter", "value": 4294}
                        ]
                    },
                    {
                        "name": "DataUtil",
                        "value": 3322
                    }
                ]
            },
            {
                "name": "display",
                "children": [
                    {"name": "DirtySprite", "value": 8833},
                    {"name": "LineSprite", "value": 1732},
                    {"name": "RectSprite", "value": 3623}
              ]
            },
            {
                "name": "flex",
                "children": [
                    {"name": "FlareVis", "value": 4116}
                ]
            },
            {
              "name": "query",
              "children": [
                {"name": "AggregateExpression", "value": 1616},
                {"name": "And", "value": 1027},
                {"name": "Arithmetic", "value": 3891},
                {"name": "Average", "value": 891},
                {"name": "BinaryExpression", "value": 2893},
                {"name": "Comparison", "value": 5103},
                {"name": "CompositeExpression", "value": 3677},
                {"name": "Count", "value": 781},
                {"name": "DateUtil", "value": 4141},
                {
                "name": "methods",
                "children": [
                  {"name": "add", "value": 593},
                  {"name": "and", "value": 330},
                  {"name": "average", "value": 287},
                  {"name": "count", "value": 277},
                  {"name": "distinct", "value": 292},
                  {"name": "div", "value": 595},
                  {"name": "eq", "value": 594},
                  {"name": "fn", "value": 460},
                  {"name": "gt", "value": 603},
                  {"name": "gte", "value": 625},
                  {"name": "iff", "value": 748},
                  {"name": "isa", "value": 461},
                  {"name": "lt", "value": 597},
                  {"name": "lte", "value": 619},
                  {"name": "max", "value": 283},
                ]
                },
                {"name": "Minimum", "value": 843},
                {"name": "Not", "value": 1554},
                {"name": "Or", "value": 970},
                {"name": "Query", "value": 13896},
                {"name": "Range", "value": 1594},
                {"name": "StringUtil", "value": 4130},
                {"name": "Sum", "value": 791},
                {"name": "Variable", "value": 1124},
                {"name": "Variance", "value": 1876},
                {"name": "Xor", "value": 1101}
              ]
              },
            {
              "name": "scale",
              "children": [
                {"name": "IScaleMap", "value": 2105},
                {"name": "LinearScale", "value": 1316},
                {"name": "LogScale", "value": 3151},
                {"name": "OrdinalScale", "value": 3770},
                {"name": "QuantileScale", "value": 2435},
                {"name": "QuantitativeScale", "value": 4839},
                {"name": "RootScale", "value": 1756},
                {"name": "Scale", "value": 4268},
                {"name": "ScaleType", "value": 1821},
                {"name": "TimeScale", "value": 5833}
              ]
            }
        ]
    };
    var option={
       tooltip: {
            trigger: 'item',
            triggerOn: 'mousemove'
        },
        legend: {
            top: '2%',
            left: '3%',
            orient: 'vertical',
            data: [{
                name: 'tree1',
                icon: 'rectangle'
            },
            ],
            borderColor: '#A9334C'
        },
        series:[
            {
                type: 'tree',

                name: 'tree1',

                data: [data],

                top: '5%',
                left: '7%',
                bottom: '2%',
                right: '60%',

                symbolSize: 7,

                label: {
                    position: 'left',
                    verticalAlign: 'middle',
                    align: 'right'
                },

                leaves: {
                    label: {
                        position: 'right',
                        verticalAlign: 'middle',
                        align: 'left'
                    }
                },

                expandAndCollapse: true,

                animationDuration: 550,
                animationDurationUpdate: 750

            },
        ]
    }
    ownMap.setOption(option);
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
    margin: 5px 10px;
  }
</style>