<template>
  <div class="app-container">
    <GroupList v-model="groupId" @groupChange="getPluginList" />

    <el-card shadow="never" v-if="groupId" v-loading="loading">
      <el-table :data="pagesData[paginationData.currentPage - 1]" border stripe class="plugin-list-table">
        <el-table-column prop="plugin_name" label="插件" />
        <el-table-column prop="translate" label="插件名" />
        <el-table-column prop="description" label="描述" />
        <el-table-column prop="enable" label="开关">
          <template #default="scope">
            <el-switch
              v-model="scope.row.enable"
              :active-value="true"
              :inactive-value="false"
              :disabled="scope.row.enable === null || scope.row.unset"
              @change="enableChange(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="generate_type" label="配置类型" />
        <el-table-column prop="unset" label="不可设置">
          <template #default="scope">
            <el-switch v-model="scope.row.unset" :active-value="true" :inactive-value="false" disabled />
          </template>
        </el-table-column>
        <el-table-column prop="total_unable" label="不统计">
          <template #default="scope">
            <el-switch
              v-model="scope.row.total_unable"
              :active-value="true"
              :inactive-value="false"
              @change="totalDisableChange(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="version" label="版本" />
        <el-table-column prop="author" label="作者" />
        <el-table-column prop="" label="权限">
          <template #default="scope">
            <el-button type="primary" size="default" @click="pluginPermissionDialogOpen(scope.row, scope.$index)"
              >查看详情</el-button
            >
          </template>
        </el-table-column>
        <el-table-column prop="cd" label="cd">
          <template #default="scope">
            <el-button type="primary" size="default" @click="pluginCdDiaologOpen(scope.row, scope.$index)"
              >查看详情</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-model:current-page="paginationData.currentPage"
        v-model:page-size="paginationData.pageSize"
        :layout="paginationData.layout"
        :total="pluginList.length"
        :background="true"
        :hide-on-single-page="true"
      />
    </el-card>

    <pluginPermissionDialog
      v-if="pluginPermissionDiaologVisible"
      v-model="pluginPermissionDiaologVisible"
      v-model:pluginData="pluginData"
      :permissions="permissions"
      @updatePermissionComfirm="updatePermissionComfirm"
      @updatePermissionCancel="updatePermissionCancel"
    />

    <pluginCdDialog
      v-if="pluginCdDiaologVisible"
      v-model="pluginCdDiaologVisible"
      v-model:pluginData="pluginData"
      @updateCdComfirm="updateCdComfirm"
      @updateCdCancel="updateCdCancel"
    />
  </div>
</template>

<script setup>
import { ref } from "vue"
import GroupList from "@/components/GroupList/index.vue"
import { getPermissionsApi } from "@/api/groups"
import {
  getPluginListApi,
  pluginEnableApi,
  pluginDisableApi,
  pluginTotalEnableApi,
  pluginTotalDisableApi,
  pluginPermissionUpdateApi,
  pluginCdUpdateApi
} from "@/api/plugins"
import { usePagination } from "@/hooks/usePagination"
import { ElMessage } from "element-plus"
import pluginPermissionDialog from "./components/pluginPermissionDialog.vue"
import pluginCdDialog from "./components/pluginCdDialog.vue"

const loading = ref(false)

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

const pluginList = ref({})
const getPluginList = () => {
  if (!groupId.value) {
    return
  }
  loading.value = true
  getPluginListApi({ group_id: groupId.value })
    .then((res) => {
      pluginList.value = res.data.plugin_list
      handlePagesData()
    })
    .catch(() => {
      pluginList.value = []
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
    currentPage <= Math.floor(pluginList.value.length / paginationData.pageSize);
    currentPage++
  ) {
    pageData.push(pluginList.value.slice(currentPage * pageSize, (currentPage + 1) * pageSize))
  }
  pagesData.value = pageData
}

const enableChange = (plugin) => {
  if (!plugin) {
    return
  }
  const param = {
    group: {
      group_id: groupId.value
    },
    plugin: {
      plugin_name: plugin.plugin_name
    }
  }
  if (plugin.enable) {
    pluginEnableApi(param)
      .then(() => {
        ElMessage({
          message: "操作成功",
          type: "success"
        })
      })
      .catch(() => {
        plugin.enable = !plugin.enable
      })
  } else {
    pluginDisableApi(param)
      .then(() => {
        ElMessage({
          message: "操作成功",
          type: "success"
        })
      })
      .catch(() => {
        plugin.enable = !plugin.enable
      })
  }
}

const totalDisableChange = (plugin) => {
  if (!plugin) {
    return
  }
  const param = {
    group: {
      group_id: groupId.value
    },
    plugin: {
      plugin_name: plugin.plugin_name
    }
  }
  if (plugin.total_unable) {
    pluginTotalEnableApi(param)
      .then(() => {
        ElMessage({
          message: "操作成功",
          type: "success"
        })
      })
      .catch(() => {
        plugin.total_unable = !plugin.total_unable
      })
  } else {
    pluginTotalDisableApi(param)
      .then(() => {
        ElMessage({
          message: "操作成功",
          type: "success"
        })
      })
      .catch(() => {
        plugin.total_unable = !plugin.total_unable
      })
  }
}

const pluginData = ref({})
let pluginDataRaw = {}
const dataIndex = ref(0)
const pluginPermissionDiaologVisible = ref(false)
const pluginPermissionDialogOpen = (plugin, index) => {
  dataIndex.value = (paginationData.currentPage - 1) * pageSize + index
  pluginData.value = plugin
  pluginDataRaw = JSON.parse(JSON.stringify(pluginData.value))
  pluginPermissionDiaologVisible.value = true
}
const updatePermissionComfirm = () => {
  const param = {
    group: {
      group_id: groupId.value
    },
    plugin: {
      plugin_name: pluginData.value.plugin_name,
      permission: {
        permission_common: pluginData.value.permission_common,
        permission_special: pluginData.value.permission_special
      }
    }
  }
  pluginPermissionUpdateApi(param)
    .then(() => {
      ElMessage({
        message: "操作成功",
        type: "success"
      })
    })
    .finally(() => {
      pluginPermissionDiaologVisible.value = false
    })
}
const updatePermissionCancel = () => {
  pluginList.value[dataIndex.value] = pluginDataRaw
  handlePagesData()
  pluginPermissionDiaologVisible.value = false
}

const pluginCdDiaologVisible = ref(false)
const pluginCdDiaologOpen = (plugin, index) => {
  dataIndex.value = (paginationData.currentPage - 1) * pageSize + index
  pluginData.value = plugin
  pluginDataRaw = JSON.parse(JSON.stringify(pluginData.value))
  pluginCdDiaologVisible.value = true
}
const updateCdComfirm = () => {
  const param = {
    group: {
      group_id: groupId.value
    },
    plugin: {
      plugin_name: pluginData.value.plugin_name,
      cd: pluginData.value.cd
    }
  }
  pluginCdUpdateApi(param)
    .then(() => {
      ElMessage({
        message: "操作成功",
        type: "success"
      })
    })
    .finally(() => {
      pluginCdDiaologVisible.value = false
    })
}
const updateCdCancel = () => {
  pluginList.value[dataIndex.value] = pluginDataRaw
  handlePagesData()
  pluginCdDiaologVisible.value = false
}
</script>

<style lang="scss" scoped>
.plugin-list-table {
  margin-bottom: 8px;
}
</style>
