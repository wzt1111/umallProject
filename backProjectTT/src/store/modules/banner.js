//引入封装好的接口
import {getBannerList} from '../../util/axios'

//state
const state = {
    bannerList:[]
}

//getters
const getters = {
    getBannerList(state){
        return state.bannerList
    }
}

//mutations
const mutations = {
    REQ_BANNERLIST(state,payload){
        state.bannerList = payload
    }
}

//actions
const actions = {
    getBannerListAction({commit}){
        getBannerList({
            istree:true
        })
        .then(res=>{
            if(res.data.code==200){
                commit("REQ_BANNERLIST",res.data.list)
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