
<template>
  <div class="all">
    <div class="top-content">
      <div class="operate-content">
        <n-button type="info" @click="addFn">新增</n-button>
        <n-button type="error" @click="deleteFn">删除</n-button>
      </div>
      <div class="search-content">
        <div class="category">
          <span class="label">分类: </span>
          <n-select
            :consistent-menu-width="false" 
            class="select-content"
            v-model:value="searchObj.category_id"
            filterable
            placeholder="分类"
            :options="categoryOptions"
            @update:value="categoryChange()"
          />
        </div>
      <n-input 
      class="keyword-content"
      v-model:value="searchObj.keyword"  
      placeholder="输入关键字搜索" 
      clearable 
      @keydown.enter="searchFn"
      @clear="clearFn"
      ></n-input>
      <n-button type="primary" @click="searchFn">搜索</n-button>
      </div>
    </div>
    <div class="table-container">
      <n-data-table 
      max-height="700px" 
      min-height="700px" 
      :columns="columns" 
      :data="data" 
      :pagination="pagination" 
      remote :row-key="rowKey"
      @update:checked-row-keys="handleCheck" 
      @update:sorter="handleSorterChange"
      />
    </div>
    
    <Modal v-model:show="modalShow" @submit="modalSubmit" :currentRow="currentRow" :status="modalStatus" ></Modal>
    <Detail v-model:show="detailShow" :detailData="currentRow" ref="detail"></Detail>
  </div>

</template>
 
<script setup lang="ts">
import { DataTableColumns, DataTableRowKey, NButton,FormInst, FormItemRule, useMessage,useDialog} from "naive-ui";
import { ref, reactive,onMounted,h,inject} from "vue";
import { useUserStore } from "@/store/user";
import { useRouter, useRoute } from "vue-router";
import { getList, deleteArticle,addArticle,editArticle } from "@/api/article";
import { getList as getCategoryList,optionsType } from "@/api/category";

import Modal from "./Modal.vue"
import Detail from "./Detaile.vue"
import { random } from "lodash";

const router = useRouter();
const userStore = useUserStore();
const dialog=useDialog()
const message = useMessage();
const dayJs:any=inject('dayJs')

type RowData = {
  id: number;
  author?: string;
  title: string;
  content: string | null;
  category_id:number,
  category_name:string,
  create_time:string
};

type searchType={
  keyword?:string,
  category_id?:number,
  columnKey?:string,
  order?:string|boolean
}

//文章显示编辑状态（1显示2编辑）
const modalStatus = ref(1);

//搜索部分
const searchObj:searchType=reactive({keyword:'',category_id:0})
const searchFn=()=>{
  getData()
}
const clearFn=()=>{
  searchObj.keyword=''
  getData()
}

//分类列表
 const categoryOptions=ref<{value:number,label:string}[]>([])
 //获取数据
 const getOptionsFn=async()=>{
  const res= await getCategoryList()
   const { code, data: resData } = res;
   console.log(resData);
   
   if (code===200) {
    let list=resData.map(e=>{return {value:e.id,label:e.name}})
    list.unshift({value:0,label:'全部'})
    categoryOptions.value=list
   }
 }

 const categoryChange=()=>{
  getData()
 }


//查看文章详情
const detailShow=ref(false)
let currentRow=ref()

const openDetailFn=(row:RowData)=>{
  detailShow.value=true
  currentRow.value=row
}

//点击新增文章
const addFn=async()=>{
  modalStatus.value=1
  modalShow.value=true
  console.log(modalShow.value);
}

//点击编辑文章
const editFn=(row:RowData)=>{
  modalStatus.value=2
  currentRow.value=row
  modalShow.value=true
  console.log('编辑',row);
}

const createColumns = ({openDetail,edit}:
{openDetail:(row:RowData)=>void,
 edit:(row:RowData)=>void,
}):
 DataTableColumns<RowData> => [
  {
    type: "selection",
    // disabled(row: RowData) {
    //   return row.name === "Edward King 3";
    // },
  },
  {
    title: "标题",
    key: "title",
    render (row) {
        return h(
          'span',
          {
            class:'title-text',
            onClick: () => openDetail(row)
          },
          [
            row.title
            // dayJs(row.create_time).unix()
          ]
        )
    }
  },
  {
    title: "作者",
    key: "author",
  },
  {
    title: "类别",
    key: "category_name",
  },
  {
    title: "创建时间",
    key: "create_time",
    sorter: (rowA, rowB) => dayJs(rowA.create_time).unix()-dayJs(rowB.create_time).unix()
  },
  {
    title: "操作",
    key: "actions",
    render (row) {
        return h(
          NButton,
          {
            strong: true,
            tertiary: true,
            size: "small",
            onClick: () => edit(row)
          },
          { default: () => "编辑" }
        )
    }
  },
];

let modalShow=ref(false) //模态框显隐
let data:any = ref([]); //Table数据

//获取列表数据
const getData = async () => {
  let {page,pageSize}=pagination
  let searchData={page,pageSize,...searchObj}
  const res = await getList(searchData);
  const { code, data: resData,count } = res;
  if (code == 200) {
    data.value = resData;
    pagination.pageSize=pageSize
    pagination.itemCount=count

    checkedRowKeys.value = [];
    console.log(data.value.length);
    console.log(pagination.pageSize);
  }
};

//排序
const handleSorterChange=(sorter:any)=>{
console.log('sorter',sorter);
if (sorter.order) {
  searchObj.order=sorter.order=='descend'?'DESC':'ASC'
  searchObj.columnKey=sorter.columnKey
}else{
  searchObj.order=''
  searchObj.columnKey=''
}
getData()
}

let checkedRowKeysRef = ref<DataTableRowKey[]>([]);
let columns = createColumns({ openDetail(row: RowData) {openDetailFn(row)},edit(row: RowData) {editFn(row)},});
let checkedRowKeys = checkedRowKeysRef;
const pagination = reactive({
  page: 1,
  pageSize: 15,
  itemCount:1,
  showSizePicker: true,
  pageSizes: [
    // {
    //   label: "10 / 页",
    //   value: 10,
    // },
    {
      label: "15 / 页",
      value: 15,
    },
    {
      label: "20 / 页",
      value: 20,
    },
  ],
  prefix ({ itemCount }:{itemCount:any}) {
    return `共 ${itemCount} 条`
  },
  onChange: (page: number) => {
    pagination.page = page;
    getData()
  },
  onUpdatePageSize: (pageSize: number) => {
    console.log('onUpdatePageSize');
    pagination.pageSize = pageSize;
    pagination.page = 1;
    getData()
  },
});
const rowKey = (row: RowData) => row.id;
const handleCheck = (rowKeys: DataTableRowKey[]) => {
  checkedRowKeysRef.value = rowKeys;
};


//删除
const deleteFn = async () => {

if (checkedRowKeys.value.length<1) {
  message.warning('请至少选择一条数据删除')
  return false
}

  dialog.warning({
          title: '警告',
          content: '确认删除吗？',
          positiveText: '确定',
          negativeText: '不确定',
          onPositiveClick: async() => {
            const { code, msg } = await deleteArticle({ ids: checkedRowKeys.value });
            if (code === 200) {
              message.success("删除成功");
              checkedRowKeysRef.value = [];
              getData();
            }
          },
          onNegativeClick: () => {
            
          }
  })
};


//接收Modal提交的数据,新增文章
const modalSubmit=async(data:any)=>{
  console.log("接收Modal提交的数据",  data);

if (modalStatus.value===1) {
  let submitData={
   title:data.title,
   content:data.content,
   category_id:data.categoryId,
   author:userStore.userName
  }
  const res=await addArticle(submitData)
  const {code,msg}=res
  if (code===200) {
    message.success('添加成功')
    getData()
  }
}else{
  let submitData={
   title:data.title,
   content:data.content,
   category_id:data.categoryId,
   author:userStore.userName,
   id:currentRow.value.id
  }
  const res=await editArticle(submitData)
  const {code,msg}=res
  if (code===200) {
    message.success('编辑成功')
    getData()
  }
}
}

//Mounted
onMounted(()=>{
  getData()
  getOptionsFn()
})
</script>

<style lang="scss" scoped>
.all {
  @include main-content;
  background-image: url(@/assets/img/article.jpg);
}
.top-content {
  position: relative;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .operate-content{
  display: flex;
  justify-content: space-between;
  width: 122px;
  }
  
  .search-content{
    display: flex;
    margin-right: 0;
    &>*{
      margin-left: 10px;
    };
    .category{
     display: flex;width: 140px;
     .label{width: 30%;display: flex;align-items: center;color: #fff;};
     .select-content{
      flex:1
      }
    }
    .keyword-content{
      width: 200px;
    }
}

}

.table-container {
  width: 100%;
  background-color: #fff;
}
:deep(.n-data-table__pagination) {
  padding: 8px;
}
:deep(.title-text){
  color:#2080f0;
  &:hover{
    cursor: pointer;
  }
}
</style>



