import { request } from "@/utils/service"

// getSystemUsageApi
export function getSystemUsageApi() {
  return request({
    url: "system/usage",
    method: "post"
  })
}
