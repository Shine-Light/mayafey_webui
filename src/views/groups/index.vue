<template>
  <div class="app-container">
    <GroupList v-model="groupId" @groupChange="groupChange" />

    <el-card shadow="never" v-if="groupId" v-loading="loading">
      <template #header>
        <h2>{{ groupInfo.group_name }}</h2>
      </template>

      <el-row :gutter="20" class="group-info-row">
        <el-col :span="6"> 群聊人数: {{ groupInfo.member_count }}/{{ groupInfo.max_member_count }} </el-col>
        <el-col :span="6">
          开关:
          <el-switch
            v-model="groupInfo.enable"
            :active-value="true"
            :inactive-value="false"
            @change="groupEnableChange"
          />
        </el-col>
        <el-col :span="6">
          初始化: <el-button type="primary" size="default" @click="groupInit">初始化</el-button>
        </el-col>
        <el-col :span="6">
          全员禁言
          <el-switch
            v-model="groupInfo.banWhole"
            :active-value="true"
            :inactive-value="false"
            @change="banWholeChange"
          />
        </el-col>
      </el-row>

      <el-table :data="pagesData[paginationData.currentPage - 1]" border stripe class="member-list-table">
        <el-table-column prop="user_id" label="QQ" />
        <el-table-column prop="nickname" label="昵称" />
        <el-table-column prop="role" label="权限" />
        <el-table-column prop="title" label="头衔" />
        <el-table-column label="入群时间" min-width="100px">
          <template #default="scope">
            {{ timestamp2datetime(scope.row.join_time * 1000) }}
          </template>
        </el-table-column>
        <el-table-column label="最后发言时间" min-width="100px">
          <template #default="scope">
            {{ timestamp2datetime(scope.row.last_sent_time * 1000) }}
          </template>
        </el-table-column>
        <el-table-column prop="credit" label="积分数" />
        <el-table-column prop="ban_count" label="违禁次数" />
        <el-table-column prop="sign_date_last" label="上一次签到时间" />
        <el-table-column prop="sign_count_all" label="签到总天数" />
        <el-table-column prop="sign_count_continue" label="连续签到天数" />
        <el-table-column label="操作" min-width="110px" fixed="right">
          <template #default="scope">
            <el-button :icon="Edit" type="primary" size="default" circle @click="beforeUpdateInfo(scope.$index)" />
            <el-button :icon="More" type="warning" size="default" circle @click="adminDialogOpen(scope.$index)" />
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-model:current-page="paginationData.currentPage"
        :page-size="paginationData.pageSize"
        :layout="paginationData.layout"
        :total="memberList.length"
        :background="true"
        :hide-on-single-page="true"
      />
    </el-card>

    <updateInfoDialog
      v-if="updateInfoVisible"
      v-model="updateInfoVisible"
      v-model:updateInfoDialogData="updateInfoDialogData"
      :permissions="permissions"
      @updateComfirm="updateInfoConfirm"
      @updateCancel="updateCancel"
    />

    <adminDialog v-if="adminDialogVisible" v-model="adminDialogVisible" :adminDialogData="adminDialogData" />
  </div>
</template>

<script setup>
import { ref } from "vue"
import GroupList from "@/components/GroupList/index.vue"
import {
  getGroupListApi,
  getMemberListApi,
  getPermissionsApi,
  getGroupInfoApi,
  groupEnableApi,
  groupDisableApi,
  groupInitApi,
  adminBanWholeApi,
  adminUnbanWholeApi,
  updateInfoApi
} from "@/api/groups"
import { usePagination } from "@/hooks/usePagination"
import { Edit, More } from "@element-plus/icons-vue"
import { timestamp2datetime } from "@/utils/format.js"
import { ElMessage } from "element-plus"
import updateInfoDialog from "./components/updateInfoDialog.vue"
import adminDialog from "./components/adminDialog.vue"

const loading = ref(false)
const groupList = ref([])
const getGroupList = () => {
  loading.value = true
  getGroupListApi()
    .then((res) => {
      for (const group_id in res.data) {
        const data = {}
        data.value = group_id
        data.label = `${group_id} (${res.data[group_id].member_count}/${res.data[group_id].max_member_count})`
        groupList.value.push(data)
      }
    })
    .catch(() => {
      groupList.value = []
    })
    .finally(() => {
      loading.value = false
    })
}
getGroupList()

const permissions = ref([])
const getPermissions = () => {
  loading.value = true
  getPermissionsApi()
    .then((res) => {
      for (const per in res.data) {
        permissions.value.push({
          value: per,
          label: res.data[per].name
        })
      }
    })
    .catch(() => {
      permissions.value = []
    })
    .finally(() => {
      loading.value = false
    })
}
getPermissions()

const groupId = ref("")
const groupInfo = ref({})
const getGroupInfo = () => {
  loading.value = true
  getGroupInfoApi({ group_id: groupId.value })
    .then((res) => {
      groupInfo.value = res.data
      groupInfo.value.banWhole = false
    })
    .catch(() => {
      groupInfo.value = {}
    })
    .finally(() => {
      loading.value = false
    })
}
const groupChange = () => {
  if (!groupId.value) {
    return
  }
  getGroupInfo()
  getMemberList()
}

const memberList = ref([])
const getMemberList = () => {
  loading.value = true
  getMemberListApi({ group_id: groupId.value })
    .then((res) => {
      memberList.value = res.data.members
      handlePagesData()
    })
    .catch(() => {
      memberList.value = []
    })
    .finally(() => {
      loading.value = false
    })
}

const pagesData = ref({})
const pageSize = 8
const { paginationData } = usePagination({
  layout: "total, prev, pager, next, jumper",
  pageSize
})
const handlePagesData = () => {
  const pageData = []
  for (
    let currentPage = 0;
    currentPage <= Math.floor(memberList.value.length / paginationData.pageSize);
    currentPage++
  ) {
    pageData.push(memberList.value.slice(currentPage * pageSize, (currentPage + 1) * pageSize))
  }
  pagesData.value = pageData
}

const groupEnableChange = (value) => {
  if (value) {
    groupEnableApi({ group_id: groupId.value })
      .then(() => {
        ElMessage({
          message: "操作成功",
          type: "success"
        })
      })
      .catch(() => {
        groupInfo.value.enable = !value
      })
  } else {
    groupDisableApi({ group_id: groupId.value })
      .then(() => {
        ElMessage({
          message: "操作成功",
          type: "success"
        })
      })
      .catch(() => {
        groupInfo.value.enable = !value
      })
  }
}

const groupInit = () => {
  groupInitApi({ group_id: groupId.value }).then(() => {
    ElMessage({
      message: "操作成功",
      type: "success"
    })
  })
}

const banWholeChange = (value) => {
  if (value) {
    adminBanWholeApi({ group_id: groupId.value })
      .then(() => {
        ElMessage({
          message: "操作成功",
          type: "success"
        })
      })
      .catch(() => {
        groupInfo.value.banWhole = !value
      })
  } else {
    adminUnbanWholeApi({ group_id: groupId.value })
      .then(() => {
        ElMessage({
          message: "操作成功",
          type: "success"
        })
      })
      .catch(() => {
        groupInfo.value.banWhole = !value
      })
  }
}

const updateInfoVisible = ref(false)
const updateInfoDialogData = ref({})
let updateInfoDialogDataRaw = {}
const dataIndex = ref(0)
const updateInfoDialogHidden = () => {
  updateInfoVisible.value = false
}
const updateInfoDialogOpen = () => {
  updateInfoVisible.value = true
}
const beforeUpdateInfo = (index) => {
  dataIndex.value = (paginationData.currentPage - 1) * pageSize + index
  updateInfoDialogData.value = memberList.value[dataIndex.value]
  updateInfoDialogDataRaw = JSON.parse(JSON.stringify(updateInfoDialogData.value))
  updateInfoDialogOpen()
}
const updateInfoConfirm = () => {
  loading.value = true
  const param = {
    group: {
      group_id: groupId.value
    },
    user: updateInfoDialogData.value
  }
  updateInfoApi(param)
    .then(() => {
      ElMessage({
        message: "操作成功",
        type: "success"
      })
    })
    .finally(() => {
      loading.value = false
      updateInfoDialogHidden()
    })
}
const updateCancel = () => {
  memberList.value[dataIndex.value] = updateInfoDialogDataRaw
  handlePagesData()
  updateInfoDialogHidden()
}

const adminDialogVisible = ref(false)
const adminDialogData = ref({})
const adminDialogOpen = (index) => {
  adminDialogData.value = {
    group_id: groupId.value,
    user_id: memberList.value[(paginationData.currentPage - 1) * pageSize + index].user_id
  }
  adminDialogVisible.value = true
}
</script>

<style lang="scss" scoped>
.el-card-bottom {
  margin-bottom: 20px;
  :deep(.el-card__body) {
    padding-bottom: 2px;
  }
}

.member-list-table {
  margin-bottom: 8px;
}
</style>
