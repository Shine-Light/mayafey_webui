<template>
  <el-dialog title="群管" width="500px" v-model="visible" :destroy-on-close="true" draggable>
    <h2>管理员操作:</h2>
    <el-row :gutter="20">
      <el-col :span="6" :offset="0">
        <el-tooltip content="无操作权限" placement="top" effect="dark" :disabled="!adminActionDisable">
          <span>
            <el-button type="primary" size="default" @click="banPanel" :loading="loading" :disabled="adminActionDisable"
              >禁言</el-button
            >
          </span>
        </el-tooltip>
      </el-col>
      <el-col :span="6" :offset="0">
        <el-tooltip content="无操作权限" placement="top" effect="dark" :disabled="!adminActionDisable">
          <span>
            <el-button
              type="primary"
              size="default"
              @click="unbanPanel"
              :loading="loading"
              :disabled="adminActionDisable"
            >
              解除禁言</el-button
            >
          </span>
        </el-tooltip>
      </el-col>
      <el-col :span="6" :offset="0">
        <el-tooltip content="无操作权限" placement="top" effect="dark" :disabled="!adminActionDisable">
          <span>
            <el-button
              type="primary"
              size="default"
              @click="kickPanel"
              :loading="loading"
              :disabled="adminActionDisable"
              >踢出</el-button
            >
          </span>
        </el-tooltip>
      </el-col>
      <el-col :span="6" :offset="0">
        <el-tooltip content="无操作权限" placement="top" effect="dark" :disabled="!adminActionDisable">
          <span>
            <el-button
              type="primary"
              size="default"
              @click="kickBlockPanel"
              :loading="loading"
              :disabled="adminActionDisable"
              >踢出并拉黑</el-button
            >
          </span>
        </el-tooltip>
      </el-col>
    </el-row>
    <h2>群主操作:</h2>
    <el-row :gutter="20">
      <el-col :span="6" :offset="0">
        <el-tooltip content="无操作权限" placement="top" effect="dark" :disabled="!ownerActionDisable">
          <span>
            <el-button
              type="primary"
              size="default"
              @click="titleSetPanel"
              :loading="loading"
              :disabled="adminActionDisable"
              >设置头衔</el-button
            >
          </span>
        </el-tooltip>
      </el-col>
      <el-col :span="6" :offset="0">
        <el-tooltip content="无操作权限" placement="top" effect="dark" :disabled="!ownerActionDisable">
          <span>
            <el-button
              type="primary"
              size="default"
              @click="titleUnsetPanel"
              :loading="loading"
              :disabled="adminActionDisable"
              >取消头衔</el-button
            >
          </span>
        </el-tooltip>
      </el-col>
      <el-col :span="6" :offset="0">
        <el-tooltip content="无操作权限" placement="top" effect="dark" :disabled="!ownerActionDisable">
          <span>
            <el-button
              type="primary"
              size="default"
              @click="adminAdminSetPanel"
              :loading="loading"
              :disabled="adminActionDisable"
              >设置管理员</el-button
            >
          </span>
        </el-tooltip>
      </el-col>
      <el-col :span="6" :offset="0">
        <el-tooltip content="无操作权限" placement="top" effect="dark" :disabled="!ownerActionDisable">
          <span>
            <el-button
              type="primary"
              size="default"
              @click="adminAdminUnsetPanel"
              :loading="loading"
              :disabled="adminActionDisable"
              >取消管理员</el-button
            >
          </span>
        </el-tooltip>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script setup>
import { computed, ref } from "vue"
import { ElMessage, ElMessageBox } from "element-plus"
import {
  groupMemberBotApi,
  adminBanApi,
  adminUnbanApi,
  adminKickApi,
  adminKickBlockApi,
  adminTitleSetApi,
  adminTitleUnsetApi,
  adminAdminSetApi,
  adminAdminUnsetApi
} from "@/api/groups"

const props = defineProps(["modelValue", "adminDialogData"])
const emit = defineEmits(["update:modelValue"])
const visible = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit("update:modelValue", value)
  }
})
const data = computed({
  get() {
    return props.adminDialogData
  }
})
const group_id = computed({
  get() {
    return data.value.group_id
  }
})
const user_id = computed({
  get() {
    return data.value.user_id
  }
})
const adminActionDisable = ref(true)
const ownerActionDisable = ref(true)
const loading = ref(false)
const botRoleCheck = () => {
  loading.value = true
  let botRole = ""
  groupMemberBotApi({ group_id: group_id.value })
    .then((res) => {
      if (res.data.user_id === user_id.value) {
        return
      }
      botRole = res.data.role
      if (botRole === "owner") {
        ownerActionDisable.value = false
        adminActionDisable.value = false
      } else if (botRole === "admin") {
        adminActionDisable.value = false
      }
    })
    .finally(() => {
      loading.value = false
    })
}
botRoleCheck()

const banPanel = () => {
  ElMessageBox.prompt("输入禁言时间", "禁言", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    draggable: true,
    inputValidator: (value) => {
      if (!/^\d+$/.test(value)) {
        return "请输入整数!"
      }
      value = parseInt(value)
      if (value < 0) {
        return "不能为负数!"
      } else if (value >= 31 * 24 * 60 * 60) {
        return "时间过长"
      } else {
        return true
      }
    },
    inputErrorMessage: "无效数字"
  })
    .then(({ value }) => {
      const param = {
        group: {
          group_id: group_id.value
        },
        data: {
          users: user_id.value,
          time: value
        }
      }
      adminBanApi(param).then(() => {
        ElMessage({
          message: "操作成功!",
          type: "success"
        })
      })
    })
    .catch(() => {
      return
    })
}

const unbanPanel = () => {
  ElMessageBox.confirm("是否确认解除禁言?", "解除禁言", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    draggable: true
  })
    .then(() => {
      const param = {
        group: {
          group_id: group_id.value
        },
        data: {
          users: user_id.value
        }
      }
      adminUnbanApi(param).then(() => {
        ElMessage({
          message: "操作成功!",
          type: "success"
        })
      })
    })
    .catch(() => {
      return
    })
}

const kickPanel = () => {
  ElMessageBox.confirm("是否确认踢出成员?", "踢出", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    draggable: true
  })
    .then(() => {
      const param = {
        group: {
          group_id: group_id.value
        },
        data: {
          users: user_id.value
        }
      }
      adminKickApi(param).then(() => {
        ElMessage({
          message: "操作成功!",
          type: "success"
        })
      })
    })
    .catch(() => {
      return
    })
}

const kickBlockPanel = () => {
  ElMessageBox.confirm("是否确认踢出并拉黑?", "踢出并拉黑", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    draggable: true
  })
    .then(() => {
      const param = {
        group: {
          group_id: group_id.value
        },
        data: {
          users: user_id.value
        }
      }
      adminKickBlockApi(param).then(() => {
        ElMessage({
          message: "操作成功!",
          type: "success"
        })
      })
    })
    .catch(() => {
      return
    })
}

const titleSetPanel = () => {
  ElMessageBox.prompt("输入头衔名称", "设置头衔", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    draggable: true,
    inputValidator: (value) => {
      if (value.length >= 0 && value.length <= 10) {
        return true
      } else {
        return false
      }
    },
    inputErrorMessage: "头衔过长"
  })
    .then(({ value }) => {
      const param = {
        group: {
          group_id: group_id.value
        },
        data: {
          users: user_id.value,
          title: value
        }
      }
      adminTitleSetApi(param).then(() => {
        ElMessage({
          message: "操作成功!",
          type: "success"
        })
      })
    })
    .catch(() => {
      return
    })
}

const titleUnsetPanel = () => {
  ElMessageBox.confirm("是否确认取消头衔?", "取消头衔", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    draggable: true
  })
    .then(() => {
      const param = {
        group: {
          group_id: group_id.value
        },
        data: {
          users: user_id.value
        }
      }
      adminTitleUnsetApi(param).then(() => {
        ElMessage({
          message: "操作成功!",
          type: "success"
        })
      })
    })
    .catch(() => {
      return
    })
}

const adminAdminSetPanel = () => {
  ElMessageBox.confirm("是否确认将用户设置为管理员?", "设置管理员", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    draggable: true
  })
    .then(() => {
      const param = {
        group: {
          group_id: group_id.value
        },
        data: {
          users: user_id.value
        }
      }
      adminAdminSetApi(param).then(() => {
        ElMessage({
          message: "操作成功!",
          type: "success"
        })
      })
    })
    .catch(() => {
      return
    })
}

const adminAdminUnsetPanel = () => {
  ElMessageBox.confirm("是否确认取消管理员?", "取消管理员", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    draggable: true
  })
    .then(() => {
      const param = {
        group: {
          group_id: group_id.value
        },
        data: {
          users: user_id.value
        }
      }
      adminAdminUnsetApi(param).then(() => {
        ElMessage({
          message: "操作成功!",
          type: "success"
        })
      })
    })
    .catch(() => {
      return
    })
}
</script>

<style></style>
