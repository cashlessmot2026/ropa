import { useCallback, useEffect, useRef, useState } from "react";
import { getDecartClient, TRYON_MODEL } from "../lib/decart.js";
import { buildTryOnPrompt } from "../lib/prompts.js";
import { logTryOnEvent } from "../services/tryonEvents.js";

const isMobile = () => /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

function cameraConstraints(facingMode, portrait) {
  // En móvil el SO ya entrega vertical; en escritorio invertimos ancho/alto para 9:16.
  const swap = portrait && !isMobile();
  return {
    audio: false,
    video: {
      facingMode,
      frameRate: { ideal: TRYON_MODEL.fps },
      width: { ideal: swap ? TRYON_MODEL.height : TRYON_MODEL.width },
      height: { ideal: swap ? TRYON_MODEL.width : TRYON_MODEL.height },
    },
  };
}

// Cache de imágenes de referencia como Blob: el SDK las envía en base64,
// así evitamos re-descargar la misma prenda al alternar productos.
const imageCache = new Map();
async function loadReferenceImage(url) {
  if (!imageCache.has(url)) {
    imageCache.set(
      url,
      fetch(url).then((r) => {
        if (!r.ok) throw new Error(`No se pudo cargar la imagen de la prenda (${r.status})`);
        return r.blob();
      }),
    );
  }
  try {
    return await imageCache.get(url);
  } catch (err) {
    imageCache.delete(url);
    throw err;
  }
}

function stateForProduct(product) {
  const prompt = buildTryOnPrompt(product);
  return { prompt, enhance: false, image: product.use_reference_image ? product.image_url : null };
}

/**
 * Probador virtual en tiempo real con Decart lucy-vton.
 *
 * status: idle | camera | connecting | connected | generating | reconnecting | disconnected | error
 */
export function useVirtualTryOn({ fast = false, portrait = isMobile() } = {}) {
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [activeProduct, setActiveProduct] = useState(null);
  const [seconds, setSeconds] = useState(0);
  const [applying, setApplying] = useState(false);

  const rtRef = useRef(null);
  const streamRef = useRef(null);
  const facingRef = useRef("user");
  const productRef = useRef(null);
  const secondsRef = useRef(0);

  const stop = useCallback(() => {
    const rt = rtRef.current;
    if (rt) {
      logTryOnEvent({ productSlug: productRef.current?.slug, decartSessionId: rt.sessionId, event: "end", seconds: secondsRef.current });
      rt.disconnect();
    }
    streamRef.current?.getTracks().forEach((t) => t.stop());
    rtRef.current = null;
    streamRef.current = null;
    productRef.current = null;
    secondsRef.current = 0;
    setLocalStream(null);
    setRemoteStream(null);
    setActiveProduct(null);
    setSeconds(0);
    setStatus("idle");
  }, []);

  const start = useCallback(
    async (initialProduct) => {
      if (rtRef.current) return rtRef.current;
      setError(null);
      try {
        setStatus("camera");
        const stream = await navigator.mediaDevices.getUserMedia(cameraConstraints(facingRef.current, portrait));
        streamRef.current = stream;
        setLocalStream(stream);

        setStatus("connecting");
        let initialState;
        if (initialProduct) {
          const { prompt, enhance, image } = stateForProduct(initialProduct);
          initialState = {
            prompt: { text: prompt, enhance },
            ...(image && { image: await loadReferenceImage(image) }),
          };
        }

        const rt = await getDecartClient().realtime.connect(stream, {
          model: TRYON_MODEL,
          mirror: "auto",
          ...(fast && { speed: "fast" }),
          initialState,
          onRemoteStream: setRemoteStream,
          onConnectionChange: setStatus,
        });
        rtRef.current = rt;

        rt.on("generationTick", ({ seconds: s }) => {
          secondsRef.current = s;
          setSeconds(s);
        });
        rt.on("error", (e) => setError(e.message || e.code));
        rt.on("sessionEnded", () => stop());

        if (initialProduct) {
          productRef.current = initialProduct;
          setActiveProduct(initialProduct);
          logTryOnEvent({ productSlug: initialProduct.slug, decartSessionId: rt.sessionId, event: "try" });
        }
        return rt;
      } catch (err) {
        streamRef.current?.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
        setLocalStream(null);
        setStatus("error");
        setError(
          err?.name === "NotAllowedError"
            ? "Necesitamos permiso para usar la cámara."
            : err?.message || "No se pudo iniciar el probador.",
        );
        return null;
      }
    },
    [fast, portrait, stop],
  );

  // Cambia de prenda sin reconectar. set() reemplaza todo el estado de la sesión.
  const tryOn = useCallback(
    async (product) => {
      const rt = rtRef.current ?? (await start(product));
      if (!rt || productRef.current === product) return;
      setApplying(true);
      setError(null);
      try {
        const { prompt, enhance, image } = stateForProduct(product);
        await rt.set({ prompt, enhance, image: image ? await loadReferenceImage(image) : null });
        productRef.current = product;
        setActiveProduct(product);
        logTryOnEvent({ productSlug: product.slug, decartSessionId: rt.sessionId, event: "try" });
      } catch (err) {
        setError(err?.message || "No se pudo aplicar la prenda.");
      } finally {
        setApplying(false);
      }
    },
    [start],
  );

  // Prueba libre por texto, ej. "Add a white bucket hat to the outfit."
  const tryPrompt = useCallback(async (prompt) => {
    const rt = rtRef.current;
    if (!rt) return;
    setApplying(true);
    try {
      await rt.set({ prompt, enhance: true });
      productRef.current = null;
      setActiveProduct(null);
    } catch (err) {
      setError(err?.message || "No se pudo aplicar el cambio.");
    } finally {
      setApplying(false);
    }
  }, []);

  const flipCamera = useCallback(async () => {
    facingRef.current = facingRef.current === "user" ? "environment" : "user";
    const rt = rtRef.current;
    if (!rt) return;
    try {
      const next = await navigator.mediaDevices.getUserMedia(cameraConstraints(facingRef.current, portrait));
      const [track] = next.getVideoTracks();
      await rt.replaceVideoTrack(track);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = next;
      setLocalStream(next);
    } catch (err) {
      setError(err?.message || "No se pudo cambiar de cámara.");
    }
  }, [portrait]);

  useEffect(() => stop, [stop]);

  return { status, error, localStream, remoteStream, activeProduct, seconds, applying, start, tryOn, tryPrompt, flipCamera, stop };
}
