<template>
  <div>
    <el-dialog
      :title="addInfo.isAdd ? '添加秒杀' : '修改秒杀'"
      :visible.sync="addInfo.isShow"
      :before-close="cancel"
      center
    >
      <el-form :model="form" :rules="rules" ref="rules">
        <el-form-item
          prop="title"
          label="活动名称:"
          :label-width="formLabelWidth"
        >
          <el-input v-model="form.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="活动期限:" :label-width="formLabelWidth">
          <el-date-picker
            v-model="timer"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="一级分类" :label-width="formLabelWidth">
          <el-select
            v-model="form.first_cateid"
            placeholder="请选择"
            @change="changeCate(false)"
          >
            <!-- 下拉框循环我的菜单列表 -->
            <el-option
              v-for="item in cateList"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类" :label-width="formLabelWidth">
          <el-select
            v-model="form.second_cateid"
            placeholder="请选择"
            @change="changeGoods()"
          >
            <!-- 下拉框循环我的菜单列表 -->
            <el-option
              v-for="item in secondArr"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品" :label-width="formLabelWidth">
          <el-select v-model="form.goodsid" placeholder="请选择">
            <!-- 下拉框循环我的菜单列表 -->
            <el-option
              v-for="item in goodsArr"
              :key="item.id"
              :label="item.goodsname"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态:" :label-width="formLabelWidth">
          <el-switch
            v-model="form.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="2"
          >
          </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button v-if="addInfo.isAdd" @click="add" type="primary"
          >添 加</el-button
        >
        <el-button v-else @click="update" type="primary">编 辑</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
//引入辅助性函数
import { mapGetters, mapActions } from "vuex";
//引入封装好的接口
import {
  getGoodsList,
  getSeckAdd,
  getSeckInfo,
  getSeckEdit,
} from "../../util/axios";
export default {
  data() {
    return {
      form: {
        title: "", //秒杀名称
        begintime: "", //开始时间
        endtime: "", //结束时间
        first_cateid: "", //商品一级分类编号
        second_cateid: "", //商品二级分类编号
        goodsid: "", //商品编号
        status: 1, //状态
      },
      timer: "", //日期

      formLabelWidth: "120px",
      rules: {
        title: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          { min: 2, max: 8, message: "长度在 2 到 8 个字符", trigger: "blur" },
        ],
      },
      secondArr: [], //创建一个二级分类数组
      goodsArr: [], //创建一个商品数组
    };
  },
  props: ["addInfo"],
  computed: {
    //获取菜单列表
    ...mapGetters({
      seckList: "seck/getSeckList",
      cateList: "cate/getCateList",
    }),
  },
  mounted() {
    this.getCateList();
  },
  methods: {
    //点击一级分类触发change事件
    changeCate(bool) {
      let list = this.cateList;
      for (let i in list) {
        if (list[i].id == this.form.first_cateid) {
          this.secondArr = list[i].children;
        }
      }
      if (!bool) {
        this.form.second_cateid = "";
        this.form.goodsid = ""; //清空三级
      }
    },
    //点击二级分类出现商品
    changeGoods(bool) {
      //调取商品列表接口
      getGoodsList({
        fid: this.form.first_cateid,
        sid: this.form.second_cateid,
      }).then((res) => {
        if (res.data.code == 200) {
          this.goodsArr = res.data.list;
          if (!bool) {
            this.form.goodsid = ""; //清空三级
          }
        }
      });
    },
    //调取行动
    ...mapActions({
      getCateList: "cate/getCateListAction",
      getSeckList: "seck/getSeckAction",
    }),
    //封装重置事件
    reset() {
      this.form = {
        title: "", //秒杀名称
        begintime: "", //开始时间
        endtime: "", //结束时间
        first_cateid: "", //商品一级分类编号
        second_cateid: "", //商品二级分类编号
        goodsid: "", //商品编号
        status: 1, //状态
      };
      this.$refs["rules"].resetFields();
      this.timer='';
    },
    //取消事件
    cancel() {
      //调用重置事件
      this.reset();
      //给父组件传值是弹框消失
      this.$emit("cancel", false);
    },
    //添加一条数据
    add() {
      this.form.begintime=new Date(this.timer[0]).getTime();
      this.form.endtime=new Date(this.timer[1]).getTime();
      // 调取接口
      getSeckAdd(this.form).then((res) => {
        if (res.data.code == 200) {
          //重新调取列表接口
          this.$message.success(res.data.msg);
          this.getSeckList();
          //关闭弹窗
          this.cancel();
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    //查看一条数据
    look(id) {
      //调取接口
      getSeckInfo({ id }).then((res) => {
        if (res.data.code == 200) {
          this.form = res.data.list;
          this.form.id = id;
          this.timer = [new Date(parseFloat(this.form.begintime)),new Date(parseFloat(this.form.endtime))]
          // 清空之前的双向数据绑定
          this.changeCate(true)
          this.changeGoods(true)
        }
      });
    },
    //修改数据
    update() {
      //调取修改数据的接口
      getSeckEdit(this.form).then((res) => {
        if (res.data.code == 200) {
          this.$message.success(res.data.msg);
          this.getSeckList();
          //关闭弹窗
          this.cancel();
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
  },
};
</script>

<style lang="" scoped>
</style>
