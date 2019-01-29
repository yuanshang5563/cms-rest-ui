import axios from '../axios'

/* 
 * 用户管理模块
 */

// 保存
export const saveOrEdit = (data) => {
    return axios({
        url: '/sys/coreUser/saveOrEdit',
        method: 'post',
        data
    })
}
// 删除
export const del = (params) => {
    return axios({
        url: '/sys/coreUser/delete',
        method: 'delete',
        params
    })
}
// 分页查询
export const findPage = (data) => {
    return axios({
        url: '/sys/coreUser/findPage',
        method: 'post',
        data
    })
}
// 查找用户
export const find = (params) => {
    return axios({
        url: '/sys/coreUser/find',
        method: 'get',
        params
    })
}
// 查找用户的菜单权限标识集合
export const findPermissions = (params) => {
    return axios({
        url: '/sys/coreUser/findPermissions',
        method: 'get',
        params
    })
}