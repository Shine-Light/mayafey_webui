import { request } from "@/utils/service"
import type * as Statistic from "./types/statistic"

// pluginsPermissionCountApi
export function pluginsPermissionCountApi(data: Statistic.ICreateGroupRequestData) {
  return request({
    url: "statistics/plugins_permission_count",
    method: "post",
    data
  })
}

// pluginsPermissionCountWithoutSpecialApi
export function pluginsPermissionCountWithoutSpecialApi(data: Statistic.ICreateGroupRequestData) {
  return request({
    url: "statistics/plugins_permission_count_without_special",
    method: "post",
    data
  })
}

// pluginsCallTotal
export function pluginsCallTotalApi(data: Statistic.ICreateGroupRequestData) {
  return request({
    url: "statistics/plugins_call_total",
    method: "post",
    data
  })
}

// pluginsPermissionCountApi
export function pluginsPermissionMonthlyCountApi(data: Statistic.ICreateGroupRequestData) {
  return request({
    url: "statistics/plugins_call_total_monthly",
    method: "post",
    data
  })
}
