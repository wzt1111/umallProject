<template>
  <div>
    <el-dialog
      :title="addInfo.isAdd ? '添加规格' : '修改规格'"
      :visible.sync="addInfo.isShow"
      :before-close="cancel"
      center
    >
      <el-form :model="form" :rules="rules" ref="rules">
        <el-form-item
          prop="specsname"
          label="规格名称:"
          :label-width="formLabelWidth"
       
        >
          <el-input v-model="form.specsname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item v-for="(item,index) in arrAttr" :key="index" label="规格属性:" :label-width="formLabelWidth">
          <el-input class="inputW" v-model="item.value" autocomplete="off"></el-input>
          <el-button v-if="index==0" type="primary" @click='addAttr'>新增规格属性</el-button>
          <el-button v-else type="danger" @click='delAttr(item)'>删除</el-button>
        </el-form-item>
        <el-form-item label="状态:" :label-width="formLabelWidth">
          <el-switch
            v-model="form.status"
            active-color="#13ce66"
            inactive-color="#dcdfe6"
            :active-value="1"
            :inactive-value="2"
          >
          </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button v-if="addInfo.isAdd" type="primary" @click="add"
          >添 加</el-button
        >
        <el-button v-else type="primary" @click="update">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { getSpecsAdd, getSpecsInfo, getSpecsEdit } from "../../util/axios";
export default {
  data() {
    return {
      //定义一个规格属性数组
      arrAttr:[{
        value:''
      }],
      //表单对象
      form: {
        roleid: "", //橘色编号
        specsname: "", // 规格名称
        attrs: "", //规格属性
        status: 1, //状态1正常2禁用
      },
      //label宽度
      formLabelWidth: "120px",
      //规则验证
      rules: {
        specsname: [
          { required: true, message: "请输入规格名称", trigger: "blur" },
          { min: 2, max: 8, message: "长度在 2 到 8 个字符", trigger: "blur" },
        ],
        roleid: [
          { required: true, message: "请选择所属角色", trigger: "blur" },
        ],
      },
    };
  },
  computed: {

  },
  mounted() {

  },
  props: ["addInfo"],
  methods: {
    //添加动态表单事件
    addAttr(){
      //往数组中添加数据  最多让用户添加6个
      if(this.arrAttr.length<=6){
        this.arrAttr.push({
        value:''
      });
      }else{
        this.$message.warning('最多只能添加6项！！')
      }
    },
    //删除动态表单事件
    delAttr(item){
      var index = this.arrAttr.indexOf(item);
      if(index !==-1){
        this.arrAttr.splice(index,1);
      }
    },
    //封装重置事件
    reset() {
      this.form = {
        specsname: "", // 规格名称
        attrs: "", //规格属性
        status: 1, //状态1正常2禁用
      };
      //把循环的动态表单 清了
      this.arrAttr=[{
        value:''
      }];
      this.$refs["rules"].resetFields();
    },
    //点击取消修改父组件弹框事件
    cancel() {
      this.$emit("cancel", false);
      //调用重置
      this.reset();
    },
    //调取行动
    ...mapActions({
      getSpecsList:'specs/getSpecsAction',
      getCountAction:'specs/getCountAction'
    }),
    //编辑确定事件
    update() {
      // console.log(this.form);
        this.form.attrs=this.arrAttr.map(item=>item.value).join(',')
      //调取添加接口
      getSpecsEdit(this.form).then((res) => {
        if (res.data.code == 200) {
          this.$message.success(res.data.msg);
               //重新调取接口
          this.getSpecsList();
          //重新调取总条数
          this.getCountAction();
          //关闭弹框
          this.cancel();
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    //添加事件
    add() {
      //处理数组 加入到form中
      // let newArr=this.arrAttr.map(item=>{
      //   return item.value
      // })
      // this.form.attrs=newArr.join(',')
      // 优化后的代码
      this.form.attrs=this.arrAttr.map(item=>item.value).join(',')
      //调取添加接口
      // console.log(this.form,'表单信息');
      
      getSpecsAdd(this.form).then((res) => {
        if (res.data.code == 200) {
          this.$message.success(res.data.msg);
          //重新调取接口
          this.getSpecsList();
          //重新调取总条数
          this.getCountAction();
          //关闭弹框
          this.cancel();
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    //封装一个查看一条数据的方法
    look(id) {

      //调取查看接口
      getSpecsInfo({ id }).then((res) => {
        if (res.data.code == 200) {
          //对数据进行二次修改
          let data = res.data.list[0];
          data.attrs.map((item,index)=>{
            if(index==0){
              //如果索引是0 强制匹配第一项 因为第一项占有一个0
                this.arrAttr[0].value=item
            }else{
                this.arrAttr.push({
                  value:item
                })
            }
          })
         this.form=data
        }
      });
    },
  },
};
</script>

<style lang="" scoped>
/* 改变默认input框宽度 */
.inputW{
  width: 70%;
}
.el-button{
  margin-left: 5px;
}
</style>
