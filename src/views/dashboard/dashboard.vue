<script setup lang="ts">
  import { ref, reactive } from 'vue'
  import { FormInst, FormItemRule, useMessage } from 'naive-ui'
  import { useUserStore } from '@/store/user'
  import { useRouter, useRoute } from 'vue-router'
  const router = useRouter()
  const route = useRoute()
  const userStore = useUserStore()
  const message = useMessage()

  const menus = [
    { name: '文章', path: '/dashboard/article' },
    { name: '分类管理', path: '/dashboard/category' },
    { name: '用户管理', path: '/dashboard/users' }
  ]

  const jumpTo = (path: string): void => {
    router.push(path)
  }

  const menuActive = (path: string): boolean => {
    return route.path.includes(path) ? true : false
  }
</script>

<template>
  <div>
    <div class="layout-top" style="position: relative">
      <h2>我来组成头部</h2>
      <n-button type="error" style="position: absolute; right: 10px" @click="userStore.logOut()">退出</n-button>
    </div>
    <div class="layout-body">
      <div class="menus">
        <div v-for="(i, x) in menus" @click="jumpTo(i.path)" :class="{ isActived: menuActive(i.path) }">
          {{ i.name }}
        </div>
      </div>
      <div class="main-content">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .layout-top {
    height: 60px;
    background-color: #fff;
    color: #1772b4;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid #f6f6f6;
    box-sizing: border-box;
    box-shadow: 0 5px 10px -5px rgba(0, 0, 0, 0.3);
    z-index: 1;
    position: relative;
  }
  .layout-body {
    background-color: rgb(248, 248, 248);
    display: flex;
    color: #64676a;
    // max-width: 1500px;
    margin: 0 auto;

    .menus {
      padding: 0;
      box-sizing: border-box;
      font-weight: 600;
      font-size: 16px;
      line-height: 55px;
      text-align: center;
      width: 180px;
      height: calc(100vh - 60px);
      background-color: #fff;
      border-right: 1px solid #dadada;
      color: rgb(27, 42, 96);
      .isActived {
        color: #fff;
        background-color: rgb(73, 93, 184) !important;
      }
      div {
        cursor: pointer;
        &:hover {
          background-color: rgb(243, 243, 245);
        }
      }
    }

    .main-content {
      width: calc(100vw - 180px);
    }
  }
</style>
