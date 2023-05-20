<template>
  <el-dialog
    title="修改用户数据"
    width="30%"
    v-model="visible"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :destroy-on-close="true"
    draggable
  >
    <el-form :model="data" :inline="false" size="default">
      <el-form-item label="权限">
        <el-cascader
          :options="permissions"
          v-model="data.role"
          filterable
          :show-all-levels="false"
          @change="roleChange"
        />
      </el-form-item>
      <el-form-item label="积分">
        <el-input-number v-model="data.credit" size="default" :min="0" :step="1" :controls="true" />
      </el-form-item>
      <el-form-item label="违禁次数">
        <el-input-number v-model="data.ban_count" size="default" :min="0" :step="1" :controls="true" />
      </el-form-item>
      <el-form-item label="签到次数">
        <el-input-number v-model="data.sign_count_all" size="default" :min="0" :step="1" :controls="true" />
      </el-form-item>
      <el-form-item label="连续签到次数">
        <el-input-number v-model="data.sign_count_continue" size="default" :min="0" :step="1" :controls="true" />
      </el-form-item>
      <el-form-item label="上一次签到时间" size="default">
        <el-date-picker
          v-model="data.sign_date_last"
          type="date"
          size="default"
          placeholder="选择日期时间"
          editable
          :clearable="false"
          value-format="YYYY-MM-DD"
          :disabled-date="datePickerChecker"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div>
        <el-button type="primary" size="default" @click="emit('updateComfirm')">确认</el-button>
        <el-button type="danger" size="default" @click="emit('updateCancel')">取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed, ref } from "vue"

const props = defineProps(["modelValue", "updateInfoDialogData", "permissions"])
const emit = defineEmits(["update:modelValue", "update:updateInfoDialogData", "updateComfirm", "updateCancel"])
const permissions = computed({
  get() {
    return roleDisabledHandle(props.permissions)
  }
})
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
    return props.updateInfoDialogData
  },
  set(value) {
    emit("update:updateInfoDialogData", value)
  }
})
const roleChange = (newRole, _) => {
  data.value.role = newRole[0]
}
const roleDisabled = ["Van", "owner", "admin"]
const roleDisabledHandle = (permissions) => {
  const newPermissions = []
  permissions.forEach((permission) => {
    newPermissions.push({
      ...permission,
      disabled: roleDisabled.indexOf(permission.value) >= 0
    })
  })
  return newPermissions
}
const datePickerChecker = (date) => {
  return date.getTime() > Date.now()
}
</script>

<style></style>
