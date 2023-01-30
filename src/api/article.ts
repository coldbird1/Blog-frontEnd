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

export type defaultResult = {
  /* 返回状态 */
  code: number,
  msg: string
}

/** 列表查询 */
export const getList = (params?: object) => {
  console.log('data', params);
  console.log({ params });

  return http.request<serachResult>("get", "/blog/search", { params });
};

/* 删除文章 */
export const deleteArticle = (data?: object) => {
  return http.request<defaultResult>("delete", "/blog/_token/delete", { data });
};

/* 新增文章 */
export const addArticle = (data?: object) => {
  return http.request<defaultResult>("post", "/blog/_token/add", { data });
};
/* 修改文章 */
export const editArticle = (data?: object) => {
  return http.request<defaultResult>("put", "/blog/_token/update", { data });
};