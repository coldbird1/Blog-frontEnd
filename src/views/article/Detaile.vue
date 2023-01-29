<script setup lang="ts">
import { ref, reactive, toRefs,watch,computed } from "vue";
import { FormInst, FormItemRule, useMessage } from "naive-ui";
import { useUserStore } from "@/store/user";
import { useRouter, useRoute } from "vue-router";
import richTextEditor from "@/components/richTextEditor.vue"
import { getList } from "@/api/category";
import { Interface } from "readline";
const router = useRouter();
const userStore = useUserStore();
const message = useMessage();


const props=withDefaults(
  defineProps<{ show: boolean,detailData:any }>(),{
    show:false,
    detailData:{}
  }
);
const emit = defineEmits(["close","update:show"]);

const modalShow = computed({
  get() {    
    return props.show;
  },
  set(v) {
    emit("update:show", v);
  },
});


</script>

<template>
<div class="modal-content">
  <n-drawer v-model:show="modalShow" :width="950" placement="right" >
    <n-drawer-content title="文章详情" >
      <div>
        <h2 class="title">{{ props.detailData.title }}</h2>
        <div v-html="props.detailData.content" class="content"></div>
      </div>
    </n-drawer-content>
  </n-drawer>
</div>

</template>


<style lang="scss" scoped>
.title{
  text-align: center;
}
.content{
  margin: 10px 0;
 :deep(img){
  max-width: 100% ;
  }
}

</style>




