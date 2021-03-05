# React Class State (react-class-state)

Very small, fast, and unopinionated. You can use just like you want, state-rerenders are minimum especially if you use state.watchState(). Everything is type supported and smooth!

---

### Usage

First, create a React app, then paste this to your console:

```
npm install react-class-state
//OR
yarn add react-class-state
```

### Creating State

```TS
import ClassState from "react-class-state"
import { ITodo } from "./types/ITodo"

class TodoState extends ClassState {
  todos: ITodo[] = []

  // If you want, you can use actions inside the class, if you want you can also follow the next usages
  // Note : Always use arrow functions
  async fetchTodos = () => {
    const response = await fetch("https://jsonplaceholder.typicode.com/todos")
    const data = await response.json()
    this.setState((state) => (state.todos = data))
  }
}
const todoState = new TodoState()
// You can call this in react components, too.
// If you do this process on server or outside of component, you can use this as SSR with NextJS
todoState.fetchTodos()
```

### API after creating (Usage and examples are both below and in examples folder)

```TS
  // Get state outside React
  const {todos, setState, fetchTodos} = todoState.getState()

  // Get state inside React
  const {todos, setState, fetchTodos} = todoState.useState()

  // Set State
  const todo = { text: "I am a todo", completed: false }
  /* First */ todoState.setState({ todos: [todo] /*other state changes*/ })
  /* Second */ todoState.setState((prevState) => ({ todos: [...prevState.todos, todo] /*other state changes*/ }))
  /* Third */ todoState.setState((state) => {
    state.todos.push(todo)
  })

  // Subscribe State
  todoState.subscribeState((currentState,previousState) => {
    console.log("currentState:", currentState)
    console.log("previousState:", previousState)

  // This will re-render only once and whatever you change here will also change the React Component State
  currentState.todos.push(todo)
  })
```

#### Creating State as Pure Without Actions

```TS
class TodoState extends ClassState { todos: ITodo[] = [] }

const todoState = new TodoState()
const {todos,setTodos} = todoState.getState()
```

#### Usage in React

```TSX
const App = () => {
  // If you useState, it will cause re-rendering of the React whenever the value changes, so you have to use it.
  const { todos } = todoState.useState()
  return (
    <div>
      {todos.map((todo) => (
        <div key={todo.id}>{todo.title}</div>
      ))}
    </div>
  )
}
```

#### You can also get state outside of React.

```TS
  const { todos, setState } = todoState.getState()
  setState(/* your code here */)
```

#### Changing state inside components

```TSX
const App = () => {
  const { setState } = todoState.useState()

  useEffect(() => {
    const fetchTodos = async () => {
      const response = await fetch("https://jsonplaceholder.typicode.com/todos")
      setState((state) => (state.todos = await response.json()))
    }
    fetchTodos()
  }, [])

  // Rest of the App
}
```

#### Other Ways To Change State

```TSX
// You can change the state from anywhere, in regular files or inside class components/function components, no matter whether it is async or not,
const response = await fetch("https://jsonplaceholder.typicode.com/todos")
todoState.setState(async (state) => (state.todos = await response.json()))
```
