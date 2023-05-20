<template>
  <el-dialog :title="`${pluginData.plugin_name} Cd`" width="500px" v-model="visible" :destroy-on-close="true" draggable>
    <el-form :model="pluginData" :inline="false" size="default">
      <h2>Plugin Cd</h2>
      <el-form-item label="开关">
        <el-switch :model-value="pluginCdEnable" @change="pluginCdEnableChange" />
      </el-form-item>
      <el-form-item label="次数阈值">
        <el-input-number v-model="pluginCd.count" size="default" :min="0" :step="1" :controls="true" />
      </el-form-item>
      <el-form-item label="时间阈值">
        <el-input-number v-model="pluginCd.time" size="default" :min="0" :step="1" :controls="true" />
      </el-form-item>
      <el-form-item label="禁言时间">
        <el-input-number v-model="pluginCd.ban_time" size="default" :min="0" :step="1" :controls="true" />
      </el-form-item>
      <h2>Matcher Cd</h2>
      <el-button type="primary" size="default" @click="addMatcherCd" style="margin-bottom: 20px">添加Cd设置</el-button>
      <template v-if="Object.keys(pluginData.cd.matcher).length">
        <el-collapse v-model="activeNames">
          <el-collapse-item v-for="(cd, matcher) in matcherCd" :key="matcher" :title="matcher" :name="matcher">
            <template #title>
              <el-row :gutter="20">
                <el-col :span="20" :offset="0">{{ matcher }}</el-col>
                <el-col :span="4" :offset="0">
                  <el-button type="danger" size="default" circle :icon="Delete" @click="removeMatcherCd(matcher)" />
                </el-col>
              </el-row>
            </template>
            <el-form-item label="开关">
              <el-switch
                :model-value="matcherCdEnable(matcher)"
                @change="
                  (value) => {
                    matcherCdEnableChange(matcher, value)
                  }
                "
              />
            </el-form-item>
            <el-form-item label="次数阈值">
              <el-input-number v-model="cd.count" size="default" :min="0" :step="1" :controls="true" />
            </el-form-item>
            <el-form-item label="时间阈值">
              <el-input-number v-model="cd.time" size="default" :min="0" :step="1" :controls="true" />
            </el-form-item>
            <el-form-item label="禁言时间">
              <el-input-number v-model="cd.ban_time" size="default" :min="0" :step="1" :controls="true" />
            </el-form-item>
          </el-collapse-item>
        </el-collapse>
      </template>
    </el-form>
    <template #footer>
      <div>
        <el-button type="primary" size="default" @click="emit('updateCdComfirm')">确认</el-button>
        <el-button type="danger" size="default" @click="emit('updateCdCancel')">取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed } from "vue"
import { ElMessageBox } from "element-plus"
import { Delete } from "@element-plus/icons-vue"

const props = defineProps(["modelValue", "pluginData"])
const emit = defineEmits(["update:modelValue", "update:pluginData", "updateCdComfirm", "updateCdCancel"])

const cdDefault = {
  count: 5,
  time: 10,
  ban_time: 300
}
const activeNames = ref([])

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

const pluginCd = computed({
  get() {
    return pluginData.value.cd.plugin
  },
  set(value) {
    pluginData.value.cd.plugin = value
  }
})

const matcherCd = computed({
  get() {
    return pluginData.value.cd.matcher
  },
  set(value) {
    pluginData.value.cd.matcher = value
  }
})

const pluginCdEnable = computed(() => {
  return Boolean(pluginCd.value.time && pluginCd.value.count && pluginCd.value.ban_time)
})

const pluginCdEnableChange = (value) => {
  if (value) {
    pluginCd.value = cdDefault
  } else {
    pluginCd.value = {
      time: 0,
      count: 0,
      ban_time: 0
    }
  }
}

const matcherCdEnable = (matcher) => {
  return Boolean(matcherCd.value[matcher].count && matcherCd.value[matcher].time && matcherCd.value[matcher].ban_time)
}

const matcherCdEnableChange = (matcher, value) => {
  if (value) {
    matcherCd.value[matcher] = cdDefault
  } else {
    matcherCd.value[matcher] = {
      time: 0,
      count: 0,
      ban_time: 0
    }
  }
}

const addMatcherCd = () => {
  ElMessageBox.prompt("请输入 Matcher 名称", "添加Cd设置", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    inputValidator: (value) => {
      if (Object.keys(pluginData.value.cd.matcher).indexOf(value) >= 0) {
        return "Matcher已存在"
      }
    },
    draggable: true
  })
    .then(({ value }) => {
      pluginData.value.cd.matcher[value] = {
        time: 10,
        count: 10,
        ban_time: 300
      }
    })
    .catch(() => {
      return
    })
}

const removeMatcherCd = (matcher) => {
  delete pluginData.value.cd.matcher[matcher]
}
</script>

<style></style>
