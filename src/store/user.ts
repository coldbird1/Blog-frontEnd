import { defineStore } from 'pinia'
import { store } from '@/store'
import { router, resetRouter } from '@/router'

export interface userInfo {
  account: string
  token: string
  userName: string
  expires: number
}

export const useUserStore = defineStore('users', {
  state: () => {
    return {
      account: '',
      token: '',
      userName: '',
      expires: 0
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
      this.userName = data.userName
      this.expires = data.expires
    },
    //登出
    logOut() {
      this.account = ''
      this.token = ''
      this.userName = ''
      this.expires = 0
      router.push('/login')
      // resetRouter()
    }
  },
  // 开启数据缓存
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'pinia_userInfo', //设置存储的key
        storage: localStorage //表示存储在localStorage
      }
    ]
  }
})

export function useUserStoreHook() {
  return useUserStore(store)
}
