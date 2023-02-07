import { http } from '@/utils/http'

export type listResult = {
  /* 返回状态 */
  code: number
  /**  返回信息 */
  msg: string
  /* 返回数据 */
  data: optionsType[]
}

export interface optionsType {
  id: number
  name: string
}

export type commonResult = {
  /* 返回状态 */
  code: number
  /**  返回信息 */
  msg: string
}

/** 列表查询 */
export const getList = (data?: object) => {
  return http.request<listResult>('get', '/category/list', { data })
}
/* 新增 */
export const addItem = (data?: object) => {
  return http.request<commonResult>('post', '/category/_token/add', { data })
}
/* 修改 */
export const editItem = (data?: object) => {
  return http.request<commonResult>('put', '/category/_token/update', { data })
}
/** 删除 */
export const deleteItem = (data?: object) => {
  return http.request<commonResult>('delete', '/category/_token/delete', { data })
}
