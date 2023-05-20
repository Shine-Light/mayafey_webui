import { request } from "@/utils/service"
import type * as Groups from "./types/groups"

// groupList
export function getGroupListApi() {
  return request({
    url: "groups/info/groups_info",
    method: "post"
  })
}

// permission
export function getPermissionsApi() {
  return request({
    url: "other/get_availabel_permission",
    method: "post"
  })
}

// groupInfo
export function getGroupInfoApi(data: Groups.ICreateGroupRequestData) {
  return request({
    url: "groups/info/group_info",
    method: "post",
    data
  })
}

// memberList
export function getMemberListApi(data: Groups.ICreateGroupRequestData) {
  return request({
    url: "groups/info/group_members",
    method: "post",
    data
  })
}

// groupEnable
export function groupEnableApi(data: Groups.ICreateGroupRequestData) {
  return request({
    url: "groups/info/group_enable",
    method: "post",
    data
  })
}

// groupDisable
export function groupDisableApi(data: Groups.ICreateGroupRequestData) {
  return request({
    url: "groups/info/group_disable",
    method: "post",
    data
  })
}

// groupInit
export function groupInitApi(data: Groups.ICreateGroupRequestData) {
  return request({
    url: "groups/info/group_init",
    method: "post",
    data
  })
}

// updateInfo
export function updateInfoApi(data: Groups.ICreateGroupUserRequestData) {
  return request({
    url: "groups/user/update_info",
    method: "post",
    data
  })
}

// groupMemberBotApi
export function groupMemberBotApi(data: Groups.ICreateGroupRequestData) {
  return request({
    url: "groups/info/group_member_bot",
    method: "post",
    data
  })
}

// adminBanApi
export function adminBanApi(data: Groups.ICreateGroupUserRequestData) {
  return request({
    url: "groups/admin/ban",
    method: "post",
    data
  })
}

// adminUnbanApi
export function adminUnbanApi(data: Groups.ICreateGroupUserRequestData) {
  return request({
    url: "groups/admin/unban",
    method: "post",
    data
  })
}

// adminBanWholeApi
export function adminBanWholeApi(data: Groups.ICreateGroupRequestData) {
  return request({
    url: "groups/admin/ban_whole",
    method: "post",
    data
  })
}

// adminUnbanWholeApi
export function adminUnbanWholeApi(data: Groups.ICreateGroupRequestData) {
  return request({
    url: "groups/admin/unban_whole",
    method: "post",
    data
  })
}

// adminKickApi
export function adminKickApi(data: Groups.ICreateGroupUserRequestData) {
  return request({
    url: "groups/admin/kick",
    method: "post",
    data
  })
}

// adminKickBlockApi
export function adminKickBlockApi(data: Groups.ICreateGroupUserRequestData) {
  return request({
    url: "groups/admin/kick_block",
    method: "post",
    data
  })
}

// adminTitleSetApi
export function adminTitleSetApi(data: Groups.ICreateGroupUserRequestData) {
  return request({
    url: "groups/admin/title_set",
    method: "post",
    data
  })
}

// adminTitleUnsetApi
export function adminTitleUnsetApi(data: Groups.ICreateGroupUserRequestData) {
  return request({
    url: "groups/admin/title_unset",
    method: "post",
    data
  })
}

// adminAdminSetApi
export function adminAdminSetApi(data: Groups.ICreateGroupUserRequestData) {
  return request({
    url: "groups/admin/admin_set",
    method: "post",
    data
  })
}

// adminAdminUnsetApi
export function adminAdminUnsetApi(data: Groups.ICreateGroupUserRequestData) {
  return request({
    url: "groups/admin/admin_unset",
    method: "post",
    data
  })
}
