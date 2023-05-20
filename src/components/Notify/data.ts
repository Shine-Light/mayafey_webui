import { reactive } from "vue"

export interface IListItem {
  avatar?: string
  title: string
  datetime?: string
  description?: string
  status?: "" | "success" | "info" | "warning" | "danger"
  extra?: string
}

export const notifyData: IListItem[] = reactive([])

export const messageData: IListItem[] = reactive([])

export const todoData: IListItem[] = reactive([])
