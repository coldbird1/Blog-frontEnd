
<template>
  <div class="search-content">
    <n-button type="error" @click="deleteFn">删除</n-button>
  </div>
  <div class="table-container">
    <n-data-table :columns="columns" :data="data" :pagination="pagination" :row-key="rowKey"
      @update:checked-row-keys="handleCheck" />
  </div>

</template>

<script setup lang="ts">
import type { DataTableColumns, DataTableRowKey } from "naive-ui";
import { ref, reactive, inject } from "vue";
import { FormInst, FormItemRule, useMessage } from "naive-ui";
import { useUserStore } from "@/store/user";
import { useRouter, useRoute } from "vue-router";
import { getList } from "@/api/article";

const router = useRouter();
const userStore = useUserStore();
const axios: any = inject("axios");
const message = useMessage();

type RowData = {
  id: number;
  author?: string;
  title: string;
  content: string | null;
};

const createColumns = (): DataTableColumns<RowData> => [
  {
    type: "selection",
    // disabled(row: RowData) {
    //   return row.name === "Edward King 3";
    // },
  },
  {
    title: "标题",
    key: "title",
  },
  {
    title: "类别",
    key: "category_name",
  },
  {
    title: "修改时间",
    key: "create_time",
  },
];

let data = reactive(<any>[]); //Table数据

const getData = async () => {
  const res = await getList();
  const { code, data: resData } = res;
  if (code == 200) {
    data.push(...resData);
  }
};

getData();
// console.log(data);

const checkedRowKeysRef = ref<DataTableRowKey[]>([]);
const columns = createColumns();
const checkedRowKeys = checkedRowKeysRef;
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
const deleteFn = () => {
  console.log(checkedRowKeys.value);
  checkedRowKeys.value.forEach(async (e) => {
    const { code, msg } = await axios.put("/blog/_token/delete", { id: e });
    if (code === 200) {
      message.success("删除成功");
    }
  });
};
</script>

<style lang="scss" scoped>
.search-content {
  height: 50px;
}
.table-container {
  width: 100%;
  background-color: #fff;
}
:deep(.n-data-table__pagination) {
  padding: 8px;
}
</style>



