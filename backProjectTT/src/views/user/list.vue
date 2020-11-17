<template>
  <div>
    <el-table :data="userList" style="width: 100%" border>
      <el-table-column prop="uid" label="用户编号" width="280">
      </el-table-column>
      <el-table-column prop="username" label="用户名称" width="180">
      </el-table-column>
      <el-table-column prop="rolename" label="所属角色" width="180">
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
            <el-button type="primary" size="small" @click="edit(item.row.uid)"
              >编辑</el-button
            >
            <el-button type="danger" size="small" @click="del(item.row.uid)"
              >删除</el-button
            >
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页视图 -->
    <el-pagination :page-size="2" background layout="prev, pager, next" :total="userCount" @current-change='currentChange'>
    </el-pagination>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
//引入封装好的接口
import { getUserDelete } from "../../util/axios";
export default {
  data() {
    return {};
  },
  mounted() {
    //组件一加载触发行动
    //调取用户列表
    this.getUserAction();
    //调取总条数
    this.getUserCount();
  },
  computed: {
    ...mapGetters({
      userList: "user/getUserList",
      userCount:'user/getUserCount',
      userSize:'user/getUserSize',
    }),
  },
  methods: {
    //获取行动
    ...mapActions({
      getUserAction: "user/getUserAction",
      getUserCount:"user/getCountAction",
      changePage:'user/changePageAction',
    }),
    //封装一个删除事件
    del(uid) {
      this.$confirm("确定要删除这一条数据吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          //调取删除接口
          getUserDelete({ uid }).then((res) => {
            if (res.data.code == 200) {
              this.$message.success(res.data.msg);
              //重新调取列表
              this.getUserAction();
              this.getUserCount();
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
