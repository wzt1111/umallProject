//引入角色接口
import {getMemberList} from '../../util/axios'

//state
const state = {
    memberList:[]
}
//getters
const getters = {
    //导出角色
    getMemberList(){
        return state.memberList
    }
}

//mutations
const mutations = {
    //修改state的memberList
    REQ_MEMBERLIST(state,payload){
        state.memberList = payload
    }
}

//actions
const actions = {
    //封装一个获取角色列表的行动
    getMemberAction({commit}){
        //调取列表接口
        getMemberList()
        .then(res=>{
            if(res.data.code==200){
                //提交一个mutations
                console.log(res)
                commit('REQ_MEMBERLIST',res.data.list)
            }
        })
    }
}

//导出
export default {
    state,
    getters,
    mutations,
    actions,
    //命名空间
    namespaced:true
}