<script setup lang="ts">
import type { DataTableColumns, DataTableRowKey } from "naive-ui";
import { ref, reactive, inject } from "vue";
import { FormInst, FormItemRule, useMessage } from "naive-ui";
import { useUserStore } from "@/store/user";
import { useRouter, useRoute } from "vue-router";
import { log } from "console";
const router = useRouter();
const userStore = useUserStore();
const axios: any = inject("axios");
const message = useMessage();

type RowData = {
  key: number;
  name: string;
  age: string;
  address: string;
};

type resData = {
  code: number;
  data: Array<any>;
  msg: string;
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
    key: "name",
  },
  {
    title: "类别",
    key: "age",
  },
  {
    title: "修改时间",
    key: "address",
  },
];

let data = reactive(<any>[]); //Table数据

const getData = async () => {
  const res = await axios.get("/blog/list", {});
  const { code, data: resData } = res.data;
  if (code == 200) {
    data.push(...resData);
  }
};

getData();
console.log(data);

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
const rowKey = (row: RowData) => row.address;
const handleCheck = (rowKeys: DataTableRowKey[]) => {
  checkedRowKeysRef.value = rowKeys;
};
</script>

<template>
  <div class="search-content">
    搜索
  </div>
  <div class="table-container">
    <n-data-table :columns="columns" :data="data" :pagination="pagination" :row-key="rowKey"
      @update:checked-row-keys="handleCheck" />
  </div>

</template>

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



