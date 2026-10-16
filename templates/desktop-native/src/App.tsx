import { signal, onMount } from "@epoch32/visage";
import { native } from "@epoch32/visage/native";

interface SystemInfo {
  os: string;
  arch: string;
}

export function App() {
  const isNative = signal(native.isNativeApp());
  const sysInfo = signal<SystemInfo>({ os: "detecting...", arch: "" });
  const clicks = signal(0);

  onMount(async () => {
    try {
      const res = await native.invoke<SystemInfo>("getSystemInfo");
      if (res && res.os) {
        sysInfo.set(res);
      }
    } catch {
      // Running inside web preview mode
    }
  });

  return (
    <div>
      <h1>Visage Native Desktop</h1>
      <p style={{ color: "#94a3b8" }}>
        Fine-grained reactive UI powered by a lightweight native Zig desktop host.
      </p>

      <div className="card">
        <div className="info-grid">
          <div className="info-item">
            <div className="info-label">Environment</div>
            <div className="info-value">
              {() => (isNative() ? "Native Desktop" : "Web Preview")}
            </div>
          </div>
          <div className="info-item">
            <div className="info-label">OS / Architecture</div>
            <div className="info-value">
              {() => `${sysInfo().os} ${sysInfo().arch}`}
            </div>
          </div>
        </div>

        <div className="button-group">
          <button onClick={() => clicks.update((n) => n + 1)}>
            Clicks: {clicks}
          </button>
          {() =>
            isNative() && (
              <>
                <button
                  className="secondary"
                  onClick={() => native.minimize()}
                >
                  Minimize
                </button>
                <button
                  className="secondary"
                  onClick={() => native.close()}
                >
                  Close Window
                </button>
              </>
            )
          }
        </div>
      </div>
    </div>
  );
}
