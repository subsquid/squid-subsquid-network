export type AsyncTaskResult<T> =
  | { state: 'pending' }
  | { state: 'fulfilled'; value: T }
  | { state: 'rejected'; error: unknown }

export class AsyncTask<T> {
  private _result: AsyncTaskResult<T> = { state: 'pending' }

  private constructor() {}

  get(): AsyncTaskResult<T> {
    return this._result
  }

  static start<T>(fn: () => Promise<T>): AsyncTask<T> {
    const task = new AsyncTask<T>()
    fn().then(
      (value) => {
        task._result = { state: 'fulfilled', value }
      },
      (error) => {
        task._result = { state: 'rejected', error }
      },
    )
    return task
  }
}
