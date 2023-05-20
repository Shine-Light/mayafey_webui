<template>
  <el-dialog
    :title="`${pluginData.plugin_name} 权限`"
    width="500px"
    v-model="visible"
    :destroy-on-close="true"
    draggable
  >
    <el-form :model="pluginData" :inline="false" size="default">
      <h2>Plugin 级别权限</h2>
      <el-form-item label="权限">
        <el-cascader
          :options="permissions"
          v-model="pluginData.permission_common"
          filterable
          :show-all-levels="false"
          @change="perCommonChange"
        />
      </el-form-item>
      <h2>Matcher 级别权限</h2>
      <el-button type="primary" size="default" @click="addSpecialPer" style="margin-bottom: 20px"
        >添加权限设置</el-button
      >
      <template v-for="(per, matcher) in pluginData.permission_special" :key="matcher">
        <el-form-item :label="matcher">
          <el-row :gutter="20">
            <el-col :span="20" :offset="0">
              <el-cascader
                :options="permissions"
                v-model="pluginData.permission_special[matcher]"
                filterable
                :show-all-levels="false"
                @change="perSpecialChange(pluginData.permission_special[matcher], matcher)"
              />
            </el-col>
            <el-col :span="4" :offset="0">
              <el-button type="danger" size="default" :icon="Delete" circle @click="removeSpecialPer(matcher)" />
            </el-col>
          </el-row>
        </el-form-item>
      </template>
    </el-form>
    <template #footer>
      <div>
        <el-button type="primary" size="default" @click="emit('updatePermissionComfirm')">确认</el-button>
        <el-button type="danger" size="default" @click="emit('updatePermissionCancel')">取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed } from "vue"
import { ElMessageBox } from "element-plus"
import { Delete } from "@element-plus/icons-vue"

const props = defineProps(["modelValue", "pluginData", "permissions"])
const emit = defineEmits([
  "update:modelValue",
  "update:pluginData",
  "updatePermissionComfirm",
  "updatePermissionCancel"
])

const permissions = computed({
  get() {
    return props.permissions
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

const pluginData = computed({
  get() {
    return props.pluginData
  },
  set(value) {
    emit("update:pluginData", value)
  }
})

const perCommonChange = (newRole) => {
  console.log(newRole)
  pluginData.value.permission_common = newRole[0]
}

const perSpecialChange = (newRole, matcher) => {
  pluginData.value.permission_special[matcher] = newRole[0]
}

const addSpecialPer = () => {
  ElMessageBox.prompt("请输入 Matcher 名称", "添加权限设置", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    inputValidator: (value) => {
      if (Object.keys(pluginData.value.permission_special).indexOf(value) >= 0) {
        return "Matcher已存在"
      }
    },
    draggable: true
  })
    .then(({ value }) => {
      pluginData.value.permission_special[value] = "member"
    })
    .catch(() => {
      return
    })
}

const removeSpecialPer = (matcher) => {
  delete pluginData.value.permission_special[matcher]
}
</script>

<style></style>
