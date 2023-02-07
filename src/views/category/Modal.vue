<script setup lang="ts">
  import { ref, reactive, toRefs } from 'vue'
  import { FormInst, FormItemRule, useMessage } from 'naive-ui'
  import { useUserStore } from '@/store/user'
  import { useRouter, useRoute } from 'vue-router'
  import { log } from 'console'
  const router = useRouter()
  const userStore = useUserStore()
  const message = useMessage()

  const props = defineProps(['showModal', 'currentRow', 'status'])

  const emit = defineEmits(['close', 'submit'])

  const name = ref('')
  const data = props.currentRow
  const enter = () => {
    //编辑反显类型
    if (props.status == 1) {
      name.value = ''
    }
    if (props.status == 2) {
      console.log(props.currentRow)
      name.value = props.currentRow.name
    }
  }

  const cancelCallback = () => {
    close()
  }
  const submitCallback = () => {
    if (name.value == '') {
      message.warning('名称不能为空')
    } else {
      if (props.status == 1) {
        emit('submit', { name: name.value })
      } else {
        emit('submit', { name: name.value, id: props.currentRow.id })
      }
    }
  }

  const close = () => {
    emit('close')
    name.value = ''
  }
</script>

<template>
  <n-modal
    v-model:show="props.showModal"
    preset="dialog"
    title="确认"
    content="你确认?"
    positive-text="确认"
    negative-text="算了"
    @positive-click="submitCallback"
    @negative-click="cancelCallback"
    @close="close"
    @after-enter="enter"
  >
    <template #header>
      <div>{{ status == 1 ? '新增' : '修改' }}</div>
    </template>
    <div class="content">
      <span class="label">名称</span>
      <n-input
        class="input-content"
        placeholder="请输入分类名称"
        v-model:value="name"
        @keydown.enter="submitCallback"
      ></n-input>
    </div>
  </n-modal>
</template>

<style lang="scss" scoped>
  .content {
    margin: 20px 0;
    display: flex;
    .label {
      width: 60px;
      display: flex;
      text-align: center;
      align-items: center;
    }
    .input-content {
      flex: 1;
    }
  }
</style>
