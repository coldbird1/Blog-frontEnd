
<template>

  <div class="background">
    <n-card title="欢迎您" class="main">
      <n-spin :show="isLoading">
        <n-form ref="formRef" :model="model" :rules="rules">
          <n-form-item label="账号" path="account">
            <n-input v-model:value="model.account" placeholder="" />
          </n-form-item>
          <n-form-item label="密码" path="password">
            <n-input type="password" v-model:value="model.password" placeholder="" @keydown.enter="login" />
          </n-form-item>
          <div style="
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
          ">
            <n-checkbox v-model:checked="model.remember" style="position: absolute; left: 0">
              记住我
            </n-checkbox>
            <n-button round type="primary" @click="login"> 登录 </n-button>
          </div>
        </n-form>
      </n-spin>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, inject } from "vue";
import { FormInst, FormItemRule, useMessage } from "naive-ui";
import { useUserStore } from "@/store/user";
import { useRouter, useRoute } from "vue-router";
import { getLogin } from "@/api/user";

const router = useRouter();
const userStore = useUserStore();
const axios: any = inject("axios");
const message = useMessage();
let isLoading = ref(false);

interface login_info {
  code: number;
  msg: string;
  data: any;
}

const model = reactive({
  account: "",
  password: "",
  remember: false,
});

if (localStorage.getItem("ikun_userInfo")) {
  model.account =
    JSON.parse(localStorage.getItem("ikun_userInfo") ?? "")?.account ?? "";
  model.password =
    JSON.parse(localStorage.getItem("ikun_userInfo") ?? "")?.password ?? "";
  model.remember =
    JSON.parse(localStorage.getItem("ikun_userInfo") ?? "")?.remember ?? false;
}

let rules = {
  account: {
    required: true,
    trigger: ["blur", "input"],
    message: "请输入账号",
  },
  password: {
    required: true,
    trigger: ["blur", "input"],
    message: "请输入密码",
  },
};

const formRef = ref<FormInst | null>();

const login = (e: MouseEvent) => {
  e.preventDefault();

  const messageReactive = message.loading("Verifying", {
    duration: 0,
  });

  formRef.value?.validate((errors) => {
    if (!errors) {
      isLoading.value = true;

      getLogin({
        account: model.account,
        password: model.password,
      })
        .then((res: login_info): void => {
          let { code, data } = res;
          if (code == 200) {
            // message.success("登陆成功了呦");
            let userInfo = {
              account: data.account,
              token: data.token,
              expires: data.expires,
            };
            //保存用户信息
            userStore.setUersInfo(userInfo);

            //账号密码保存到本地
            if (model.remember) {
              localStorage.setItem(
                "ikun_userInfo",
                JSON.stringify({
                  account: model.account,
                  password: model.password,
                  remember: model.remember,
                })
              );
            } else {
              localStorage.removeItem("ikun_userInfo");
            }

            router.push("/dashboard");
          } else {
            message.error("登陆失败了呦");
          }
        })
        .catch(() => {
          message.error("网络链接异常呦");
        })
        .finally(() => {
          isLoading.value = false;
        });
    } else {
      message.error("信息不对，重新填奥");
      console.log("errors", errors);
    }
    messageReactive.destroy();
  });
};
</script>

<style scoped>
.background {
  width: 100%;
  min-height: 100vh;
  background-image: url(@/assets/img/background.jpg);
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  overflow: hidden;
  position: relative;
}
.main {
  width: 500px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  opacity: 0.9;
  border-radius: 10px;
}
</style>



