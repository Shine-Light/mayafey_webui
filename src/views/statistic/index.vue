<template>
  <div class="app-container">
    <GroupList v-model="groupId" @groupChange="groupChange" />

    <el-card shadow="never" v-if="groupId" class="el-card-bottom">
      <template #header> 权限统计 </template>
      <permissionCountChart
        :permissionCount="permissionCount"
        :permissionCountWithoutSpecial="permissionCountWithoutSpecial"
      />
    </el-card>

    <el-card shadow="never" v-if="groupId">
      <template #header> 调用统计 </template>
      <callTotalChart :groupId="groupId" :callTotal="callTotal" />
    </el-card>
  </div>
</template>

<script setup>
import * as echarts from "echarts/core"
import GroupList from "@/components/GroupList/index.vue"
import { ref } from "vue"
import { getGroupListApi } from "@/api/groups"
import {
  pluginsPermissionCountApi,
  pluginsPermissionCountWithoutSpecialApi,
  pluginsCallTotalApi
} from "@/api/statistic"
import permissionCountChart from "./components/permissionCount.vue"
import callTotalChart from "./components/callTotal.vue"

const loading = ref(false)
const groupId = ref("")
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

const permissionCount = ref({})
const getPermissionCount = () => {
  loading.value = true
  pluginsPermissionCountApi({ group_id: groupId.value })
    .then((res) => {
      permissionCount.value = res.data
    })
    .catch(() => {
      permissionCount.value = {}
    })
    .finally(() => {
      loading.value = false
    })
}

const permissionCountWithoutSpecial = ref({})
const getpermissionCountWithoutSpecial = () => {
  loading.value = true
  pluginsPermissionCountWithoutSpecialApi({ group_id: groupId.value })
    .then((res) => {
      permissionCountWithoutSpecial.value = res.data
    })
    .catch(() => {
      permissionCountWithoutSpecial.value = {}
    })
    .finally(() => {
      loading.value = false
    })
}

const callTotal = ref({})
const getcallTotal = () => {
  loading.value = true
  pluginsCallTotalApi({ group_id: groupId.value })
    .then((res) => {
      callTotal.value = res.data
    })
    .catch(() => {
      callTotal.value = {}
    })
    .finally(() => {
      loading.value = false
    })
}

const groupChange = () => {
  if (!groupId.value) {
    return
  }
  getPermissionCount()
  getpermissionCountWithoutSpecial()
  getcallTotal()
}
</script>

<style lang="scss" scoped>
.el-card-bottom {
  margin-bottom: 20px;
}
</style>
