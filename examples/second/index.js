import React, { useEffect } from "react"
import ClassState from "react-class-state"
import ReactDOM from "react-dom"

class TodoState extends ClassState {
  todos = []
}
const todoState = new TodoState()

const App = () => {
  const { todos, setState } = todoState.useState()
  useEffect(() => {
    const fetchTodos = async () => {
      const response = await fetch("https://jsonplaceholder.typicode.com/todos")
      const data = await response.json()
      setState((state) => (state.todos = data))
    }
    fetchTodos()
  }, [])

  return (
    <div>
      {todos.map((todo) => (
        <div key={todo.id}>{todo.title}</div>
      ))}
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById("root"))
