export interface Job {
  start: () => void
  execute: () => Promise<void>
}
