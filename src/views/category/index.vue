
<template>
  <div class="all">
    <div class="search-content">
      <n-button type="info" @click="addFn">新增</n-button>
      <n-button type="error" @click="deleteFn" style="margin:0 10px">删除</n-button>
    </div>
    <div class="table-container">
      <n-data-table :columns="columns" :data="data" :pagination="pagination" :row-key="rowKey"
        @update:checked-row-keys="handleCheck" />
    </div>

    <Modal v-model:showModal="modalShow" :currentRow="currentRow" :status="modalStatus" @close="modalClose"
      @submit="modalSubmit"></Modal>
  </div>

</template>

<script setup lang="ts">
import type { DataTableColumns, DataTableRowKey } from "naive-ui";
import { ref, reactive, h } from "vue";
import { FormInst, FormItemRule, useMessage, NButton,useDialog } from "naive-ui";
import { useUserStore } from "@/store/user";
import { useRouter, useRoute } from "vue-router";
import { getList, deleteItem, addItem, editItem } from "@/api/category";
import Modal from "./Modal.vue";

const router = useRouter();
const userStore = useUserStore();
const message = useMessage();
const dialog= useDialog()

//table
type RowData = {
  id: number;
  name: string;
};

const createColumns = ({
  editClick,
}: {
  editClick: (row: RowData) => void;
}): DataTableColumns<RowData> => {
  return [
    {
      type: "selection",
    },
    {
      title: "编号",
      key: "id",
    },

    {
      title: "名称",
      key: "name",
    },
    {
      title: "操作",
      key: "actions",
      render(row) {
        return h(
          NButton,
          {
            strong: true,
            tertiary: true,
            size: "small",
            onClick: () => editClick(row),
          },
          { default: () => "修改" }
        );
      },
    },
  ];
};

const columns = createColumns({
  editClick(row: RowData) {
    modalEdit(row);
  },
});

let data = ref(<any>[]); //Table数据
let currentRow = {};
let  modalStatus = ref(1);

const getData = async () => {
  const res = await getList();
  const { code, data: resData } = res;
  if (code == 200) {
    data.value = resData;
    checkedRowKeys.value = [];
  }
};
getData();
// console.log(data);
let checkedRowKeysRef = ref<DataTableRowKey[]>([]);

let checkedRowKeys = checkedRowKeysRef;
const pagination = reactive({
  page: 1,
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [
    {
      label: "10 / 页",
      value: 10,
    },
    {
      label: "15 / 页",
      value: 15,
    },
    {
      label: "20 / 页",
      value: 20,
    },
  ],
  // suffix:'页',
  onChange: (page: number) => {
    pagination.page = page;
  },
  onUpdatePageSize: (pageSize: number) => {
    pagination.pageSize = pageSize;
    pagination.page = 1;
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
            const { code, msg } = await deleteItem({ ids: checkedRowKeys.value });
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

/* 搜索框 */

/* modal框 */
let modalShow = ref(false);
//打开
const addFn = () => {
  modalStatus.value = 1;
  modalShow.value = true;
};
//编辑
const modalEdit = (e: RowData) => {
  modalStatus.value = 2;
  currentRow = reactive(e);
  modalShow.value = true;
};
//关闭
const modalClose = () => {
  modalShow.value = false;
  getData();
};
//确认
const modalSubmit = async (e: object) => {
  if (modalStatus.value == 1) {
    const { code } = await addItem(e);
    if (code == 200) {
      message.success("添加成功");
      modalShow.value = false;
      getData();
    }
  } else {
    const { code } = await editItem(e);
    if (code == 200) {
      message.success("修改成功");
      modalShow.value = false;
      getData();
    }
  }
};
</script>

<style lang="scss" scoped>
.all {
  @include main-content;
  background-image: url(@/assets/img/content.jpg);
}
.search-content {
  height: 50px;
  display: flex;
  align-items: center;
}
.table-container {
  width: 100%;
  background-color: #fff;
}
:deep(.n-data-table__pagination) {
  padding: 8px;
}
</style>





