<template>
  <div class="background">
    <n-card class="main">
      <n-spin :show="isLoading">
        <n-tabs
          class="card-tabs"
          default-value="signin"
          size="large"
          animated
          style="margin: 0 -4px"
          pane-style="padding-left: 4px; padding-right: 4px; box-sizing: border-box;"
        >
          <n-tab-pane name="signin" tab="登录">
            <n-form ref="formRef" :model="model" :rules="rules">
              <n-form-item label="账号" path="account">
                <n-input v-model:value="model.account" placeholder="" />
              </n-form-item>
              <n-form-item label="密码" path="password">
                <n-input type="password" v-model:value="model.password" placeholder="" @keydown.enter="login" />
              </n-form-item>
              <div style="display: flex; justify-content: center; align-items: center; position: relative">
                <n-checkbox v-model:checked="model.remember" style="position: absolute; left: 0"> 记住我 </n-checkbox>
                <n-button round type="primary" @click="login"> 登录 </n-button>
              </div>
            </n-form>
          </n-tab-pane>
          <n-tab-pane name="signup" tab="注册">
            <n-form ref="regiestFormRef" :model="regiestModel" :rules="regiestRules">
              <n-form-item label="昵称" path="userName">
                <n-input v-model:value="regiestModel.userName" @keydown.enter.prevent />
              </n-form-item>
              <n-form-item path="account" label="账号">
                <n-input v-model:value="regiestModel.account" @keydown.enter.prevent />
              </n-form-item>
              <n-form-item path="password" label="密码">
                <n-input
                  v-model:value="regiestModel.password"
                  type="password"
                  @input="handlePasswordInput"
                  @keydown.enter.prevent
                />
              </n-form-item>
              <n-form-item ref="rPasswordFormItemRef" first path="reenteredPassword" label="重复密码">
                <n-input
                  v-model:value="regiestModel.reenteredPassword"
                  :disabled="!regiestModel.password"
                  type="password"
                  @keydown.enter.prevent
                />
              </n-form-item>
            </n-form>
            <n-button type="primary" block secondary strong @click="regiestFn"> 注册 </n-button>
          </n-tab-pane>
        </n-tabs>
      </n-spin>
    </n-card>
  </div>

  <div></div>
</template>

<script lang="ts" setup>
  import { ref, reactive, defineComponent } from 'vue'
  import {
    useMessage,
    NButton,
    NCard,
    NCheckbox,
    NForm,
    NFormItem,
    NInput,
    NSpin,
    NTabPane,
    NTabs,
    FormInst,
    FormItemInst,
    FormItemRule,
    FormRules
  } from 'naive-ui'
  import { useUserStore } from '@/store/user'
  import { useRouter, useRoute } from 'vue-router'
  import { getLogin, regiestAccount } from '@/api/user'

  const router = useRouter()
  const userStore = useUserStore()

  const message = useMessage()
  const isLoading = ref(false)

  /**登陆部分 */

  interface login_info {
    code: number | null
    msg: string | null
    data: any | null
  }

  interface modelType {
    account: string | null
    password: string | null
    remember: boolean
  }

  const model = <modelType>reactive({
    account: '',
    password: '',
    remember: false
  })

  if (localStorage.getItem('ikun_userInfo')) {
    model.account = JSON.parse(localStorage.getItem('ikun_userInfo') ?? '')?.account ?? ''
    model.password = JSON.parse(localStorage.getItem('ikun_userInfo') ?? '')?.password ?? ''
    model.remember = JSON.parse(localStorage.getItem('ikun_userInfo') ?? '')?.remember ?? false
  }

  let rules = {
    account: {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入账号'
    },
    password: {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入密码'
    }
  }

  const formRef = ref<FormInst | null>()

  const login = () => {
    // e.preventDefault();

    const messageReactive = message.loading('Verifying', {
      duration: 0
    })
    console.log('model', model)

    formRef.value?.validate((errors) => {
      if (!errors) {
        isLoading.value = true

        getLogin({
          account: model.account,
          password: model.password
        })
          .then((res: login_info): void => {
            let { code, data } = res
            if (code == 200) {
              // message.success("登陆成功了呦");
              let userInfo = {
                account: data.account,
                token: data.token,
                userName: data.userName,
                expires: data.expires
              }
              //保存用户信息
              userStore.setUersInfo(userInfo)

              //账号密码保存到本地
              if (model.remember) {
                localStorage.setItem(
                  'ikun_userInfo',
                  JSON.stringify({
                    account: model.account,
                    password: model.password,
                    remember: model.remember
                  })
                )
              } else {
                localStorage.removeItem('ikun_userInfo')
              }

              router.push('/dashboard')
            } else {
              message.error('登陆失败了呦')
            }
          })
          .catch(() => {
            message.error('网络链接异常呦')
          })
          .finally(() => {
            isLoading.value = false
          })
      } else {
        message.error('信息不对，重新填奥')
        console.log('errors', errors)
      }
      messageReactive.destroy()
    })
  }

  /**注册部分 */
  interface regiestModelType {
    userName: string | null
    account: string | null
    password: string | null
    reenteredPassword: string | null
  }

  const regiestFormRef = ref<FormInst | null>(null)
  const rPasswordFormItemRef = ref<FormItemInst | null>(null)
  const regiestModel = reactive<regiestModelType>({
    userName: null,
    account: null,
    password: null,
    reenteredPassword: null
  })

  const regiestRules: FormRules = {
    account: [
      {
        required: true,
        message: '请输入账号'
      }
    ],
    password: [
      {
        required: true,
        message: '请输入新密码'
      }
    ],
    reenteredPassword: [
      {
        required: true,
        message: '请再次输入新密码',
        trigger: ['input', 'blur']
      },
      {
        validator: validatePasswordStartWith,
        message: '两次密码输入不一致',
        trigger: 'input'
      },
      {
        validator: validatePasswordSame,
        message: '两次密码输入不一致',
        trigger: ['blur', 'password-input']
      }
    ]
  }

  function validatePasswordStartWith(rule: FormItemRule, value: string): boolean {
    return (
      !!regiestModel.password && regiestModel.password.startsWith(value) && regiestModel.password.length >= value.length
    )
  }

  function validatePasswordSame(rule: FormItemRule, value: string): boolean {
    return value === regiestModel.password
  }

  const regiestFn = () => {
    regiestFormRef.value?.validate(async (errors) => {
      if (!errors) {
        let { code, msg } = await regiestAccount(regiestModel)
        if (code === 200) {
          message.success('注册成功')
          model.account = regiestModel.account
          model.password = regiestModel.password
          getLogin({ account: regiestModel.account, password: regiestModel.password })
            .then((res: login_info): void => {
              let { code, data } = res
              if (code == 200) {
                // message.success("登陆成功了呦");
                let userInfo = {
                  account: data.account,
                  token: data.token,
                  userName: data.userName,
                  expires: data.expires
                }
                //保存用户信息
                userStore.setUersInfo(userInfo)

                //账号密码保存到本地
                localStorage.setItem(
                  'ikun_userInfo',
                  JSON.stringify({
                    account: model.account,
                    password: model.password,
                    remember: model.remember
                  })
                )
                router.push('/dashboard')
              } else {
                message.error('登陆失败了呦')
              }
            })
            .catch(() => {
              message.error('网络链接异常呦')
            })
            .finally(() => {
              isLoading.value = false
            })
        } else {
          message.error('注册失败:' + msg)
        }
      } else {
        message.error('填写有误，重填！')
      }
    })
  }

  //校验
  const handlePasswordInput = () => {
    if (regiestModel.reenteredPassword) {
      rPasswordFormItemRef.value?.validate({ trigger: 'password-input' })
    }
  }
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
