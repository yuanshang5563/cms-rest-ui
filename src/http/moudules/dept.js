import axios from '../axios'

/* 
 * 机构管理模块
 */

// 保存
export const saveOrEdit = (params) => {
    return axios({
        url: '/sys/coreDept/saveOrEdit',
        method: 'post',
        params
    })
}
// 删除
export const del = (params) => {
    return axios({
        url: '/sys/coreDept/delete',
        method: 'delete',
        params
    })
}
// 查询机构
export const find = (params) => {
    return axios({
        url: '/sys/coreDept/find',
        method: 'get',
        params
    })
}
// 查询机构树
export const findDeptTree = (params) => {
    return axios({
        url: '/sys/coreDept/findTree',
        method: 'get',
        params
    })
}