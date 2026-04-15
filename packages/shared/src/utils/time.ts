export const SECOND_MS = 1000
export const MINUTE_MS = 60 * SECOND_MS
export const HOUR_MS = 60 * MINUTE_MS
export const DAY_MS = 24 * HOUR_MS
export const YEAR_MS = 365 * DAY_MS

export function toStartOfMinute(timestamp: number) {
  return Math.floor(timestamp / MINUTE_MS) * MINUTE_MS
}

export function toStartOfHour(timestamp: number) {
  return toStartOfInterval(timestamp, HOUR_MS)
}

export function toStartOfDay(timestamp: number) {
  return toStartOfInterval(timestamp, DAY_MS)
}

export function toEndOfDay(timestamp: number) {
  return toEndOfInterval(timestamp, DAY_MS)
}

export function toStartOfInterval(timestamp: number, interval: number) {
  return Math.floor(timestamp / interval) * interval
}

export function toEndOfInterval(timestamp: number, interval: number) {
  return toStartOfInterval(timestamp + interval, interval) - 1
}
