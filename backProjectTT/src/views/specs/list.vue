<template>
  <div>
    <el-table :data="specsList" style="width: 100%" border>
      <el-table-column prop="id" label="规格编号" width="280">
      </el-table-column>
      <el-table-column prop="specsname" label="规格名称" width="180">
      </el-table-column>
      <el-table-column  label="规格属性" width="180">
        <template slot-scope="item">
          <div>
            <el-tag v-for="attrName in item.row.attrs" :key="attrName" type="info">{{attrName}}</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="item">
          <div>
            <el-tag v-if="item.row.status == 1" type="success">启用</el-tag>
            <el-tag v-else type="danger">禁用</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="item">
          <div>
            <el-button type="primary" size="small" @click="edit(item.row.id)"
              >编辑</el-button
            >
            <el-button type="danger" size="small" @click="del(item.row.id)"
              >删除</el-button
            >
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页视图 -->
    <el-pagination :page-size="2" background layout="prev, pager, next" :total="specsCount" @current-change='currentChange'>
    </el-pagination>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
//引入封装好的接口
import { getSpecsDelete } from "../../util/axios";
export default {
  data() {
    return {};
  },
  mounted() {
    //组件一加载触发行动
    //调取规格列表
    this.getSpecsAction();
    //调取总条数
    this.getSpecsCount();
  },
  computed: {
    ...mapGetters({
      specsList: "specs/getSpecsList",
      specsCount:'specs/getSpecsCount',
      specsSize:'specs/getSpecsSize',
    }),
  },
  methods: {
    //获取行动
    ...mapActions({
      getSpecsAction: "specs/getSpecsAction",
      getSpecsCount:"specs/getCountAction",
      changePage:'specs/changePageAction',
    }),
    //封装一个删除事件
    del(id) {
      this.$confirm("确定要删除这一条数据吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          //调取删除接口
          getSpecsDelete({ id }).then((res) => {
            if (res.data.code == 200) {
              this.$message.success(res.data.msg);
              //重新调取列表
              this.getSpecsAction();
              this.getSpecsCount();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //封装一个编辑传id事件
    edit(id) {
      this.$emit("edit", id);
    },
    //封装一个切换页码的事件
    currentChange(e){
      this.changePage(e)
    }
  },
};
</script>

<style lang="" scoped>
/* 分页样式 */
.el-pagination{
  float:right;
  margin:20px 35px 0 0 
}
</style>
