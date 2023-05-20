import { request } from "@/utils/service"
import type * as Plugins from "./types/plugins"

// getPluginList
export function getPluginListApi(data: Plugins.ICreateGroupRequestData) {
  return request({
    url: "plugins/info/plugin_list",
    method: "post",
    data
  })
}

// pluginEnableApi
export function pluginEnableApi(data: Plugins.ICreateGroupPluginRequestData) {
  return request({
    url: "plugins/manage/plugin_enable",
    method: "post",
    data
  })
}

// pluginDisableApi
export function pluginDisableApi(data: Plugins.ICreateGroupPluginRequestData) {
  return request({
    url: "plugins/manage/plugin_disable",
    method: "post",
    data
  })
}

// pluginTotalEnableApi
export function pluginTotalEnableApi(data: Plugins.ICreateGroupPluginRequestData) {
  return request({
    url: "plugins/manage/plugin_total_enable",
    method: "post",
    data
  })
}

// pluginTotalDisableApi
export function pluginTotalDisableApi(data: Plugins.ICreateGroupPluginRequestData) {
  return request({
    url: "plugins/manage/plugin_total_disable",
    method: "post",
    data
  })
}

// pluginPermissionUpdateApi
export function pluginPermissionUpdateApi(data: Plugins.ICreateGroupPluginRequestData) {
  return request({
    url: "plugins/manage/plugin_permission_update",
    method: "post",
    data
  })
}

// pluginCdUpdateApi
export function pluginCdUpdateApi(data: Plugins.ICreateGroupPluginRequestData) {
  return request({
    url: "plugins/manage/plugin_cd_update",
    method: "post",
    data
  })
}

// pluginsTranslateApi
export function getPluginsTranslateApi() {
  return request({
    url: "plugins/info/get_plugins_translate",
    method: "post"
  })
}

// getPluginTranslateApi
export function getPluginTranslateApi(data: Plugins.ICreatePluginRequestData) {
  return request({
    url: "plugins/info/get_plugin_translate",
    method: "post",
    data
  })
}
