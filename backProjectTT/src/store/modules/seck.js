//引入封装好的接口
import {getSeckList} from '../../util/axios'

//state
const state = {
    seckList:[]
}

//getters
const getters = {
    getSeckList(state){
        return state.seckList
    }
}

//mutations
const mutations = {
    REQ_SECKLIST(state,payload){
        state.seckList = payload
    }
}

//actions
const actions = {
    getSeckAction({commit}){
        getSeckList()
        .then(res=>{
            if(res.data.code==200){
                commit("REQ_SECKLIST",res.data.list)
            }
        })
        .catch(err=>{
            console.log(err,'错误响应')
        })
    }
}


//默认导出所有的内容
export default {
    state,
    getters,
    mutations,
    actions,
    //命名空间
    namespaced:true
}