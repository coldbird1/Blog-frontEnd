<template>
  <n-result status="404" title="404 资源不存在" description="生活总归带点荒谬" class="main">
    <template #footer>
      <n-button @click="clickFn">找点乐子吧</n-button>
    </template>
  </n-result>
</template>

<script setup lang="ts">
  const clickFn = () => {
    window.open('https://www.bilibili.com/')
  }
</script>

<style lang="scss" scoped>
  .main {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
</style>
