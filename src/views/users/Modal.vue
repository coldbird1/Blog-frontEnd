<script setup lang="ts">
  import { ref, reactive, toRefs } from 'vue'
  import { FormInst, FormItemRule, useMessage, FormRules, FormItemInst } from 'naive-ui'
  import { useUserStore } from '@/store/user'
  import { useRouter, useRoute } from 'vue-router'
  import { log } from 'console'
  const router = useRouter()
  const userStore = useUserStore()
  const message = useMessage()

  interface ModelType {
    password: string | null
    reenteredPassword: string | null
  }

  const props = defineProps(['showModal', 'currentRow', 'status'])
  const emit = defineEmits(['close', 'submit'])

  const formRef = ref<FormInst | null>(null)
  const rPasswordFormItemRef = ref<FormItemInst | null>(null)
  const model = reactive<ModelType>({ password: null, reenteredPassword: null })
  const modalShow = ref(false)

  const rules: FormRules = {
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
    return !!model.password && model.password.startsWith(value) && model.password.length >= value.length
  }

  function validatePasswordSame(rule: FormItemRule, value: string): boolean {
    return value === model.password
  }

  //组件打开
  const open = () => {
    model.password = ''
    model.reenteredPassword = ''
    modalShow.value = true
    console.log(props)
  }

  const submitCallback = async () => {
    await formRef.value?.validate((errors) => {
      if (!errors) {
        console.log(props.currentRow.id)

        emit('submit', { password: model.password, id: props.currentRow.id })
      } else {
        message.error('验证失败')
        return false
      }
    })
  }

  //校验
  const handlePasswordInput = () => {
    if (model.reenteredPassword) {
      rPasswordFormItemRef.value?.validate({ trigger: 'password-input' })
    }
  }

  //暴露属性给父组件
  defineExpose({ open })
</script>

<template>
  <n-modal
    v-model:show="modalShow"
    preset="dialog"
    title="确认"
    content="你确认?"
    positive-text="确认"
    negative-text="算了"
    @positive-click="submitCallback"
  >
    <template #header>
      <div>修改密码</div>
    </template>
    <div class="content">
      <n-form ref="formRef" :model="model" :rules="rules">
        <n-form-item path="password" label="密码">
          <n-input v-model:value="model.password" type="password" @input="handlePasswordInput" @keydown.enter.prevent />
        </n-form-item>
        <n-form-item ref="rPasswordFormItemRef" first path="reenteredPassword" label="重复密码">
          <n-input
            v-model:value="model.reenteredPassword"
            :disabled="!model.password"
            type="password"
            @keydown.enter.prevent
          />
        </n-form-item>
      </n-form>
    </div>
  </n-modal>
</template>

<style lang="scss" scoped>
  .content {
    margin: 20px 0;
  }
</style>
