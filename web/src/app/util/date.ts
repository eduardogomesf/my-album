export const formatDate = (date: string) => {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export const isSameDate = (date1: string, date2: string) => {
  return formatDate(date1) === formatDate(date2)
}