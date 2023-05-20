<template>
  <div class="app-container">
    <el-card shadow="never" v-loading="loading">
      <template #header>
        <div>
          <span>运行状态</span>
        </div>
      </template>
      <el-row :gutter="20">
        <el-col :span="6" :offset="0">
          <el-statistic
            title="运行时间"
            :value="runtime"
            class="runtime-statistic"
            value-style="font-size: 26px"
            :formatter="runtimeFormatter"
          />
        </el-col>
        <el-col :span="6" :offset="0">
          <div ref="cpuChart" class="cpu-per-chart" />
        </el-col>
        <el-col :span="6" :offset="0">
          <div ref="memoryChart" class="cpu-per-chart" />
        </el-col>
        <el-col :span="6" :offset="0">
          <div ref="diskChart" class="cpu-per-chart" />
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup>
import * as echarts from "echarts/core"
import { GaugeChart } from "echarts/charts"
import { CanvasRenderer } from "echarts/renderers"
import { ref, onBeforeUnmount, onMounted, watch } from "vue"
import { getSystemUsageApi } from "@/api/system"

echarts.use([GaugeChart, CanvasRenderer])

const loading = ref(false)
const runtime = ref(0)
const cpuPer = ref(0)
const memoryUsage = ref({})
const diskUsage = ref([])
const getSystemUsage = () => {
  getSystemUsageApi()
    .then((res) => {
      runtime.value = parseInt(res.data.runtime)
      cpuPer.value = res.data.cpu
      memoryUsage.value = {
        total: res.data.memory[0],
        available: res.data.memory[1],
        percent: res.data.memory[2],
        used: res.data.memory[3]
      }
      diskUsage.value = {
        total: res.data.disk[0],
        used: res.data.disk[1],
        available: res.data.disk[2],
        percent: res.data.disk[3]
      }
    })
    .catch(() => {
      clearInterval(uasgeInterval)
    })
}
getSystemUsage()

const uasgeInterval = setInterval(() => {
  getSystemUsage()
}, 3000)
const runtimeInterval = setInterval(() => {
  runtime.value++
}, 1000)

const chartOption = {
  type: "gauge",
  startAngle: 180,
  endAngle: 0,
  center: ["50%", "75%"],
  radius: "90%",
  min: 0,
  max: 1,
  splitNumber: 8,
  axisLine: {
    lineStyle: {
      width: 4,
      color: [
        [0.25, "#FF6E76"],
        [0.5, "#FDDD60"],
        [0.75, "#58D9F9"],
        [1, "#7CFFB2"]
      ]
    }
  },
  pointer: {
    icon: "path://M12.8,0.7l12,40.1H0.7L12.8,0.7z",
    length: "12%",
    width: 20,
    offsetCenter: [0, "-60%"],
    itemStyle: {
      color: "inherit"
    }
  },
  axisTick: {
    length: 12,
    lineStyle: {
      color: "inherit",
      width: 2
    }
  },
  splitLine: {
    length: 20,
    lineStyle: {
      color: "inherit",
      width: 5
    }
  },
  axisLabel: {
    color: "#464646",
    fontSize: 20,
    distance: -60,
    rotate: "tangential",
    formatter: function (value) {
      if (value === 0.875) {
        return "Grade A"
      } else if (value === 0.625) {
        return "Grade B"
      } else if (value === 0.375) {
        return "Grade C"
      } else if (value === 0.125) {
        return "Grade D"
      }
      return ""
    }
  },
  title: {
    offsetCenter: [0, "-10%"],
    fontSize: 20
  },
  detail: {
    fontSize: 20,
    offsetCenter: [0, "-35%"],
    valueAnimation: true,
    color: "inherit",
    formatter: function (value) {
      return value + "%"
    }
  },
  data: [
    {
      value: 0.9,
      name: "Grade Rating"
    }
  ]
}

const cpuChart = ref(null)
const memoryChart = ref(null)
const diskChart = ref(null)
let cpuPerChart
let memoryPerChart
let diskPerChart
const cpuPerChartInit = () => {
  cpuPerChart = echarts.init(cpuChart.value)
}
const cpuPerChartChange = () => {
  cpuPerChart.setOption({
    series: [
      {
        ...chartOption,
        max: 100,
        splitNumber: 4,
        title: {
          offsetCenter: [0, "-10%"],
          fontSize: 10
        },
        axisLine: {
          lineStyle: {
            width: 5,
            color: [
              [0.25, "#7CFFB2"],
              [0.5, "#58D9F9"],
              [0.75, "#FDDD60"],
              [1, "#FF6E76"]
            ]
          }
        },
        pointer: {
          icon: "path://M12.8,0.7l12,40.1H0.7L12.8,0.7z",
          length: "8%",
          width: 15,
          offsetCenter: [0, "-60%"],
          itemStyle: {
            color: "inherit"
          }
        },
        axisLabel: {
          color: "#464646",
          fontSize: 10,
          distance: -60,
          rotate: "tangential",
          formatter: function (value) {
            if (value === 87.5) {
              return "卡顿"
            } else if (value === 62.5) {
              return "负载"
            } else if (value === 37.5) {
              return "流畅"
            } else if (value === 12.5) {
              return "空闲"
            }
            return ""
          }
        },
        data: [
          {
            value: cpuPer.value,
            name: "CPU占用率"
          }
        ]
      }
    ]
  })
}

const memoryPerChartInit = () => {
  memoryPerChart = echarts.init(memoryChart.value)
}
const memoryPerChartChange = () => {
  memoryPerChart.setOption({
    series: [
      {
        ...chartOption,
        max: 100,
        splitNumber: 4,
        title: {
          offsetCenter: [0, "-10%"],
          fontSize: 10
        },
        axisLine: {
          lineStyle: {
            width: 5,
            color: [
              [0.25, "#7CFFB2"],
              [0.5, "#58D9F9"],
              [0.75, "#FDDD60"],
              [1, "#FF6E76"]
            ]
          }
        },
        pointer: {
          icon: "path://M12.8,0.7l12,40.1H0.7L12.8,0.7z",
          length: "8%",
          width: 15,
          offsetCenter: [0, "-60%"],
          itemStyle: {
            color: "inherit"
          }
        },
        axisLabel: {
          color: "#464646",
          fontSize: 10,
          distance: -60,
          rotate: "tangential",
          formatter: function (value) {
            if (value === 87.5) {
              return "卡顿"
            } else if (value === 62.5) {
              return "负载"
            } else if (value === 37.5) {
              return "流畅"
            } else if (value === 12.5) {
              return "空闲"
            }
            return ""
          }
        },
        data: [
          {
            value: memoryUsage.value.percent,
            name: "内存占用率"
          }
        ]
      }
    ]
  })
}

const diskPerChartInit = () => {
  diskPerChart = echarts.init(diskChart.value)
}
const diskPerChartChange = () => {
  diskPerChart.setOption({
    series: [
      {
        ...chartOption,
        max: 100,
        splitNumber: 4,
        title: {
          offsetCenter: [0, "-10%"],
          fontSize: 10
        },
        axisLine: {
          lineStyle: {
            width: 5,
            color: [
              [0.25, "#7CFFB2"],
              [0.5, "#58D9F9"],
              [0.75, "#FDDD60"],
              [1, "#FF6E76"]
            ]
          }
        },
        pointer: {
          icon: "path://M12.8,0.7l12,40.1H0.7L12.8,0.7z",
          length: "8%",
          width: 15,
          offsetCenter: [0, "-60%"],
          itemStyle: {
            color: "inherit"
          }
        },
        axisLabel: {
          color: "#464646",
          fontSize: 10,
          distance: -60,
          rotate: "tangential",
          formatter: function (value) {
            if (value === 87.5) {
              return "爆满"
            } else if (value === 62.5) {
              return "拥挤"
            } else if (value === 37.5) {
              return "充足"
            } else if (value === 12.5) {
              return "崭新"
            }
            return ""
          }
        },
        data: [
          {
            value: diskUsage.value.percent,
            name: "磁盘空间"
          }
        ]
      }
    ]
  })
}

const runtimeFormatter = (value) => {
  const day = parseInt(value / 60 / 60 / 24)
  const hour = parseInt(value / 60 / 60 - 24 * day)
  const minute = parseInt(value / 60 - 60 * (hour + 24 * day))
  const second = parseInt(value - 60 * (minute + 60 * (hour + 24 * day)))
  let text = ""
  if (day) {
    text += `${day}天`
  }
  if (hour) {
    text += `${hour}时`
  }
  if (minute) {
    text += `${minute}分`
  }
  if (second) {
    text += `${second}秒`
  }
  return text
}

onBeforeUnmount(() => {
  clearInterval(uasgeInterval)
  clearInterval(runtimeInterval)
  echarts.dispose(cpuChart.value)
  echarts.dispose(memoryChart.value)
  echarts.dispose(diskChart.value)
})

onMounted(() => {
  cpuPerChartInit()
  cpuPerChartChange()
  memoryPerChartInit()
  memoryPerChartChange()
  diskPerChartInit()
  diskPerChartChange()
})

watch(cpuPer, () => {
  cpuPerChartChange()
  memoryPerChartChange()
  diskPerChartChange()
})
</script>

<style lang="scss" scoped>
.center {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.cpu-per-chart {
  width: 280px;
  height: 200px;
}

.runtime-statistic {
  text-align: center;
  width: 280px;
  height: 200px;
  line-height: 200px;
}
</style>
