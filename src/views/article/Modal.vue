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
const title = ref("");
const modalShow = computed({
  get() {
    return props.show;
  },
  set(v) {
    emit("update:show", v);
  },
});
const bodyStyle={
  width:"950px"
}
const richText=ref<InstanceType<typeof richTextEditor>>()

//分类
interface optionsType{
  value:number,
  label:string
}
let selectedValue=ref(null)
let options:optionsType[]=reactive([])


//点击取消
const cancelCallback = () => {
  close();
};
//点击提交
const submitCallback = () => {

  if (title.value==null) {
    message.warning('请输入标题')
    return false
  }

  if (selectedValue.value==null) {
    message.warning('请选择分类')
    return false
  }

  console.log(richText.value?.valueHtml);
  console.log(selectedValue.value);
    
  let data:submitData={
    title:title.value,
    categoryId:selectedValue.value,
    content:richText.value?.valueHtml
  }

  emit("submit",data)
  close()
  // if (name.value == "") {
  //   message.warning("名称不能为空");
  // } else {
  //   if (props.status == 1) {
  //     emit("submit", { name: name.value });
  //   } else {
  //     emit("submit", { name: name.value, id: props.currentRow.id });
  //   }
  // }
}

//模态框打开
const enter = async() => {

   const res=  await getList()
   const { code, data: resData } = res;
   if (code===200) {
    resData.forEach(e=>{options.push({value:e.id,label:e.name})})
    // options= resData
   }
   

  //根据打开时状态判断添加或编辑
  if (props.status == 1) {
    title.value = "";
  }
  if (props.status == 2) {
    console.log(props.currentRow);
    title.value = props.currentRow.title;
    selectedValue.value=props.currentRow.category_id
    if (richText.value) {
      richText.value.valueHtml=props.currentRow.content
    }
    
  }

};

//模态框关闭
const close = () => {
  modalShow.value=false
  selectedValue.value=null
  options.length=0
};


</script>

<template>
<div class="modal-content">
  <n-modal v-model:show="modalShow" preset="dialog" title="确认" content="你确认?" positive-text="确认"
    negative-text="算了" @positive-click="submitCallback" @negative-click="cancelCallback" @close="close"
    @after-enter="enter"  :mask-closable="false" :style="bodyStyle">
    <template #header>
      <div>{{ status==1?'新增':'编辑' }}</div>
    </template>
    <div class="head-content">    
      <div class="title">
       <span class="label">标题: </span>
       <n-input class="input-content" placeholder="请输入文章标题" v-model:value="title" ></n-input>
      </div>
      <div class="category">
        <span class="label">分类: </span>
        <n-select
          v-model:value="selectedValue"
          filterable
          placeholder="请选择文章分类"
          :options="options"
        />
      </div>
    </div>

    <richTextEditor ref="richText"></richTextEditor>
  </n-modal>
</div>

</template>


<style lang="scss" scoped>
.head-content{
  display: flex;
  margin:20px 0;
  .label{
  width: 50px;
  display: flex;
  font-size: 18px;
  align-items: center;
  margin-right: 2px;
  };
  .title{
    flex: 1;
    display: flex;
  }
  .category{
    margin-left: 3%;
    width: 30%;
    display: flex;
  }

}


</style>




