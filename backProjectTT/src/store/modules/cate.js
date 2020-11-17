//引入封装好的接口
import {getCateList} from '../../util/axios'

//state
const state = {
    cateList:[]
}

//getters
const getters = {
    getCateList(state){
        return state.cateList
    }
}

//mutations
const mutations = {
    REQ_CATELIST(state,payload){
        state.cateList = payload
    }
}

//actions
const actions = {
    getCateListAction({commit}){
        getCateList({
            istree:true
        })
        .then(res=>{
            if(res.data.code==200){
                commit("REQ_CATELIST",res.data.list)
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