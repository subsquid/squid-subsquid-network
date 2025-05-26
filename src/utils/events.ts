import { Awaitable } from './misc'

export type EventListener = (...args: any[]) => Awaitable<void>
export type EventMap = Record<string, EventListener>

export class EventEmitter<E extends EventMap = EventMap> {
  private events: Partial<Record<keyof E, { id?: string; fn: EventListener }[]>> = {}

  on<K extends keyof E>(event: K, fn: E[K], opts?: { id: string }): void {
    if (!this.events[event]) {
      this.events[event] = []
    }
    if (opts?.id) {
      this.off(event, opts.id)
    }

    this.events[event]!.push({ fn, id: opts?.id })
  }

  off<K extends keyof E>(event: K, fn: E[K]): void
  off<K extends keyof E>(event: K, id: string): void
  off<K extends keyof E>(event: K, fnOrId: E[K] | string): void {
    const listeners = this.events[event]
    if (!listeners) return

    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i]

      if (
        (typeof fnOrId === 'function' && fnOrId === listener.fn) ||
        (typeof fnOrId === 'string' && fnOrId === listener.id)
      ) {
        listeners.splice(i, 1)
        break
      }
    }
  }

  once<K extends keyof E>(event: K, fn: E[K], opts?: { id: string }): void {
    const onceWrap = ((...args) => {
      this.off(event, onceWrap)
      return fn(...args)
    }) as E[K]

    return this.on(event, onceWrap, opts)
  }

  async emit<K extends keyof E>(event: K, ...args: Parameters<E[K]>): Promise<void> {
    const listeners = this.events[event]?.slice()
    if (!listeners) return

    for (const listener of listeners) {
      await listener.fn(...args)
    }
  }
}
