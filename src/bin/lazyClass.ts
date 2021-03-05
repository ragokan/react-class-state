import { ClassState } from "./classState"

export const LazyClassState = <T extends Object>(initialState: T) => {
  class LazyClass extends ClassState {
    constructor() {
      super()
      Object.assign(this, initialState || {})
    }
  }

  const lazyClass: T & ClassState = Object.assign(new LazyClass())
  return lazyClass
}
