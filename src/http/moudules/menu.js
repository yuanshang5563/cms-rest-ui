import axios from '../axios'

/* 
 * 菜单管理模块
 */

 // 保存
export const saveOrEdit = (data) => {
    return axios({
        url: '/sys/coreMenu/saveOrEdit',
        method: 'post',
        data
    })
}
// 删除
export const del = (params) => {
    return axios({
        url: '/sys/coreMenu/delete',
        method: 'delete',
        params
    })
}
// 查找导航菜单树
export const findNavTree = (params) => {
    return axios({
        url: '/sys/coreMenu/findNavTree',
        method: 'get',
        params
    })
}
// 查找导航菜单树
export const findCoreMenuTree = (params) => {
    return axios({
        url: '/sys/coreMenu/findCoreMenuTree',
        method: 'get',
        params
    })
}

// 查找导航菜单树
export const find = (params) => {
    return axios({
        url: '/sys/coreMenu/find',
        method: 'get',
        params
    })
}