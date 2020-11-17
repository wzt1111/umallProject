<template>
  <div>
    <!-- 
      对话框属性
      visible	是否显示 Dialog，支持 .sync 修饰符
      center	是否对头部和底部采用居中布局
      formLabelWidth label的宽度
     -->
    <el-dialog
      :title="addInfo.isAdd ? '添加轮播图' : '编辑轮播图'"
      :visible.sync="addInfo.isShow"
      center
      :before-close="cancel"
    >
      <el-form :model="form" :rules="rules" ref="formDialog">
        <el-form-item
          prop="title"
          label="标题"
          :label-width="formLabelWidth"
        >
          <el-input v-model="form.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item  label="图片" :label-width="formLabelWidth">
         <!--  el-upload上传文件
            on-preview  预览  on-remove  删除
          -->
          <el-upload
            action="#"
            list-type="picture-card"
            :on-preview="onPreview" 
            :on-remove="onRemove"
            :auto-upload='false'
            :on-change='onChange'
            :file-list='fileList'
            :limit="1"
            :on-exceed="onExceed"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="" />
          </el-dialog>
        </el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth">
          <!-- 可以使用active-color属性与inactive-color属性来设置开关的背景色。 -->
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
        <el-button
          v-if="addInfo.isAdd"
          @click="add('formDialog')"
          type="primary"
          >添 加</el-button
        >
        <el-button v-else @click="update('formDialog')" type="primary"
          >编 辑
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
//引入封装好的接口
import { getBannerAdd, getBannerInfo, getBannerEdit } from "../../util/axios";
//引入辅助性函数
import { mapActions, mapGetters } from "vuex";

export default {
  data() {
    return {
      form: {
        title: "", //轮播图标题
        img:'', //图片
        status: 1, //状态1正常2禁用
      },
      rules: {
        title: [
          { required: true, message: "请输入轮播图标题", trigger: "blur" },
          {
            min: 2,
            max: 20,
            message: "长度在 2 到 20 个字符",
            trigger: "blur",
          },
        ],
      },
      formLabelWidth: "120px",
      dialogImageUrl: '',//预览图片地址
      dialogVisible: false,//预览图片弹框
      imgUrl:'',//用来接收图片信息
      fileList:[],//文件上传列表
    };
  },
  props: ["addInfo"],
  computed: {
    //获取轮播图列表的值
    ...mapGetters({
      bannerList: "banner/getBannerList",
    }),
  },
  methods: {
    //onChange 当图片上传时触发的文件
    onChange(file){
      this.imgUrl=file.raw
    },
   //图片预览
    onPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
    //图片删除
    onRemove(file, fileList) {
      },
      //文件上传限制
      onExceed(files, fileList) {
        this.$message.warning(`当前限制选择 1个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
    //封装一个重置事件
    reset() {
      this.form = {
        title: "", //轮播图标题
        img:'', //图片
        status: 1, //状态1正常2禁用
      };
      this.fileList=[];
      this.$refs["formDialog"].resetFields();
    },
    ...mapActions({
      getBannerList: "banner/getBannerListAction",
    }),
    //取消事件，关闭弹框，修改父组件数据
    cancel() {
      this.$emit("cancel", false);
      this.reset();
    },
        //添加事件
    add(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          //添加逻辑
          //调取添加接口
          let file=new FormData()
          //通过append去添加它的属性
          let data = this.form
          for(let i in data){
            file.append(i,data[i])
          }
          //添加img参数
          file.append('img',this.imgUrl)
          getBannerAdd(file).then((res) => {
            console.log(res, "添加响应");
            if (res.data.code == 200) {
              this.$message.success(res.data.msg);
              //关闭弹框
              this.cancel();
              // //重新获取列表
              this.getBannerList();
            } else {
              this.$message.error(res.data.msg);
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //查看一条事件
    look(id) {
      // console.log(id,'形参');
      //调取查看列表
      getBannerInfo({ id }).then((res) => {
        // console.log(res);
        if (res.data.code == 200) {
          this.form = res.data.list;
          //当前表单没有id，创建一个id给确定提交用
          this.form.id = id;
          //把图片格式进行转换
          this.fileList=this.form.img? [{url:`${this.$imgUrl}${this.form.img}`}]:[]
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    //编辑--确定修改事件
    update(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          //修改逻辑
          //把数据修改成formDate形式
          let data =this.form
          let file = new FormData()
          for(let i in data){
            file.append(i,data[i])
          }
    
          this.imgUrl =this.form.img
         file.append('img',this.imgUrl)
         //调取修改接口
          getBannerEdit(file).then((res) => {
            console.log(res, "添加响应");
            if (res.data.code == 200) {
              this.$message.success(res.data.msg);
              //关闭弹框
              this.cancel();
              //重新获取列表
              this.getBannerList();
            } else {
              this.$message.error(res.data.msg);
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    //下拉轮播图修改触发的事件
    changeMenu() {
      //通过用户是否选择顶级轮播图来渲染你的轮播图类型
      if (this.form.pid == 0) {
        this.form.type = 1;
      } else {
        this.form.type = 2;
      }
    },
  },
};
</script>

<style lang="" scoped></style>
