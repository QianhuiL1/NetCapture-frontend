<template>
  <div class="home_container">
    <div class="title">
      <span>疫网捕获一码通行</span>
    </div>
    <div class="form">
   <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
  <el-form-item label="身份证号" prop="peopleId">
    <el-input v-model="ruleForm.peopleId"></el-input>
  </el-form-item>
  <el-form-item label="姓名" prop="name">
    <el-input v-model="ruleForm.name"></el-input>
  </el-form-item>
  <el-form-item label="地点" prop="address">
    <el-input v-model="ruleForm.address"></el-input>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
    <el-button @click="resetForm('ruleForm')">重置</el-button>
  </el-form-item>
</el-form>
</div>
</div>

</template>

<script>
import { pushScanInfo } from '../../api/code';

export default{
  name:'Form',
  created(){
    this.ruleForm.peopleId=this.getId()
  },
  data() {
    const validateId = (rule, value, callback) => {
      var verify =/(^\d{15}$)|(^\d{17}(\d|X|x)$)/;
      if(value==''){
        callback(new Error('请输入身份证号'))
      }else if(!verify.test(this.ruleForm.peopleId)){
callback(new Error('身份证号格式不正确'))
      }else{
        callback()
      }
    }
    const validateName = (rule, value,callback) =>{
      var verify =  /[^\u4e00-\u9fa5]/;
      if(verify.test(this.ruleForm.name)){
        callback(new Error('请输入中文名'))
      }else{
        callback()
      }
    }
      return {
        ruleForm: {
          peopleId:'',
          name: '',
          address:'武汉大学计算机学院202教室',
          submittingTime:''
        },
        rules: {
          peopleId:[
            {required:true,trigger:'blur',message:'请输入您的身份证号'},
            {required:true, validator:validateId,trigger:'blur'}
          ],
          name: [
            { required: true, message: '请输入您的姓名', trigger: 'blur' },
            { min:2,max: 10, message: '姓名长度需介于2和10之间', trigger: 'blur' },
            {
              required:true,validator:validateName,trigger:'blur'
              }
          ],
          address:[
            {required: true, message:'请输入地点',trigger:'blur'}
          ]
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.ruleForm.submittingTime= this.getCurrentTime()
            pushScanInfo(this.ruleForm).then(res=>{
              this.$message.success('提交成功');
              this.resetForm('ruleForm')
            })
          } else {
            this.$message.error('提交失败');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      getCurrentTime(){
        var date = new Date()
        var year = date.getFullYear()
        var month = date.getMonth() + 1
        var day = date.getDate()
        var hour = date.getHours()
        month = month < 10 ? '0' + month : month;
        day = day < 10 ? '0' + day : day;
        var minute = date.getMinutes()
        var second = date.getSeconds()
        return (year+'-'+month+'-'+day+' '+hour+':'+minute+':'+second)
      },
      // 生成随机身份证号
      getId(){
       var coefficientArray = [ "7","9","10","5","8","4","2","1","6","3","7","9","10","5","8","4","2"];// 加权因子
       var lastNumberArray = [ "1","0","X","9","8","7","6","5","4","3","2"];// 校验码
       var address = "420101"; // 住址
       var birthday = "19810101"; // 生日
       var s = Math.floor(Math.random()*10).toString() + Math.floor(Math.random()*10).toString() + Math.floor(Math.random()*10).toString();
       var array = (address + birthday + s).split("");   
       var total = 0;
       for( var i in array){
            total = total + parseInt(array[i])*parseInt(coefficientArray[i]);
       }       
       var lastNumber = lastNumberArray[parseInt(total%11)];
       var id_no_String = address + birthday + s + lastNumber;
       return id_no_String
    }
    }
}
</script>

<style scoped lang="scss">
.home_container {
  padding: 10px 10px;
  line-height: 1;
  height: 100%;
  display: flex;
  flex-direction:column;
}
.title{
      color:#D81E06;
      font-size: 25px;
      font-weight: 600;
      margin: 0 auto;
      margin-bottom: 100px;
      margin-top:50px;
    }
.form{
  margin: 0 auto;
  padding: 3px;
}
.bForm{
  top: 0;
	left: 0;
	right: 0;
	bottom: 0;
}
</style>