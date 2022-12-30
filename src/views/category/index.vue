<script setup lang="ts">
import { ref, reactive, inject } from "vue";
import { FormInst, FormItemRule, useMessage } from "naive-ui";
import { useUserStore } from "@/store/user";
import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const userStore = useUserStore();
const axios: any = inject("axios");
const message = useMessage();
</script>

<template>
  <div class="main-plane">分类</div>
</template>

<style lang="scss" scoped>
</style>



