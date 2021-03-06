import {
  getUserList,
  getUserCount
} from '../../util/axios';

//state
const state = {
  userList: [],
  size: 2, //每个组件渲染的条数
  page: 1, //页码
  total: 0, //总条数
}

//getters
const getters = {
  //导出用户列表
  getUserList() {
    return state.userList;
  },
  //导出总条数
  getUserCount() {
    return state.total;
  },
  getUserSize() {
    return state.size;
  },
}

//mutations
const mutations = {
  //修改state的userlist
  REQ_USERLIST(state, payload) {
    state.userList = payload
  },
  //修改state总的total总条数
  REQ_USERCOUNT(state, payload) {
    state.total = payload
  },
  REQ_PAGE(state, payload) {
    state.page = payload
  }
}

//actions 
const actions = {
  //获取一个管理员列表的行动
  getUserAction(context) {
    //调取列表接口
    getUserList({
        size: context.state.size,
        page: context.state.page
      })
      .then(res => {
        if (res.data.code == 200) {
          // console.log(res,'相应数据');
          let data = res.data.list ? res.data.list : []
          //提交一个mutations
          context.commit('REQ_USERLIST', data);
          if (context.state.page != 1 && data.length == 0) {
            //重新调取修改页码的行动
            context.dispatch('changePageAction', context.state.page - 1)
            //重新调取列表
            context.dispatch('getUserAction')
            return
          };
        }
      })
  },
  //封装一个获取总条数事件
  getCountAction({
    commit
  }) {
    getUserCount()
      .then(res => {
        if (res.data.code == 200) {
          commit('REQ_USERCOUNT', res.data.list[0].total)
        }
      })
  },
  //封装一个修改page的action
  changePageAction(context, payload) {
    context.commit('REQ_PAGE', payload);
    //重新调取列表
    context.dispatch('getUserAction')
  }
}

export default {
  state,
  getters,
  mutations,
  actions,
  //命名空间
  namespaced: true
}
