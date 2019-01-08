<template>
  <div class="root">
    <div class="head">翻转课堂管理平台</div>
    <div class="aside">
      <div class="menu">
        <div class="text">学生管理</div>
        <div style="border-bottom: 3px solid #101434;width: 60%"></div>
      </div>
      <div class="menu">
        <div class="text" @click="jumpToTeacher">教师管理</div>
        <div style="border-bottom: 3px solid #101434;width: 60%;visibility: hidden"></div>
      </div>
    </div>
    <div class="main">
      <div class="search-div">
        <div style="margin-left: 2%;float:left;width: 20%;height: 100%;display: flex;align-items: center;"><Input placeholder="请输入姓名或者学号" v-model="search"></Input></div>
        <div style="float: left;height: 50%;margin-left: 1%;height: 100%;display: flex;align-items: center;"><Icon type="ios-search-outline" :size="30" @click="searchByInput(search)"/></div>
        <div style="float:right;width: 20%;height: 100%;display: flex;align-items: center;">
          <!--<button class="button1" @click="handleNew">添加</button>-->
          <button class="button2" @click="reFreshAllStudent()">刷新</button>
        </div>
      </div>
      <div class="table-div">
        <el-table :data="tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)" border style="width: 96%;margin-left: 2%" height="90%">
          <el-table-column prop="number" label="学号">
          </el-table-column>
          <el-table-column prop="name" label="姓名"></el-table-column>
          <el-table-column prop="email" label="邮箱"></el-table-column>
          <el-table-column label="操作" align="center" header-align="left">
            <template slot-scope="scope">
              <button class="button-edit" @click="handleEdit(scope.index,scope.row)"><i class="el-icon-edit"></i></button>
              <button class="button-reset" @click="resetPassword(scope.index,scope.row)"><i class="el-icon-refresh"></i></button>
              <button class="button-delete" @click="handleDelete(scope.index,scope.row)"><i class="el-icon-delete"></i></button>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination layout="prev, pager, next, sizes, total, jumper" :page-sizes="[5, 10,100]" :page-size="pageSize" :total="tableData.length" @current-change="handleCurrentChange" @size-change="handleSizeChange" style="text-align: center;margin-top: 1%;"></el-pagination>

        <el-dialog title="编辑学生信息" :visible.sync="editDialogFormVisible" width="25%">
          <el-form :model="editForm">
            <el-form-item label="教工号" :label-width="formLabelWidth" size="mini">
              <el-input v-model="editForm.number" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="姓名" :label-width="formLabelWidth" size="mini">
              <el-input v-model="editForm.name" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="电子邮箱" :label-width="formLabelWidth" size="mini">
              <el-input v-model="editForm.email" auto-complete="off"></el-input>
            </el-form-item>
          </el-form>
          <div style="width: 100%;height: 20%;margin-bottom: 10%">
            <button style="width: 20%;margin-left: 5%;height: 100%;background: #9B30FF;border: none;border-radius: 3px;color: #fff;font-size:110%;float:right;" @click="cancelEdit">取 消</button>
            <button style="width: 20%;margin-left: 5%;height: 100%;background: #ffc51b;border: none;border-radius: 3px;color: #fff;font-size:110%;float:right" @click="confirmEdit">修 改</button>
          </div>
        </el-dialog>

      </div>
    </div>
  </div>
</template>

<script>
    export default {
        name: "studentAdmin",
      data(){
          return{
            id:localStorage.getItem("token"),
            msg: 8888,
            tableData: [{
              id:'',
              number:'',
              name:'',
              email:''
            }],
            pageSize: 10,
            currentPage: 1,
            search:'',
            editDialogFormVisible:false,
            newForm:{
              name:'',
              email:'',
              number:''
            },
            editForm:{
              name:'',
              email:'',
              number:''
            },
            formLabelWidth:'100px',
          }
      },
      methods:{
        jumpToTeacher:function(){
          this.$router.push({
            name:'teacherAdmin'
          })
        },
        handleCurrentChange:function(cpage){
          this.$data.currentPage = cpage;
        },
        handleSizeChange:function(psize){
          this.$data.pageSize = psize;
        },
        getAllStudent:function() {
          let _this = this;
          this.$axios({
            method: 'get',
            url: '/student',
            headers: {
              'Authorization': 'Bearer '+_this.$data.id
            },
          }).then(function (response) {
            _this.$data.tableData = response.data;
            for (var i = 0; i < response.data.length; i++) {
              _this.$data.tableData[i].id = response.data[i].id;
              _this.$data.tableData[i].number = response.data[i].account;
              _this.$data.tableData[i].name = response.data[i].name;
              _this.$data.tableData[i].email = response.data[i].email;
            }
          }).catch(function (error) {
            console.log(error.data);
          })
        },
        reFreshAllStudent:function(){
          this.$data.tableData.splice(0,this.$data.tableData.length);
          this.getAllStudent();
        },
        resetPassword:function(index,row){
          let _this=this;
          this.$axios({
            url:'/student/'+row.id+'/password',
            method: 'put',
            headers: {
              'Authorization': 'Bearer '+_this.$data.id
            },
          }).then(function(response){
            _this.$message({
              message:response.data.name+'的密码已重置为123456',
              type:'success'
            })
          }).catch(function(error){
            console.log(error)
          })
        },
        handleDelete:function(index,row){
          this.$confirm('此操作将永久删除该学生, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.deleteStudent(index,row);
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        },
        deleteStudent:function(index,row){
          let _this=this;
          this.$axios({
            url:'/student/'+row.id,
            method: 'delete',
            headers: {
              'Authorization': 'Bearer '+_this.$data.id
            },
          }).then(function(response){
            if(response.data===true) {
              _this.$message({
                message:'删除成功!',
                type: 'success'
              })
              _this.$data.tableData.splice(0,_this.$data.tableData.length);
              _this.getAllStudent();
            }
          }).catch(function(error){
            console.log(error)
          })
        },
        searchByInput:function(input){
          let _this=this;
          if(input==='') _this.getAllStudent();
          else _this.searchS(input);
        },
        searchS:function(input) {
          let _this = this;
          this.$axios({
            url: '/student/searchstudent?identity='+input,
            method: 'get',
            headers: {
              'Authorization': 'Bearer '+_this.$data.id
            },
          }).then(function (response) {
            _this.$data.tableData.splice(0, _this.$data.tableData.length);
            _this.$data.tableData.push({
              id:response.data.id,
              number:response.data.account,
              name:response.data.name,
              email:response.data.email
            })
          }).catch(function (error) {
            console.log(error)
          })
        },
        handleEdit:function(index,row){
          let _this = this;
          _this.$data.editDialogFormVisible = true;
          _this.$data.editForm=row;
        },
        confirmEdit:function(){
          let _this = this;
          this.$axios({
            url: '/student/'+_this.$data.editForm.id+'/information',
            method: 'put',
            data:{
              account:_this.$data.editForm.number,
              name:_this.$data.editForm.name,
              email:_this.$data.editForm.email
            },
            headers: {
              'Authorization': 'Bearer '+_this.$data.id
            },
          }).then(function (response) {
            _this.$message({
              type: 'success',
              message: '修改成功!'
            });
            _this.reFreshAllStudent();
            _this.$data.editDialogFormVisible = false;
          }).catch(function (error) {
            _this.$message({
              message:'出了一点意外',
              type:'error'
            })
            console.log(error);
          })
        },
        cancelEdit:function(){
          this.$data.editDialogFormVisible = false;
          this.reFreshAllStudent()
        }
      },
      created() {
          this.getAllStudent();
      }
    }
</script>

<style scoped>
  .root{
    width: 100%;
    height: 100%;
  }
  .head{
    width: 100%;
    height: 8%;
    background: #101434;
    color: #f2f2f2;
    letter-spacing:1px;
    display: flex;
    align-items: center;
    padding-left: 2%;
    font-size:150%
  }
  .aside{
    width: 20%;
    height: 92%;
    background: #e7e8e6;
    float: left;
  }
  .main{
    background: #f2f2f2;
    width: 80%;
    height: 92%;
    float: left;
  }
  .menu{
    width: 90%;
    margin-left: 5%;
    height: 10%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction:column;
    border-bottom: 1px solid #d9d9d9;
  }
  .text{
    width:70%;
    text-align: center;
    font-size:150%;
    color: #101434;
    font-weight: bolder;
  }
  .search-div{
    width: 98%;
    height: 10%;
    margin-left: 1%;
    margin-top: 1%;
    background: white;
    border: transparent;
    border-radius: 3px;
    box-shadow: #cccccc 0px 0px 5px;
  }
  .table-div{
    width: 98%;
    height: 86%;
    margin-left: 1%;
    margin-top: 1%;
    background: white;
    border: transparent 1px none;
    border-radius: 3px;
    box-shadow: #cccccc 0px 0px 5px;
    padding-top: 1%;
  }
  .button1{
    width: 40%;
    margin-left: 5%;
    height: 50%;
    background: #9B30FF;
    border: none;
    border-radius: 3px;
    color: #fff;
    font-size:110%
  }
  .button2{
    width: 40%;
    margin-left: 50%;
    height: 50%;
    background: #ffc51b;
    border: none;
    border-radius: 3px;
    color: #fff;
    font-size:110%;
  }
  .button-edit{
    width: 25%;
    color: #fff;
    border: #101434 1px solid;
    background: #101434;
    border-radius: 3px;
  }
  .button-reset{
    width: 25%;
    margin-left: 5%;
    color: #fff;
    border: #ffc51b 1px solid;
    background: #ffc51b;
    border-radius: 3px;
  }
  .button-delete{
    width: 25%;
    margin-left: 5%;
    color: #fff;
    border: #9b2b00 1px solid;
    background: #9b2b00;
    border-radius: 3px;
  }
</style>
