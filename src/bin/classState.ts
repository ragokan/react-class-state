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
    try {
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
    } catch (error) {
      console.log(error || "An error happened while changing the state!")
    }
  }

  public getState = (): HideGet<this> => {
    return this
  }

  public useState = (): HideUse<this> => {
    try {
      this.initForce()
    } catch (error) {
      const errorMessage =
        "\n An error happened while trying to init the state, it is probably because you are using 'useState' function outside of React function component."
      console.log(error ? error + errorMessage : errorMessage)
    }
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
    try {
      this.force && this.force()
    } catch (error) {
      console.log(error || "An error happened while re-rendering the state!")
    }
  }
}
