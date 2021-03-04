import React, { useReducer } from "react"

type GetStateSettings = {
  vanilla?: boolean
}
type StateSubscriber<T = Object> = (currentState: T, previousState: T) => void

export class ClassState {
  private force: React.DispatchWithoutAction | undefined
  private subscribers = new Set<StateSubscriber<this>>()
  count: number = 5

  public async setState(
    setter: (((currentState: this) => Partial<this>) | Partial<this>) | ((state: this) => Promise<void> | void)
  ) {
    let nextState: void | Partial<this> | Promise<void>
    const previousState = { ...this }
    if (!(typeof setter === "function" && !setter(this))) {
      nextState = typeof setter === "function" ? setter(this) : setter
      Object.assign(this, nextState)
    }
    this.subscribers.forEach((sub) => sub(this, previousState))
    this.reRenderState()
  }

  public getState(settings: GetStateSettings = {}): this {
    if (!settings.vanilla) this.initForce()
    return this
  }

  public watchState(): void {
    this.initForce()
  }

  public subscribeState(subscriber: StateSubscriber<this>): StateSubscriber<this> {
    this.subscribers.add(subscriber)
    return subscriber
  }

  private initForce(): void {
    const [, force] = useReducer((c) => c + 1, 0)
    this.force = force
  }

  private reRenderState(): void {
    this.force && this.force()
  }
}

const myClass = new ClassState()
console.log(myClass.getState({ vanilla: true }))

myClass.setState({ count: 6 })

console.log(myClass.getState({ vanilla: true }))

export default ClassState
