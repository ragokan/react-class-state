import React, { useEffect } from "react"
import { LazyClassState } from "react-class-state"
import ReactDOM from "react-dom"

const todoState = LazyClassState({ todos: [] })

const fetchTodos = async () => {
  const response = await fetch("https://jsonplaceholder.typicode.com/todos/1")
  const data = await response.json()
  todoState.setState((state) => state.todos.push(data))
}

const App = () => {
  const { todos } = todoState.useState()
  useEffect(() => fetchTodos(), [])
  return (
    <div>
      {todos.map((todo) => (
        <div key={todo.id}>{todo.title}</div>
      ))}
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById("root"))
