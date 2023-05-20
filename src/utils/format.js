const datetimeFmtStr = "yyyy-MM-dd hh:mm:ss"
const dateFmtStr = "yyyy-MM-dd"

function timestamp2datetime(timestamp) {
  return new Date(timestamp).format(datetimeFmtStr)
}

function timestamp2date(timestamp) {
  return new Date(timestamp).format(dateFmtStr)
}

export { timestamp2date, timestamp2datetime }
