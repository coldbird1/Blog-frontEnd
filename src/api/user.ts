import { http } from "@/utils/http";


export type UserResult = {
  code: number,
  msg: string,
  data: {
    /* 用户id */
    id: number,
    /* 用户账号 */
    account: string,
    /* token*/
    token: string,
    /* 过期时间 */
    expires: number,
    /* 用户名称 */
    name: string
  }
}

// export type RefreshTokenResult = {
//   success: boolean;
//   data: {
//     /** `token` */
//     accessToken: string;
//     /** 用于调用刷新`accessToken`的接口时所需的`token` */
//     refreshToken: string;
//     /** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
//     expires: Date;
//   };
// };

/** 登录 */
export const getLogin = (data?: object) => {
  return http.request<UserResult>("post", "/admin/login", { data });
};

// /** 刷新token */
// export const refreshTokenApi = (data?: object) => {
//   return http.request<RefreshTokenResult>("post", "/refreshToken", { data });
// };
