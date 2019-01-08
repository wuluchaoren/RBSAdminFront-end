<template>
  <div class="root">
    <div class="head">
      <div class="head-font">翻转课堂管理平台</div>
    </div>
    <div class="main">
      <div>翻转课堂管理员登录</div>
      <i-input class="input" v-model="name" placeholder="账户名" size="large" clearable >
        <Icon type="ios-contact" slot="prefix" />
      </i-input>
      <i-input class="input" v-model="password" placeholder="账户密码" size="large" clearable type="password">
        <Icon type="md-lock" slot="prefix" />
      </i-input>
      <button class="button" @click="login"><span>登录</span></button>
    </div>

  </div>

</template>

<script>
  import qs from 'qs';
  export default {
    name: "Login",
    data(){
      return{
        name:'',
        password:'',
      }
    },
    methods:{
      login:function(){
        let _this=this;
        const name = _this.$data.name;
        const password = _this.$data.password;
        this.$axios({
          method: 'post',
          url: '/user/login',
          data:qs.stringify({
            account:name,
            password:password
          }),
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Control-Allow-Origin':'*'
          },
        }).then(function(response){
          if(response.data.status===200) {
            _this.$message({
              message: '登陆成功',
              type: 'success',
            });
            localStorage.setItem("token", response.data.jwtToken);
            if (response.data.obj === true)
              _this.enter(localStorage.getItem("token"));
            else
              _this.enter(localStorage.getItem("token"));
          }
        }).catch(function(error){
          _this.$data.userPassword='';
          _this.$message({
            message:'账号或密码错误',
            type:'warning',
          })
        })
      },
      enter:function(){
        this.$router.push({
          name:'studentAdmin'
        })
      }
    }
  }
</script>

<style scoped>

  .button {
    display: inline-block;
    border-radius: 5px;
    background-color: darkblue;
    border: none;
    color: #FFFFFF;
    text-align: center;
    font-size: 20px;
    /*padding: 20px;*/
    height: 10%;
    width: 100%;
    transition: all 0.5s;
    cursor: pointer;
    margin: 5px;
  }
  .button span {
    cursor: pointer;
    display: inline-block;
    position: relative;
    transition: 0.5s;
  }
  .button span:after {
    content: '»';
    position: absolute;
    opacity: 0;
    top: 0;
    right: -20px;
    transition: 0.5s;
  }
  .button:hover span {
    padding-right: 25px;
  }
  .button:hover span:after {
    opacity: 1;
    right: 0;
  }

  .root{
    height: 100%;
    width:100%;
    background: #eee;
    border-right:2px solid transparent;
  }
  .head {
    background-color:#F8F8F8;
    height:9%;
    width:100%;
    border:1px solid transparent;
  }
  .head-font{
    font-family:思源黑体;
    height:100%;
    padding-top:7px;
    margin-top: 1%;
    margin-left:1%;
    font-size: 19px;
    color:darkblue;
    letter-spacing:1px;
  }

  .main{
    height:50%;
    width:20%;
    margin-top: 16%;
    margin-left: 40%;
  }
  .main div {
    font-size: 20px;
    text-align: center;
    margin-bottom:5px;
  }
  .input{
    margin-left:5px;
    margin-top:5px;
    margin-bottom:10px;
    width: 100%;
  }

</style>
