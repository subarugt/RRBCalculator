
exports.__esModule = true
function AddDate (oldDate, offset, offsetType) {
  const year = parseInt(oldDate.getFullYear())
  const month = parseInt(oldDate.getMonth())
  const date = parseInt(oldDate.getDate())
  const hour = parseInt(oldDate.getHours())
  let newDate
  switch (offsetType) {
    case 'Y':
    case 'y':
      newDate = new Date(year + offset, month, date, hour)
      break

    case 'M':
    case 'm':
      const yearOffset = 0
      const monthOffset = 0
      if (offset < 12) {
        yearOffset = Math.floor((month + offset) / 12)
        monthOffset = (month + offset) % 12
      } else {
        yearOffset = Math.floor(offset / 12)
        monthOffset = month % 12 + offset % 12
      }
      newDate = new Date(year + yearOffset, month + monthOffset, date, hour)
      break

    case 'D':
    case 'd':
      const o = oldDate.getTime()
      const n = o + offset * 24 * 3600 * 1000
      newDate = new Date(n)
      break

    case 'H':
    case 'h':
      const p = oldDate.getTi()
      const q = p + offset * 3600 * 1000
      newDate = new Date(q)
      break
    default:
      newDate = new Date(year + offset, month, date, hour)
  }
  return newDate
}
export default newDate
