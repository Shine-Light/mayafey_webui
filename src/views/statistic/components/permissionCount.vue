<template>
  <el-row :gutter="20" v-loading="loading">
    <el-col :span="6" :offset="0">
      <el-card shadow="never">
        <template #header>
          <div>
            <span>权限数量</span>
          </div>
        </template>
        <div ref="permissionCountDOM" class="permission-chart" />
      </el-card>
    </el-col>
    <el-col :span="6" :offset="2">
      <el-card shadow="never">
        <template #header>
          <div>
            <span>权限数量(不含Matcher权限)</span>
          </div>
        </template>
        <div ref="permissionCountWithoutSpecialDOM" class="permission-chart" />
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup>
import { ref, onBeforeUnmount, onMounted, computed, watch } from "vue"
import * as echarts from "echarts"
import { getPermissionsApi } from "@/api/groups"

const props = defineProps(["permissionCount", "permissionCountWithoutSpecial"])

const loading = ref(false)
const permissions = ref({})
const getPermissions = () => {
  loading.value = true
  getPermissionsApi()
    .then((res) => {
      permissions.value = res.data
    })
    .catch(() => {
      permissions.value = {}
    })
    .finally(() => {
      loading.value = false
    })
}
getPermissions()

const permissionCount = computed({
  get() {
    if (!Object.keys(permissions.value).length) {
      return
    }
    const temp = []
    for (const per in props.permissionCount) {
      temp.push({
        value: props.permissionCount[per],
        name: permissions.value[per].name
      })
    }
    return temp
  }
})
const permissionCountWithoutSpecial = computed({
  get() {
    if (!Object.keys(permissions.value).length) {
      return
    }
    const temp = []
    for (const per in props.permissionCountWithoutSpecial) {
      temp.push({
        value: props.permissionCountWithoutSpecial[per],
        name: permissions.value[per].name
      })
    }
    return temp
  }
})

const permissionCountDOM = ref("permissionCountDOM")
const permissionCountWithoutSpecialDOM = ref("permissionCountWithoutSpecialDOM")
const option = {
  tooltip: {
    trigger: "item"
  },
  legend: {
    top: "5%",
    left: "center"
  },
  series: [
    {
      name: "权限数量",
      type: "pie",
      radius: ["40%", "70%"],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: "#fff",
        borderWidth: 2
      },
      label: {
        show: false,
        position: "center"
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 40,
          fontWeight: "bold"
        }
      },
      labelLine: {
        show: false
      },
      data: []
    }
  ]
}

let permissionCountChart
const permissionCountChartRender = () => {
  permissionCountChart.setOption({
    ...option,
    series: [
      {
        name: "权限数量",
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: "#fff",
          borderWidth: 2
        },
        label: {
          show: false,
          position: "center"
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: "bold"
          }
        },
        labelLine: {
          show: false
        },
        data: permissionCount.value
      }
    ]
  })
}

let permissionCountWithoutSpecialChart
const permissionCountWithoutSpecialChartRender = () => {
  permissionCountWithoutSpecialChart.setOption({
    ...option,
    series: [
      {
        name: "权限数量",
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: "#fff",
          borderWidth: 2
        },
        label: {
          show: false,
          position: "center"
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: "bold"
          }
        },
        labelLine: {
          show: false
        },
        data: permissionCountWithoutSpecial.value
      }
    ]
  })
}

onMounted(() => {
  permissionCountChart = echarts.init(permissionCountDOM.value)
  permissionCountWithoutSpecialChart = echarts.init(permissionCountWithoutSpecialDOM.value)
})

watch(permissionCount, () => {
  permissionCountChartRender()
})

watch(permissionCountWithoutSpecial, () => {
  permissionCountWithoutSpecialChartRender()
})

onBeforeUnmount(() => {
  echarts.dispose(permissionCountDOM.value)
  echarts.dispose(permissionCountWithoutSpecialDOM.value)
})
</script>

<style lang="scss" scoped>
.permission-chart {
  width: 340px;
  height: 260px;
}
</style>
