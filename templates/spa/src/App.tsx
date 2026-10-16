import { signal, computed } from "@epoch32/visage";

export function App() {
  const count = signal(0);
  const doubled = computed(() => count() * 2);

  return (
    <div>
      <h1>Visage</h1>
      <p>Fine-grained reactive UI with zero Virtual DOM overhead.</p>

      <div className="card">
        <button onClick={() => count.update((n) => n + 1)}>
          Count is {count}
        </button>
        <p style={{ marginTop: "1rem", color: "#94a3b8" }}>
          Doubled value: <strong>{doubled}</strong>
        </p>
      </div>

      <p className="read-the-docs">
        Edit <code>src/App.tsx</code> to test fine-grained reactive updates.
      </p>
    </div>
  );
}
