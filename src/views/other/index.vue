<template>
  <div class="app-container">
    <el-card shadow="never">
      <h1>WebUI 版本</h1>
      <h3>当前版本: {{ webuiVersionCurrent }}</h3>
      <h3>最新版本: {{ webuiVersionLastest }}</h3>
      <h1>Bot 版本</h1>
      <h3>当前版本: {{ botVersionCurrent }}</h3>
      <h3>最新版本: {{ botVersionLastest }}</h3>
      <el-tooltip content="已是最新版本" :disabled="botIsUpdate" placement="top" effect="dark">
        <span>
          <el-button type="primary" size="default" :disabled="!botIsUpdate" @click="handleUpdateBot">更新Bot</el-button>
        </span>
      </el-tooltip>
      <h1>项目地址</h1>
      <h3>
        WebUI:
        <el-link href="https://github.com/Shine-Light/mayafey_webui" target="_blank"
          >https://github.com/Shine-Light/mayafey_webui</el-link
        >
      </h3>
      <h3>
        Bot:
        <el-link href="https://github.com/Shine-Light/Nonebot_Bot_MayaFey" target="_blank"
          >https://github.com/Shine-Light/Nonebot_Bot_MayaFey</el-link
        >
      </h3>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { checkWebUIUpdate, checkBotUpdate, updateBot } from "@/api/other"
import { version } from "@/../package.json"
import { ElMessage, ElMessageBox } from "element-plus"

const loading = ref(false)
const botVersionCurrent = ref("")
const botVersionLastest = ref("")
const botIsUpdate = ref(false)
const getBotVersion = () => {
  loading.value = true
  checkBotUpdate()
    .then((res) => {
      botVersionCurrent.value = res.data.current
      botVersionLastest.value = res.data.lastest
      botIsUpdate.value = res.data.update
    })
    .catch(() => {
      botVersionCurrent.value = ""
      botVersionLastest.value = ""
      botIsUpdate.value = false
    })
    .finally(() => {
      loading.value = false
    })
}
getBotVersion()

const webuiVersionCurrent = ref(version)
const webuiVersionLastest = ref("")
const webuiIsUpdate = ref(false)
const getWebUIVerison = () => {
  loading.value = true
  checkWebUIUpdate()
    .then((res) => {
      webuiVersionLastest.value = res.data.version
      webuiIsUpdate.value = webuiVersionCurrent.value !== webuiVersionLastest.value
    })
    .catch(() => {
      webuiVersionLastest.value = ""
      webuiIsUpdate.value = false
    })
    .finally(() => {
      loading.value = false
    })
}
getWebUIVerison()

const handleUpdateBot = () => {
  ElMessageBox.confirm("请确保相邻一个版本,否则更新大概率失败且Bot可能损坏,是否确认更新?", "确认更新", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {
      updateBot().then(() => {
        ElMessage({
          type: "success",
          message: "Bot正在更新中, 更新结果请查看控制台"
        })
      })
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "更新已取消"
      })
    })
}
</script>

<style lang="scss" scoped>
.el-link {
  font-size: 18px;
}
</style>
