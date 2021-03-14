const isToday = (date: Date): boolean => {
  const today = new Date()
  return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
};

const isYesterday = (date: Date): boolean => {
  const today = new Date()
  return date.getDate() === today.getDate() - 1 &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
}

const formatDate = (date: Date | string): string => {
  const d = new Date(date)
  const rl = new Intl.RelativeTimeFormat(['en'], {style: 'narrow'})
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  if (isToday(d)) {
    if (now.getHours() - d.getHours() < 2) {
      if (Math.floor(diff / 1000 / 60) === 0) {
        return rl.format(-Math.round(diff / 1000 ), 'seconds')
      }
      return rl.format(-Math.round(diff / 1000 / 60), 'minutes')
    }
    return d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
  }
  if (isYesterday(d)) {
    return `yesterday` 
  }
  else {
    return d.toLocaleDateString([], {day: '2-digit', month: 'numeric', year: '2-digit'})
  }

}
const formatTime = (date: Date | string): string | boolean => {
  const d = new Date(date)
  const now = new Date()
  if (isToday(d)) {
    if (now.getHours() - d.getHours() < 2) {
      return false
    }
    return `today, ${d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`
  }
  else return `${formatDate(d)}, ${d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`
}

export {formatDate, formatTime}