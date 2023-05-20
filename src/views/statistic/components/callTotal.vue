<template>
  <el-card shadow="never" class="el-card-bottom">
    <template #header> 总调用次数 </template>
    <div ref="callTotalChartDOM" class="call-total-chart" />
  </el-card>
  <el-card shadow="never">
    <template #header>
      <el-date-picker
        v-model="month"
        type="month"
        size="normal"
        placeholder="选择月份"
        @change="getcallTotalMonthly"
        format="YYYY-MM"
        value-format="YYYY-MM"
      />
      调用次数
    </template>
    <div ref="callTotalMonthlyChartDOM" class="call-total-chart" />
  </el-card>
</template>

<script setup>
import { ref, onBeforeUnmount, onMounted, computed, watch } from "vue"
import * as echarts from "echarts"
import dayjs from "dayjs"
import { pluginsPermissionMonthlyCountApi } from "@/api/statistic"
import { getPluginsTranslateApi } from "@/api/plugins"

const props = defineProps(["callTotal", "groupId"])

const groupId = computed({
  get() {
    return props.groupId
  }
})
const callTotal = computed({
  get() {
    return props.callTotal
  }
})
const loading = ref(false)
const translate = ref({})
const getPluginsTranslate = () => {
  loading.value = true
  getPluginsTranslateApi()
    .then((res) => {
      translate.value = res.data
    })
    .catch(() => {
      translate.value = {}
    })
    .finally(() => {
      loading.value = false
    })
}
getPluginsTranslate()

const month = ref(dayjs().format("YYYY-MM"))
const callTotalMonthly = ref({})
const getcallTotalMonthly = () => {
  if (!month.value) {
    return
  }
  loading.value = true
  const param = {
    group: {
      group_id: groupId.value
    },
    data: {
      month: month.value
    }
  }
  pluginsPermissionMonthlyCountApi(param)
    .then((res) => {
      callTotalMonthly.value = res.data
    })
    .catch(() => {
      callTotalMonthly.value = {}
    })
    .finally(() => {
      loading.value = false
    })
}

const option = {
  xAxis: {
    type: "category",
    data: [],
    name: "插件",
    axisLabel: {
      interval: 0
    }
  },
  yAxis: {
    type: "value",
    name: "调用次数"
  },
  series: [
    {
      data: [],
      type: "bar",
      colorBy: "data"
    }
  ],
  dataZoom: [
    {
      // start: 0,//默认为0
      // end: 100,//默认为100
      type: "slider",
      show: true,
      // xAxisIndex: [0],
      handleSize: 0, //滑动条的 左右2个滑动条的大小
      startValue: 0, // 初始显示值
      endValue: 15, // 结束显示值
      height: 10, //组件高度
      left: "5%", //左边的距离
      right: "4%", //右边的距离
      bottom: 10, //底边的距离
      borderColor: "#000",
      fillerColor: "#269cdb",
      borderRadius: 5,
      backgroundColor: "#33384b", //两边未选中的滑动条区域的颜色
      showDataShadow: false, //是否显示数据阴影 默认auto
      showDetail: false, //即拖拽时候是否显示详细数值信息 默认true
      realtime: true, //是否实时更新
      filterMode: "filter",
      moveHandleSize: 18,
      brushSelect: false
    },
    {
      type: "inside",
      show: true,
      // xAxisIndex: [0],
      start: 1, //默认为1
      end: 100 //默认为100
    }
  ]
}

let callTotalChart
const callTotalChartRender = () => {
  const xName = []
  for (const plugin in callTotal.value) {
    xName.push(translate.value[plugin] || plugin)
  }
  callTotalChart.setOption({
    ...option,
    xAxis: {
      type: "category",
      data: xName,
      name: "调用次数",
      axisLabel: {
        interval: 0
      }
    },
    series: [
      {
        data: Object.values(callTotal.value),
        type: "bar",
        colorBy: "data"
      }
    ]
  })
}

let callTotalMonthlyChart
const callTotalMonthlyChartRender = () => {
  const xName = []
  for (const plugin in callTotalMonthly.value) {
    xName.push(translate.value[plugin] || plugin)
  }
  callTotalMonthlyChart.setOption({
    ...option,
    xAxis: {
      type: "category",
      data: xName,
      name: "调用次数",
      axisLabel: {
        interval: 0
      }
    },
    series: [
      {
        data: Object.values(callTotalMonthly.value),
        type: "bar",
        colorBy: "data"
      }
    ]
  })
}

const callTotalChartDOM = ref()
const callTotalMonthlyChartDOM = ref()
onMounted(() => {
  callTotalChart = echarts.init(callTotalChartDOM.value)
  callTotalChartRender()
  callTotalMonthlyChart = echarts.init(callTotalMonthlyChartDOM.value)
  callTotalMonthlyChartRender()
})

watch(callTotal, () => {
  callTotalChartRender()
})

watch(callTotalMonthly, () => {
  callTotalMonthlyChartRender()
})

onBeforeUnmount(() => {
  echarts.dispose(callTotalChartDOM.value)
  echarts.dispose(callTotalMonthlyChartDOM.value)
})
</script>

<style lang="scss" scoped>
.call-total-chart {
  width: 1500px;
  height: 400px;
}

.el-card-bottom {
  margin-bottom: 20px;
}
</style>
