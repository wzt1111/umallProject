<template>
  <div class="login">
    <el-form
      :model="loginForm"
      :rules="rules"
      ref="loginForm"
      label-width="100px"
      class="loginForm"
    >
      <el-form-item>
        <h2>欢迎登录XXX后台管理系统</h2>
      </el-form-item>
      <el-form-item label="用户名" prop="username">
        <el-input v-model="loginForm.username" clearable></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          v-model="loginForm.password"
          show-password
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login('loginForm')">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getUserLogin } from "../util/axios";
import { mapActions } from "vuex";
export default {
  data() {
    return {
      loginForm: {
        username: "",
        password: "",
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 2,
            max: 15,
            message: "长度在 2 到 15 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 18,
            message: "长度在 6 到 18 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    ...mapActions(["changeUserInfoAction"]),
    //登录
    login(formName) {
      //console.log(this.$refs[formName],'formDOM')
      //validate 验证
      this.$refs[formName].validate((valid) => {
        if (valid) {
          //登录逻辑
          //调取登录接口
          getUserLogin(this.loginForm).then((res) => {
            if (res.data.code == 200) {
              this.$message.success(res.data.msg);
              //登录成功之后触发修改state的UserInfo的action
              this.changeUserInfoAction(res.data.list);
              //跳转
              this.$router.push("/home");
            } else {
              this.$message.error();
              res.data.msg;
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>

<style lang="stylus" scoped>
@import '../stylus/index.styl';

.login {
  width: 100vw;
  height: 100vh;
  background: $fristBgColor;

  .loginForm {
    position: absolute;
    left: 50%;
    top: 50%;
    margin: -150px 0 0 -220px;
    width: 400px;
    height: 220px;
    padding: 35px 10px;
  }
}
</style>
