export interface ICreateGroupRequestData {
  group_id: string
}

export interface ICreateGroupPluginRequestData {
  group: {
    group_id: string
  }
  plugin: {
    plugin_name: string
  }
}

export interface ICreatePluginRequestData {
  plugin_name: string
}
