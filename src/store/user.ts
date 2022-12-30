import { defineStore } from "pinia";

export interface userInfo {
  account: string,
  token: string
}

export const useUserStore = defineStore('users', {
  state: () => {
    return {
      account: '',
      token: '',
    }
  },
  getters: {
    getToken(state) {
      return state.token
    },
    // getNameAndAge(): string {
    //   return this.name + this.getAge; // 调用其它getter
    // },
  },

  actions: {
    setUersInfo(data: userInfo) {
      this.account = data.account
      this.token = data.token
    }
  }



})