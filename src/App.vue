<script lang="ts" setup>
import { h } from "vue"
import { useTheme } from "@/hooks/useTheme"
import { ElNotification } from "element-plus"
import zhCn from "element-plus/lib/locale/lang/zh-cn"
import { checkWebUIUpdate } from "@/api/other"
import { IGetCheckWebUIUpdateData } from "@/api/other/types/other"
import { version } from "@/../package.json"
import { notifyData } from "@/components/Notify/data"

const { initTheme } = useTheme()

/** 初始化主题 */
initTheme()
/** 将 Element Plus 的语言设置为中文 */
const locale = zhCn

ElNotification({
  title: "Hello",
  message: h(
    "a",
    { style: "color: teal", target: "_blank", href: "https://github.com/Shine-Light/Nonebot_Bot_MayaFey" },
    "小项目获取 star 不易，如果你喜欢这个项目的话，欢迎点击这里支持一个 star ！这是作者持续维护的唯一动力（小声：毕竟是免费的）"
  ),
  duration: 0,
  position: "bottom-right"
})

checkWebUIUpdate().then((res: IGetCheckWebUIUpdateData) => {
  if (res.data.version !== version) {
    notifyData.push({
      avatar: "src/assets/layout/logo.png",
      title: "检测到新版本!",
      datetime: "刚刚",
      description: `WebUI有新版本了,快去更新吧!最新版本: ${res.data.version}`
    })
  }
})
</script>

<template>
  <ElConfigProvider :locale="locale">
    <router-view />
  </ElConfigProvider>
</template>
