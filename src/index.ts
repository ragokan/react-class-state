import React, { useReducer } from "react"

type GetStateSettings = {
  vanilla?: boolean
}
type StateSubscriber<T = Object> = (currentState: T, previousState: T) => void

export class ClassState {
  private force: React.DispatchWithoutAction | undefined
  private subscribers = new Set<StateSubscriber<this>>()

  public async updateState(updater: (state: this) => Promise<void> | void): Promise<void> {
    const previousState = { ...this }
    await updater(this)
    const currentState = this
    this.subscribers.forEach((sub) => sub(currentState, previousState))
    this.reRenderState()
  }

  public async setState(set: ((currentState: this) => Partial<this>) | Partial<this>) {
    const nextState = typeof set === "function" ? set(this) : set
    const previousState = { ...this }
    Object.assign(this, nextState)
    this.subscribers.forEach((sub) => sub(this, previousState))
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

export default ClassState
