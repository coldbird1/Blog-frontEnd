<script setup lang="ts">
import { ref, reactive, inject } from "vue";
import { FormInst, FormItemRule, useMessage } from "naive-ui";
import { useUserStore } from "@/store/user";
import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const axios: any = inject("axios");
const message = useMessage();

const menus = [
  { name: "文章", path: "/dashboard/article" },
  { name: "分类管理", path: "/dashboard/category" },
  { name: "用户管理", path: "/dashboard/users" },
];

const jumpTo = (path: string): void => {
  router.push(path);
};

const menuActive = (path: string): boolean => {
  return route.path.includes(path) ? true : false;
};
</script>

<template>
  <div>
    <div class="layout-top">
      <h2>我来组成头部</h2>
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
    line-height: 55px;
    text-align: center;
    width: 180px;
    height: calc(100vh - 60px);
    background-color: #fff;
    border-right: 1px solid #dadada;

    .isActived {
      background-color: #a4cab6;
      color: #fd760e;
    }

    div {
      cursor: pointer;
      &:hover {
        color: #fd760e;
      }
    }
  }

  .main-content {
    padding: 10px;
    width: calc(100vw - 180px);
  }
}
</style>



