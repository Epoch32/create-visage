import { createRouter, query, mutation } from "@epoch32/visage/rpc";

interface TodoItem {
  id: string;
  title: string;
  completed: boolean;
}

let todos: TodoItem[] = [
  { id: "1", title: "Explore Visage fine-grained reactivity", completed: true },
  { id: "2", title: "Build full-stack app with type-safe RPC", completed: false },
  { id: "3", title: "Deploy to production", completed: false }
];

export const appRouter = createRouter({
  getTodos: query(() => {
    return todos;
  }),

  addTodo: mutation(({ input }: { input: { title: string } }) => {
    const newTodo: TodoItem = {
      id: String(Date.now()),
      title: input.title,
      completed: false
    };
    todos.push(newTodo);
    return newTodo;
  }),

  toggleTodo: mutation(({ input }: { input: { id: string } }) => {
    const item = todos.find((t) => t.id === input.id);
    if (item) {
      item.completed = !item.completed;
    }
    return item ?? null;
  })
});

export type AppRouter = typeof appRouter;
