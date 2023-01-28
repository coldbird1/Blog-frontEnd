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

//提交数据
interface submitData{
  title:string,
  categoryId:number|null,
  content:string|undefined
}

const props=withDefaults(
  defineProps<{ show?: boolean, status?: (string|number),currentRow?:any }>(),{
    show:false,
    status:'1',
    currentRow:{}
  }
);
const emit = defineEmits(["close", "submit","update:show"]);

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
  <n-drawer v-model:show="modalShow" :width="502" placement="right">
    <n-drawer-content title="斯通纳">
      《斯通纳》是美国作家约翰·威廉姆斯在 1965 年出版的小说。
    </n-drawer-content>
  </n-drawer>
</div>

</template>


<style lang="scss" scoped>



</style>




