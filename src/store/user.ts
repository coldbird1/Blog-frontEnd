import { defineStore } from "pinia";
import { router } from "@/router";

export interface userInfo {
  account: string,
  token: string,
  expires: number
}

export const useUserStore = defineStore('users', {
  state: () => {
    return {
      account: '',
      token: '',
      expires: 0,
    }
  },
  getters: {
    // getToken(state) {
    //   return state.token
    // },
    // getNameAndAge(): string {
    //   return this.name + this.getAge; // 调用其它getter
    // },
  },

  actions: {
    //保存用户信息及token
    setUersInfo(data: userInfo) {
      this.account = data.account
      this.token = data.token
      this.expires = data.expires
    },
    //登出
    logOut() {
      this.account = "";
      this.token = "";
      this.expires = 0
      router.push("/login");
    },
  },
  // 开启数据缓存
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'pinia_userInfo',//设置存储的key
        storage: localStorage,//表示存储在localStorage
      }
    ]
  }



})