<template>
  <div>
    <el-bread></el-bread>
    <!-- 添加按钮 -->
    <el-button type="primary" size="small" @click="isAdd" plain>添加</el-button>
    <!-- 表格列表渲染 -->
    <v-table @edit='edit'></v-table>
    <!-- 弹框渲染 -->
    <v-dialog ref='dialog' :addInfo="addInfo" @cancel="cancel"></v-dialog>
  </div>
</template>

<script>
import elBread from "../../components/el-bread";
//引入管理员管理列表
import vTable from "./list";
import vDialog from "./add";
export default {
  data() {
    return {
      addInfo: {
        isShow: false, //弹框打开关闭
        isAdd: true, //添加 还是编辑
      },
    };
  },
  methods: {
    //添加事件
    isAdd() {
      //打开弹框
      //打开弹框
      this.addInfo.isShow = true;
      this.addInfo.isAdd = true;
    },
    //取消事件
    cancel(e) {
      //关闭弹框
      this.addInfo.isShow = e;
    },
    //触发编辑事件
    edit(e){
    //打开弹框
    this.addInfo.isShow = true;
    this.addInfo.isAdd = false;
    this.$refs.dialog.look(e)
    }
  },
  components: {
    elBread,
    vTable,
    vDialog,
  },
};
</script>

<style lang="" scoped>
.el-button{
    margin-bottom:20px;
}
</style>
