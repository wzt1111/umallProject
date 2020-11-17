<template>
  <div>
    <el-container>
      <el-header>
          XXX后台管理系统  
          <div v-if="getUserInfo" class="userInfo">
            欢迎 {{ getUserInfo.username }} 登录本系统
            <el-button @click="logout" type="danger" size="small"
              >退出</el-button
            >
          </div>
      
      </el-header>
      <el-container>
        <el-aside width="200px">
          <!-- 导航菜单 -->
          <v-nav></v-nav>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
//引入nav导航组件
import vNav from "../components/nav";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["getUserInfo"]),
  },
  components: {
    vNav,
  },
  methods: {
    ...mapActions(["changeUserInfoAction"]),
    //logout退出事件
    logout() {
      this.changeUserInfoAction(null);
      //退出之后强制跳转登录页
      this.$router.push("/login");
    },
  },
};
</script>

<style lang="stylus" scoped>
@import '../stylus/index.styl';

.el-header {
  background: $thirdBgColor;
  line-height 60px
  text-align center
  font-size 26px
  color: #fff;
}

.userInfo {
  font-size 16px
  color gold
  float right
}
</style>
