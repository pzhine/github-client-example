export function formatGitHubDate(
  dateTime: string,
  includeTime: boolean = false
) {
  let [date, time] = dateTime.split('T')
  time = time.replace('Z', '')
  if (includeTime) {
    return `on ${date} at ${time}`
  }
  return `on ${date}`
}
