<template>
  <div>
    <el-card shadow="never" class="el-card-bottom" v-loading="loading">
      <el-form label-width="auto" :inline="true" size="default">
        <el-form-item label="群聊">
          <el-cascader :options="groupList" clearable filterable :show-all-levels="false" @change="groupChange" />
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed } from "vue"
import { getGroupListApi } from "@/api/groups"

const props = defineProps({
  modelValue: {
    type: String
  }
})
const emit = defineEmits(["update:modelValue", "groupChange"])

const groupId = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit("update:modelValue", value)
  }
})

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

const groupChange = (value) => {
  groupId.value = value ? value[0] : value
  emit("groupChange")
}
</script>

<style lang="scss" scoped>
.el-card-bottom {
  margin-bottom: 20px;
  :deep(.el-card__body) {
    padding-bottom: 2px;
  }
}
</style>
