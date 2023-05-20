export interface ICreateGroupRequestData {
  group_id: string
}

export interface ICreateGroupMonthRequestData {
  group: {
    group_id: string
  }
  data: {
    month: string
  }
}
