import moment from 'moment'

// 时间格式化
const formatTime = (value, fomart = "YYYY-MM-DD HH:mm:ss") => {
  if (!value) return ''
  return moment(value * 1000).format(
    fomart
  );
}

export {
  formatTime
}
