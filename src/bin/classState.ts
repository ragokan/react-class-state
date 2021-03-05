import React, { useReducer } from "react"
type StateSubscriber<T = Object> = (currentState: T, previousState: T) => void
type Hide<T> = Pick<T, Exclude<keyof T, "useState" | "getState" | "setState" | "subscribeState">>
type HideGet<T> = Pick<T, Exclude<keyof T, "getState">>
type HideUse<T> = Pick<T, Exclude<keyof T, "useState">>

export class ClassState {
  private force: React.DispatchWithoutAction | undefined
  private subscribers = new Set<StateSubscriber<this>>()

  public setState = async (
    setter: (((currentState: Hide<this>) => Partial<Hide<this>>) | Partial<Hide<this>>) | ((state: Hide<this>) => void)
  ) => {
    const previousState = { ...this }
    if (!(typeof setter === "function" && !(await setter(this)))) {
      const nextState: void | Partial<Hide<this>> | Promise<void> =
        typeof setter === "function" ? await setter(this) : setter
      Object.assign(this, nextState)
    }

    if (JSON.stringify(this) !== JSON.stringify(previousState)) {
      this.subscribers.forEach((sub) => sub(this, previousState))
      this.reRenderState()
    }
  }

  public getState = (): HideGet<this> => {
    return this
  }

  public useState = (): HideUse<this> => {
    this.initForce()
    return this
  }

  public subscribeState = (subscriber: StateSubscriber<this>) => {
    this.subscribers.add(subscriber)

    return () => this.subscribers.delete(subscriber)
  }

  private initForce = (): void => {
    const [, force] = useReducer((c) => c + 1, 0)
    this.force = force
  }

  private reRenderState = (): void => {
    this.force && this.force()
  }
}
