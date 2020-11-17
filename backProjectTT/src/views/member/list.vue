<template>
  <div>
    <el-table
      :data="memberList"
      style="width: 100%"
      border
    >
      <el-table-column prop="id" label="用户编号" width="180">
      </el-table-column>
      <el-table-column prop="nickname" label="昵称" width="180">
      </el-table-column>
      <el-table-column prop="phone" label="手机号" width="180">
      </el-table-column>
      <el-table-column label="状态"> 
                  <template slot-scope="item">
          <div>
            <el-tag v-if="item.row.status==1" type="success">启用</el-tag>
            <el-tag v-else type="danger">禁用</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="item">
          <div>
            <el-button type="primary" size="small" @click='edit(item.row.uid)'>编辑</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {mapActions,mapGetters} from 'vuex';
export default {
  data() {
    return {
       
    };
  },
  mounted() {
      //组件一加载触发行动
      this.getMemberAction()
  },
  computed: {
      ...mapGetters({
          memberList:'member/getMemberList'
      })
  },
  methods: {
      //获取行动
      ...mapActions({
          getMemberAction:'member/getMemberAction'
      }),
      //封装一个编辑传id事件
      edit(uid){
          this.$emit('edit',uid)
      }
  },
};
</script>

<style lang="" scoped>
</style>
