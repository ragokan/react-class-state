import { useEffect, useReducer } from "react"

type StateSubscriber<T = Object> = (currentState: T, previousState: T) => void
type Hide<T> = Pick<T, Exclude<keyof T, "useState" | "getState" | "setState" | "subscribeState">>
type HideGet<T> = Pick<T, Exclude<keyof T, "getState">>
type HideUse<T> = Pick<T, Exclude<keyof T, "useState">>

export class ClassState {
  private subscribers = new Set<StateSubscriber<this>>()

  public setState = async (
    setter: (((currentState: Hide<this>) => Partial<Hide<this>>) | Partial<Hide<this>>) | ((state: Hide<this>) => void)
  ) => {
    try {
      const previousState = JSON.stringify(this)
      if (!(typeof setter === "function" && !(await setter(this)))) {
        const nextState: void | Partial<Hide<this>> | Promise<void> =
          typeof setter === "function" ? await setter(this) : setter
        Object.assign(this, nextState)
      }
      if (!Object.is(this, previousState)) {
        this.subscribers.forEach((sub) => sub(this, JSON.parse(previousState)))
      }
    } catch (error) {
      console.log(error || "An error happened while changing the state!")
    }
  }

  public getState = (): HideGet<this> => {
    return this
  }

  public useState = (): HideUse<this> => {
    const [, force] = useReducer((c) => c + 1, 0)

    useEffect(() => {
      const unsub = this.subscribeState((_, prev) => {
        if (!Object.is(this, prev)) {
          force()
        }
      })
      return unsub
    }, [])

    return this
  }

  public subscribeState = (subscriber: StateSubscriber<this>) => {
    this.subscribers.add(subscriber)

    return () => {
      this.subscribers.delete(subscriber)
    }
  }
}
