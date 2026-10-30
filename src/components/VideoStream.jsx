import { useEffect, useRef } from "react";

export function VideoStream({ stream, mirrored = false, style, ...props }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current && ref.current.srcObject !== stream) ref.current.srcObject = stream ?? null;
  }, [stream]);

  return (
    <video
      ref={ref}
      autoPlay
      playsInline
      muted
      style={{ transform: mirrored ? "scaleX(-1)" : undefined, ...style }}
      {...props}
    />
  );
}
