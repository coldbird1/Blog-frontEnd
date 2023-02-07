<template>
  <div class="all">
    <div class="search-content">
      <n-button type="info" @click="addFn">新增</n-button>
      <n-button type="error" @click="deleteFn" style="margin: 0 10px">删除</n-button>
    </div>
    <div class="table-container">
      <n-data-table
        :columns="columns"
        :data="data"
        :pagination="pagination"
        :row-key="rowKey"
        @update:checked-row-keys="handleCheck"
      />
    </div>

    <Modal @submit="modalSubmit" :currentRow="currentRow" :status="modalStatus" ref="modal"></Modal>
    <!-- <Detail v-model:show="detailShow" :detailData="currentRow" ref="detail"></Detail> -->
  </div>
</template>

<script setup lang="ts">
  import { DataTableColumns, DataTableRowKey, NButton, FormInst, FormItemRule, useMessage, useDialog } from 'naive-ui'
  import { ref, reactive, onMounted, h } from 'vue'
  import { useUserStore } from '@/store/user'
  import { useRouter, useRoute } from 'vue-router'
  import { getList, editItem as editPassword } from '@/api/user'
  import Modal from './Modal.vue'
  // import Detail from "./Detaile.vue"

  const router = useRouter()
  const userStore = useUserStore()
  const dialog = useDialog()
  const message = useMessage()

  type RowData = {
    id: number
    account: string
    userName: string
  }

  //文章显示编辑状态（1显示2编辑）
  const modalStatus = ref(1)

  //查看文章详情
  const detailShow = ref(false)
  //当前选中行
  let currentRow = ref<RowData>()
  const openDetailFn = (row: RowData) => {
    detailShow.value = true
    currentRow.value = row
  }

  //点击新增文章
  const addFn = async () => {
    modalStatus.value = 1
    modalShow.value = true
    console.log(modalShow.value)
  }

  //点击修改密码
  const editFn = (row: RowData) => {
    currentRow.value = row
    modal.value.open()
    console.log('编辑', row)
  }

  const createColumns = ({
    openDetail,
    edit
  }: {
    openDetail: (row: RowData) => void
    edit: (row: RowData) => void
  }): DataTableColumns<RowData> => [
    {
      type: 'selection'
      // disabled(row: RowData) {
      //   return row.name === "Edward King 3";
      // },
    },
    {
      title: '用户名',
      key: 'userName'
    },
    {
      title: '账号',
      key: 'account'
    },
    {
      title: '操作',
      key: 'actions',
      render(row) {
        return h(
          NButton,
          {
            strong: true,
            tertiary: true,
            size: 'small',
            type: 'primary',
            onClick: () => {
              console.log('edit', edit)

              edit(row)
            }
          },
          { default: () => '修改密码' }
        )
      }
    }
  ]

  let modalShow = ref(false) //模态框显隐
  let data: any = ref([]) //Table数据
  let modal = ref()

  //获取列表数据
  const getData = async () => {
    const res = await getList()
    const { code, data: resData } = res
    if (code == 200) {
      data.value = resData
      checkedRowKeys.value = []
    }
  }

  let checkedRowKeysRef = ref<DataTableRowKey[]>([])
  let columns = createColumns({
    openDetail(row: RowData) {
      openDetailFn(row)
    },
    edit(row: RowData) {
      editFn(row)
    }
  })
  let checkedRowKeys = checkedRowKeysRef
  const pagination = reactive({
    page: 1,
    pageSize: 10,
    showSizePicker: true,
    pageSizes: [
      {
        label: '10 / 页',
        value: 10
      },
      {
        label: '15 / 页',
        value: 15
      },
      {
        label: '20 / 页',
        value: 20
      }
    ],
    // suffix:'页',
    onChange: (page: number) => {
      pagination.page = page
    },
    onUpdatePageSize: (pageSize: number) => {
      pagination.pageSize = pageSize
      pagination.page = 1
    }
  })
  const rowKey = (row: RowData) => row.id
  const handleCheck = (rowKeys: DataTableRowKey[]) => {
    checkedRowKeysRef.value = rowKeys
  }

  //删除
  const deleteFn = async () => {
    if (checkedRowKeys.value.length < 1) {
      message.warning('请至少选择一条数据删除')
      return false
    }

    dialog.warning({
      title: '警告',
      content: '确认删除吗？',
      positiveText: '确定',
      negativeText: '不确定',
      onPositiveClick: async () => {
        // const { code, msg } = await deleteArticle({ ids: checkedRowKeys.value });
        // if (code === 200) {
        //   message.success("删除成功");
        //   checkedRowKeysRef.value = [];
        //   getData();
        // }
      },
      onNegativeClick: () => {}
    })
  }

  //接收Modal提交的数据,修改密码
  const modalSubmit = async (data: any) => {
    console.log('接收Modal提交的数据', data)
    const res = await editPassword(data)
    const { code, msg } = res
    if (code === 200) {
      message.success('密码修改成功')
      getData()
    }
  }

  //Mounted
  onMounted(() => {
    getData()
  })
</script>

<style lang="scss" scoped>
  .all {
    @include main-content;
    background-image: url(@/assets/img/users.png);
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
  :deep(.title-text) {
    color: #2080f0;
    &:hover {
      cursor: pointer;
    }
  }
</style>
