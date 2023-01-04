import { http } from "@/utils/http";


export type serachResult = {
  /* 返回状态 */
  code: number,
  /* 返回信息 */
  msg: string,
  /* 页码 */
  page: number,
  /* 每页的长度 */
  pageSize: number
  /* 总页数 */
  count: number,
  data: listArr[]
}

export type listArr = {
  /* 文章id */
  id: number,
  /* 文章标题 */
  title: number,
  /* 内容 */
  content: string,
  /* 作者*/
  author: string,
  /* 类别id */
  category_id: number,
  /* 类别名称 */
  category_name: string
}

/** 列表查询 */
export const getList = (data?: object) => {
  return http.request<serachResult>("get", "/blog/search", { data });
};
