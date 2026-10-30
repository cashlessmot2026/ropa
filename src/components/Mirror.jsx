import { useMemo } from "react";
import { VideoStream } from "./VideoStream.jsx";
import { FlipIcon, PowerIcon, StopIcon } from "./Icons.jsx";
import { FRAMING_HINT } from "../lib/prompts.js";

const STATUS = {
  idle: { text: "Probador apagado", tone: "off" },
  camera: { text: "Abriendo la cámara", tone: "busy" },
  connecting: { text: "Encendiendo el espejo", tone: "busy" },
  connected: { text: "Conectado", tone: "busy" },
  generating: { text: "En vivo", tone: "live" },
  reconnecting: { text: "Reconectando", tone: "busy" },
  disconnected: { text: "Desconectado", tone: "off" },
  error: { text: "Sin conexión", tone: "error" },
};

// Bombillas repartidas por el marco: 7 arriba/abajo, 9 por lado.
function useBulbs() {
  return useMemo(() => {
    const pts = [];
    const row = (n, y) => Array.from({ length: n }, (_, k) => [((k + 1) / (n + 1)) * 100, y]);
    const col = (n, x) => Array.from({ length: n }, (_, k) => [x, ((k + 1) / (n + 1)) * 100]);
    pts.push(...row(7, 0), ...col(9, 100), ...row(7, 100).reverse(), ...col(9, 0).reverse());
    return pts;
  }, []);
}

export function StatusPill({ status }) {
  const s = STATUS[status] ?? STATUS.idle;
  return (
    <span className="status" data-tone={s.tone} role="status">
      <span className="status__dot" />
      {s.text}
    </span>
  );
}

export function Mirror({ tryon }) {
  const bulbs = useBulbs();
  const { status, activeProduct, remoteStream, localStream } = tryon;
  const live = status !== "idle" && status !== "error" && status !== "disconnected";
  const busy = ["camera", "connecting", "reconnecting"].includes(status) || tryon.applying;

  return (
    <div className="mirror" data-live={status === "generating"} data-busy={busy}>
      <div className="mirror__bulbs" aria-hidden="true">
        {bulbs.map(([x, y], i) => (
          <span key={i} className="mirror__bulb" style={{ left: `${x}%`, top: `${y}%`, "--i": i }} />
        ))}
      </div>

      <div className="mirror__glass">
        {live ? (
          <>
            <VideoStream stream={remoteStream} className="mirror__output" aria-label="Tu imagen con la prenda puesta" />
            {localStream && <VideoStream stream={localStream} className="mirror__pip" aria-label="Tu cámara" />}

            {activeProduct ? (
              <div className="mirror__chip">
                <img src={activeProduct.image_url} alt="" />
                <div>
                  <strong>{activeProduct.name}</strong>
                  <span>{FRAMING_HINT[activeProduct.category]}</span>
                </div>
              </div>
            ) : (
              <div className="mirror__chip">
                <div>
                  <strong>Elige una prenda</strong>
                  <span>Toca “Probar” en cualquier producto del catálogo</span>
                </div>
              </div>
            )}

            <div className="mirror__controls">
              <button className="btn btn--ghost" onClick={tryon.flipCamera}>
                <FlipIcon /> Girar cámara
              </button>
              <button className="btn btn--ghost" onClick={tryon.stop}>
                <StopIcon /> Apagar
              </button>
            </div>
          </>
        ) : (
          <div className="mirror__idle">
            <h1>Pruébatelo antes de comprarlo</h1>
            <p>Enciende el espejo, ponte frente a la cámara con buena luz y elige cualquier prenda.</p>
            <button className="btn btn--lg" onClick={() => tryon.start()}>
              <PowerIcon /> Encender probador
            </button>
          </div>
        )}
      </div>

      {tryon.error && (
        <p className="mirror__error" role="alert">
          {tryon.error}
        </p>
      )}
    </div>
  );
}
