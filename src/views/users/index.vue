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
  <div class="all"></div>
</template>

<style lang="scss" scoped>
.all {
  @include main-content;
  background-image: url(@/assets/img/users.png);
}
</style>



