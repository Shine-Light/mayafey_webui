import { request } from "@/utils/service"
import axios from "axios"

// checkBotUpdate
export function checkBotUpdate() {
  return request({
    url: "other/check_bot_update",
    method: "post"
  })
}

// checkWebUIUpdate
export function checkWebUIUpdate() {
  return axios({
    method: "GET",
    url: "/api/version",
    headers: {
      "Cache-Control": "no-cache",
      ["Pragma"]: "no-cache"
    }
  })
}

// updateBot
export function updateBot() {
  return request({
    url: "other/update_bot",
    method: "post"
  })
}
