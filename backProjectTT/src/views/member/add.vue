<template>
  <div>
    <el-dialog
      title="修改会员"
      :visible.sync="addInfo.isShow"
      :before-close="cancel"
      center
    >
      <el-form :model="form" :rules="rules">
        <el-form-item
          prop="phone"
          label="手机号:"
          :label-width="formLabelWidth"
        >
          <el-input v-model="form.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="昵称:"  prop="nickname" :label-width="formLabelWidth">
        <el-input v-model="form.nickname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码:" :label-width="formLabelWidth">
        <el-input v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="状态:" :label-width="formLabelWidth">
          <el-switch
            v-model="form.status"
            active-color="#409eff"
            inactive-color="#dcdfe6"
            :active-value="1"
            :inactive-value="2"
          >
          </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button  type="primary" @click="update">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { getMemberInfo, getMemberEdit } from "../../util/axios";
export default {
  data() {
    return {
      //表单对象
      form: {
        uid:'',//会员编号
        phone:'',//手机号
        nickname: "", // 会员名称
        password: "", //会员密码
        status: 1, //状态1正常2禁用
      },
      //label宽度
      formLabelWidth: "120px",
      //规则验证
      rules: {
        nickname: [
          { required: true, message: "请输入会员名称", trigger: "blur" },
        ],
        phone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { min: 11, max: 11, message: "长度在11位", trigger: "blur" },
        ],
      },
    };
  },
  props: ["addInfo"],
  methods: {
    //封装重置事件
    //点击取消修改父组件弹框事件
    cancel() {
      this.$emit("cancel", false);
    },
    //调取行动
    ...mapActions({
      getMemberList: "member/getMemberAction",
    }),
    //编辑确定事件
    update() {
     console.log(this.form);
      //调取添加接口
      getMemberEdit(this.form).then((res) => {
        if (res.data.code == 200) {
          this.$message.success(res.data.msg);
          //重新调取接口
          this.getMemberList();
          //关闭弹框
          this.cancel();
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    //封装一个查看一条数据的方法
    look(uid) {
      //调取查看接口
      getMemberInfo({ uid }).then((res) => {
        if (res.data.code == 200) {
          this.form = res.data.list;
          this.form.uid = uid;
        }
      });
    },
  },
};
</script>

<style lang="" scoped></style>
