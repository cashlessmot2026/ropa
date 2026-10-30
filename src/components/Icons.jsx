const base = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true };

export const PowerIcon = () => (
  <svg {...base}>
    <path d="M12 3v8" />
    <path d="M6.3 6.3a8 8 0 1 0 11.4 0" />
  </svg>
);

export const FlipIcon = () => (
  <svg {...base}>
    <path d="M4 9a8 8 0 0 1 14-3l2 2" />
    <path d="M20 4v4h-4" />
    <path d="M20 15a8 8 0 0 1-14 3l-2-2" />
    <path d="M4 20v-4h4" />
  </svg>
);

export const StopIcon = () => (
  <svg {...base}>
    <rect x="6" y="6" width="12" height="12" rx="2" />
  </svg>
);

export const HangerIcon = () => (
  <svg {...base}>
    <path d="M12 7a2 2 0 1 1 2-2" />
    <path d="M12 7v2L3 16a1.5 1.5 0 0 0 1 3h16a1.5 1.5 0 0 0 1-3l-9-7" />
  </svg>
);
