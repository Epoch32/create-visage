import { signal } from "@epoch32/visage";
import { createClient } from "@epoch32/visage/rpc";
import type { AppRouter } from "./server/router";

interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

const client = createClient<AppRouter>({
  baseUrl: "/api/rpc"
});

export function App() {
  const todos = signal<Todo[]>([]);
  const newTitle = signal("");
  const loading = signal(true);

  async function loadTodos() {
    try {
      const data = await client.getTodos.query();
      todos.set(data);
    } finally {
      loading.set(false);
    }
  }

  loadTodos();

  async function handleAdd(e: Event) {
    e.preventDefault();
    const title = newTitle().trim();
    if (!title) return;
    newTitle.set("");

    const created = await client.addTodo.mutate({ title });
    todos.update((list) => [...list, created]);
  }

  async function handleToggle(id: string) {
    todos.update((list) =>
      list.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
    await client.toggleTodo.mutate({ id });
  }

  return (
    <div>
      <h1>Visage Full-Stack RPC</h1>
      <p style={{ color: "#94a3b8" }}>
        End-to-end type safety between client signals and server procedures.
      </p>

      <div className="card">
        <form onSubmit={handleAdd} className="input-row">
          <input
            type="text"
            placeholder="Add new task..."
            value={newTitle}
            onInput={(e: any) => newTitle.set(e.target.value)}
          />
          <button type="submit">Add Task</button>
        </form>

        <ul className="todo-list">
          {() =>
            loading() ? (
              <li style={{ color: "#94a3b8", textAlign: "center" }}>Loading tasks...</li>
            ) : todos().length === 0 ? (
              <li style={{ color: "#94a3b8", textAlign: "center" }}>No tasks yet.</li>
            ) : (
              todos().map((todo) => (
                <li
                  key={todo.id}
                  className={`todo-item ${todo.completed ? "completed" : ""}`}
                >
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggle(todo.id)}
                  />
                  <span style={{ flex: 1 }}>{todo.title}</span>
                </li>
              ))
            )
          }
        </ul>
      </div>
    </div>
  );
}
