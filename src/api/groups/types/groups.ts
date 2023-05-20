export interface ICreateGroupRequestData {
  group_id: string
}

export interface ICreateGroupUserRequestData {
  group: {
    group_id: string
  }
  user: {
    user_id: string
  }
}
