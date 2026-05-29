(() => {

/* BEGIN USAGE */
// tweaks-panel.jsx
// Reusable Tweaks shell + form-control helpers.
// Exports (to window): useTweaks, TweaksPanel, TweakSection, TweakRow, TweakSlider,
//   TweakToggle, TweakRadio, TweakSelect, TweakText, TweakNumber, TweakColor, TweakButton.
//
// Owns the host protocol (listens for __activate_edit_mode / __deactivate_edit_mode,
// posts __edit_mode_available / __edit_mode_set_keys / __edit_mode_dismissed) so
// individual prototypes don't re-roll it. Ships a consistent set of controls so you
// don't hand-draw <input type="range">, segmented radios, steppers, etc.
//
// Usage (in an HTML file that loads React + Babel):
//
//   const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
//     "primaryColor": "#D97757",
//     "palette": ["#D97757", "#29261b", "#f6f4ef"],
//     "fontSize": 16,
//     "density": "regular",
//     "dark": false
//   }/*EDITMODE-END*/;
//
//   function App() {
//     const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
//     return (
//       <div style={{ fontSize: t.fontSize, color: t.primaryColor }}>
//         Hello
//         <TweaksPanel>
//           <TweakSection label="Typography" />
//           <TweakSlider label="Font size" value={t.fontSize} min={10} max={32} unit="px"
//                        onChange={(v) => setTweak('fontSize', v)} />
//           <TweakRadio  label="Density" value={t.density}
//                        options={['compact', 'regular', 'comfy']}
//                        onChange={(v) => setTweak('density', v)} />
//           <TweakSection label="Theme" />
//           <TweakColor  label="Primary" value={t.primaryColor}
//                        options={['#D97757', '#2A6FDB', '#1F8A5B', '#7A5AE0']}
//                        onChange={(v) => setTweak('primaryColor', v)} />
//           <TweakColor  label="Palette" value={t.palette}
//                        options={[['#D97757', '#29261b', '#f6f4ef'],
//                                  ['#475569', '#0f172a', '#f1f5f9']]}
//                        onChange={(v) => setTweak('palette', v)} />
//           <TweakToggle label="Dark mode" value={t.dark}
//                        onChange={(v) => setTweak('dark', v)} />
//         </TweaksPanel>
//       </div>
//     );
//   }
//
// TweakRadio is the segmented control for 2–3 short options (auto-falls-back to
// TweakSelect past ~16/~10 chars per label); reach for TweakSelect directly when
// options are many or long. For color tweaks always curate 3-4 options rather than
// a free picker; an option can also be a whole 2–5 color palette (the stored value
// is the array). The Tweak* controls are a floor, not a ceiling — build custom
// controls inside the panel if a tweak calls for UI they don't cover.
/* END USAGE */
// ─────────────────────────────────────────────────────────────────────────────

const __TWEAKS_STYLE = `
  .twk-panel{position:fixed;right:16px;bottom:16px;z-index:2147483646;width:280px;
    max-height:calc(100vh - 32px);display:flex;flex-direction:column;
    transform:scale(var(--dc-inv-zoom,1));transform-origin:bottom right;
    background:rgba(250,249,247,.78);color:#29261b;
    -webkit-backdrop-filter:blur(24px) saturate(160%);backdrop-filter:blur(24px) saturate(160%);
    border:.5px solid rgba(255,255,255,.6);border-radius:14px;
    box-shadow:0 1px 0 rgba(255,255,255,.5) inset,0 12px 40px rgba(0,0,0,.18);
    font:11.5px/1.4 ui-sans-serif,system-ui,-apple-system,sans-serif;overflow:hidden}
  .twk-hd{display:flex;align-items:center;justify-content:space-between;
    padding:10px 8px 10px 14px;cursor:move;user-select:none}
  .twk-hd b{font-size:12px;font-weight:600;letter-spacing:.01em}
  .twk-x{appearance:none;border:0;background:transparent;color:rgba(41,38,27,.55);
    width:22px;height:22px;border-radius:6px;cursor:default;font-size:13px;line-height:1}
  .twk-x:hover{background:rgba(0,0,0,.06);color:#29261b}
  .twk-body{padding:2px 14px 14px;display:flex;flex-direction:column;gap:10px;
    overflow-y:auto;overflow-x:hidden;min-height:0;
    scrollbar-width:thin;scrollbar-color:rgba(0,0,0,.15) transparent}
  .twk-body::-webkit-scrollbar{width:8px}
  .twk-body::-webkit-scrollbar-track{background:transparent;margin:2px}
  .twk-body::-webkit-scrollbar-thumb{background:rgba(0,0,0,.15);border-radius:4px;
    border:2px solid transparent;background-clip:content-box}
  .twk-body::-webkit-scrollbar-thumb:hover{background:rgba(0,0,0,.25);
    border:2px solid transparent;background-clip:content-box}
  .twk-row{display:flex;flex-direction:column;gap:5px}
  .twk-row-h{flex-direction:row;align-items:center;justify-content:space-between;gap:10px}
  .twk-lbl{display:flex;justify-content:space-between;align-items:baseline;
    color:rgba(41,38,27,.72)}
  .twk-lbl>span:first-child{font-weight:500}
  .twk-val{color:rgba(41,38,27,.5);font-variant-numeric:tabular-nums}

  .twk-sect{font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;
    color:rgba(41,38,27,.45);padding:10px 0 0}
  .twk-sect:first-child{padding-top:0}

  .twk-field{appearance:none;box-sizing:border-box;width:100%;min-width:0;height:26px;padding:0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;
    background:rgba(255,255,255,.6);color:inherit;font:inherit;outline:none}
  .twk-field:focus{border-color:rgba(0,0,0,.25);background:rgba(255,255,255,.85)}
  select.twk-field{padding-right:22px;
    background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path fill='rgba(0,0,0,.5)' d='M0 0h10L5 6z'/></svg>");
    background-repeat:no-repeat;background-position:right 8px center}

  .twk-slider{appearance:none;-webkit-appearance:none;width:100%;height:4px;margin:6px 0;
    border-radius:999px;background:rgba(0,0,0,.12);outline:none}
  .twk-slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;
    width:14px;height:14px;border-radius:50%;background:#fff;
    border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}
  .twk-slider::-moz-range-thumb{width:14px;height:14px;border-radius:50%;
    background:#fff;border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}

  .twk-seg{position:relative;display:flex;padding:2px;border-radius:8px;
    background:rgba(0,0,0,.06);user-select:none}
  .twk-seg-thumb{position:absolute;top:2px;bottom:2px;border-radius:6px;
    background:rgba(255,255,255,.9);box-shadow:0 1px 2px rgba(0,0,0,.12);
    transition:left .15s cubic-bezier(.3,.7,.4,1),width .15s}
  .twk-seg.dragging .twk-seg-thumb{transition:none}
  .twk-seg button{appearance:none;position:relative;z-index:1;flex:1;border:0;
    background:transparent;color:inherit;font:inherit;font-weight:500;min-height:22px;
    border-radius:6px;cursor:default;padding:4px 6px;line-height:1.2;
    overflow-wrap:anywhere}

  .twk-toggle{position:relative;width:32px;height:18px;border:0;border-radius:999px;
    background:rgba(0,0,0,.15);transition:background .15s;cursor:default;padding:0}
  .twk-toggle[data-on="1"]{background:#34c759}
  .twk-toggle i{position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;
    background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.25);transition:transform .15s}
  .twk-toggle[data-on="1"] i{transform:translateX(14px)}

  .twk-num{display:flex;align-items:center;box-sizing:border-box;min-width:0;height:26px;padding:0 0 0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;background:rgba(255,255,255,.6)}
  .twk-num-lbl{font-weight:500;color:rgba(41,38,27,.6);cursor:ew-resize;
    user-select:none;padding-right:8px}
  .twk-num input{flex:1;min-width:0;height:100%;border:0;background:transparent;
    font:inherit;font-variant-numeric:tabular-nums;text-align:right;padding:0 8px 0 0;
    outline:none;color:inherit;-moz-appearance:textfield}
  .twk-num input::-webkit-inner-spin-button,.twk-num input::-webkit-outer-spin-button{
    -webkit-appearance:none;margin:0}
  .twk-num-unit{padding-right:8px;color:rgba(41,38,27,.45)}

  .twk-btn{appearance:none;height:26px;padding:0 12px;border:0;border-radius:7px;
    background:rgba(0,0,0,.78);color:#fff;font:inherit;font-weight:500;cursor:default}
  .twk-btn:hover{background:rgba(0,0,0,.88)}
  .twk-btn.secondary{background:rgba(0,0,0,.06);color:inherit}
  .twk-btn.secondary:hover{background:rgba(0,0,0,.1)}

  .twk-swatch{appearance:none;-webkit-appearance:none;width:56px;height:22px;
    border:.5px solid rgba(0,0,0,.1);border-radius:6px;padding:0;cursor:default;
    background:transparent;flex-shrink:0}
  .twk-swatch::-webkit-color-swatch-wrapper{padding:0}
  .twk-swatch::-webkit-color-swatch{border:0;border-radius:5.5px}
  .twk-swatch::-moz-color-swatch{border:0;border-radius:5.5px}

  .twk-chips{display:flex;gap:6px}
  .twk-chip{position:relative;appearance:none;flex:1;min-width:0;height:46px;
    padding:0;border:0;border-radius:6px;overflow:hidden;cursor:default;
    box-shadow:0 0 0 .5px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.06);
    transition:transform .12s cubic-bezier(.3,.7,.4,1),box-shadow .12s}
  .twk-chip:hover{transform:translateY(-1px);
    box-shadow:0 0 0 .5px rgba(0,0,0,.18),0 4px 10px rgba(0,0,0,.12)}
  .twk-chip[data-on="1"]{box-shadow:0 0 0 1.5px rgba(0,0,0,.85),
    0 2px 6px rgba(0,0,0,.15)}
  .twk-chip>span{position:absolute;top:0;bottom:0;right:0;width:34%;
    display:flex;flex-direction:column;box-shadow:-1px 0 0 rgba(0,0,0,.1)}
  .twk-chip>span>i{flex:1;box-shadow:0 -1px 0 rgba(0,0,0,.1)}
  .twk-chip>span>i:first-child{box-shadow:none}
  .twk-chip svg{position:absolute;top:6px;left:6px;width:13px;height:13px;
    filter:drop-shadow(0 1px 1px rgba(0,0,0,.3))}
`;

// ── useTweaks ───────────────────────────────────────────────────────────────
// Single source of truth for tweak values. setTweak persists via the host
// (__edit_mode_set_keys → host rewrites the EDITMODE block on disk).
function useTweaks(defaults) {
  const [values, setValues] = React.useState(defaults);
  // Accepts either setTweak('key', value) or setTweak({ key: value, ... }) so a
  // useState-style call doesn't write a "[object Object]" key into the persisted
  // JSON block.
  const setTweak = React.useCallback((keyOrEdits, val) => {
    const edits = typeof keyOrEdits === 'object' && keyOrEdits !== null
      ? keyOrEdits : { [keyOrEdits]: val };
    setValues((prev) => ({ ...prev, ...edits }));
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits }, '*');
    // Same-window signal so in-page listeners (deck-stage rail thumbnails)
    // can react — the parent message only reaches the host, not peers.
    window.dispatchEvent(new CustomEvent('tweakchange', { detail: edits }));
  }, []);
  return [values, setTweak];
}

// ── TweaksPanel ─────────────────────────────────────────────────────────────
// Floating shell. Registers the protocol listener BEFORE announcing
// availability — if the announce ran first, the host's activate could land
// before our handler exists and the toolbar toggle would silently no-op.
// The close button posts __edit_mode_dismissed so the host's toolbar toggle
// flips off in lockstep; the host echoes __deactivate_edit_mode back which
// is what actually hides the panel.
function TweaksPanel({ title = 'Tweaks', children }) {
  const [open, setOpen] = React.useState(false);
  const dragRef = React.useRef(null);
  const offsetRef = React.useRef({ x: 16, y: 16 });
  const PAD = 16;

  const clampToViewport = React.useCallback(() => {
    const panel = dragRef.current;
    if (!panel) return;
    const w = panel.offsetWidth, h = panel.offsetHeight;
    const maxRight = Math.max(PAD, window.innerWidth - w - PAD);
    const maxBottom = Math.max(PAD, window.innerHeight - h - PAD);
    offsetRef.current = {
      x: Math.min(maxRight, Math.max(PAD, offsetRef.current.x)),
      y: Math.min(maxBottom, Math.max(PAD, offsetRef.current.y)),
    };
    panel.style.right = offsetRef.current.x + 'px';
    panel.style.bottom = offsetRef.current.y + 'px';
  }, []);

  React.useEffect(() => {
    if (!open) return;
    clampToViewport();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', clampToViewport);
      return () => window.removeEventListener('resize', clampToViewport);
    }
    const ro = new ResizeObserver(clampToViewport);
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  }, [open, clampToViewport]);

  React.useEffect(() => {
    const onMsg = (e) => {
      const t = e?.data?.type;
      if (t === '__activate_edit_mode') setOpen(true);
      else if (t === '__deactivate_edit_mode') setOpen(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);

  const dismiss = () => {
    setOpen(false);
    window.parent.postMessage({ type: '__edit_mode_dismissed' }, '*');
  };

  const onDragStart = (e) => {
    const panel = dragRef.current;
    if (!panel) return;
    const r = panel.getBoundingClientRect();
    const sx = e.clientX, sy = e.clientY;
    const startRight = window.innerWidth - r.right;
    const startBottom = window.innerHeight - r.bottom;
    const move = (ev) => {
      offsetRef.current = {
        x: startRight - (ev.clientX - sx),
        y: startBottom - (ev.clientY - sy),
      };
      clampToViewport();
    };
    const up = () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  };

  if (!open) return null;
  return (
    <>
      <style>{__TWEAKS_STYLE}</style>
      <div ref={dragRef} className="twk-panel" data-omelette-chrome=""
           style={{ right: offsetRef.current.x, bottom: offsetRef.current.y }}>
        <div className="twk-hd" onMouseDown={onDragStart}>
          <b>{title}</b>
          <button className="twk-x" aria-label="Close tweaks"
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={dismiss}>✕</button>
        </div>
        <div className="twk-body">
          {children}
        </div>
      </div>
    </>
  );
}

// ── Layout helpers ──────────────────────────────────────────────────────────

function TweakSection({ label, children }) {
  return (
    <>
      <div className="twk-sect">{label}</div>
      {children}
    </>
  );
}

function TweakRow({ label, value, children, inline = false }) {
  return (
    <div className={inline ? 'twk-row twk-row-h' : 'twk-row'}>
      <div className="twk-lbl">
        <span>{label}</span>
        {value != null && <span className="twk-val">{value}</span>}
      </div>
      {children}
    </div>
  );
}

// ── Controls ────────────────────────────────────────────────────────────────

function TweakSlider({ label, value, min = 0, max = 100, step = 1, unit = '', onChange }) {
  return (
    <TweakRow label={label} value={`${value}${unit}`}>
      <input type="range" className="twk-slider" min={min} max={max} step={step}
             value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </TweakRow>
  );
}

function TweakToggle({ label, value, onChange }) {
  return (
    <div className="twk-row twk-row-h">
      <div className="twk-lbl"><span>{label}</span></div>
      <button type="button" className="twk-toggle" data-on={value ? '1' : '0'}
              role="switch" aria-checked={!!value}
              onClick={() => onChange(!value)}><i /></button>
    </div>
  );
}

function TweakRadio({ label, value, options, onChange }) {
  const trackRef = React.useRef(null);
  const [dragging, setDragging] = React.useState(false);
  // The active value is read by pointer-move handlers attached for the lifetime
  // of a drag — ref it so a stale closure doesn't fire onChange for every move.
  const valueRef = React.useRef(value);
  valueRef.current = value;

  // Segments wrap mid-word once per-segment width runs out. The track is
  // ~248px (280 panel − 28 body pad − 4 seg pad), each button loses 12px
  // to its own padding, and 11.5px system-ui averages ~6.3px/char — so 2
  // options fit ~16 chars each, 3 fit ~10. Past that (or >3 options), fall
  // back to a dropdown rather than wrap.
  const labelLen = (o) => String(typeof o === 'object' ? o.label : o).length;
  const maxLen = options.reduce((m, o) => Math.max(m, labelLen(o)), 0);
  const fitsAsSegments = maxLen <= ({ 2: 16, 3: 10 }[options.length] ?? 0);
  if (!fitsAsSegments) {
    // <select> emits strings — map back to the original option value so the
    // fallback stays type-preserving (numbers, booleans) like the segment path.
    const resolve = (s) => {
      const m = options.find((o) => String(typeof o === 'object' ? o.value : o) === s);
      return m === undefined ? s : typeof m === 'object' ? m.value : m;
    };
    return <TweakSelect label={label} value={value} options={options}
                        onChange={(s) => onChange(resolve(s))} />;
  }
  const opts = options.map((o) => (typeof o === 'object' ? o : { value: o, label: o }));
  const idx = Math.max(0, opts.findIndex((o) => o.value === value));
  const n = opts.length;

  const segAt = (clientX) => {
    const r = trackRef.current.getBoundingClientRect();
    const inner = r.width - 4;
    const i = Math.floor(((clientX - r.left - 2) / inner) * n);
    return opts[Math.max(0, Math.min(n - 1, i))].value;
  };

  const onPointerDown = (e) => {
    setDragging(true);
    const v0 = segAt(e.clientX);
    if (v0 !== valueRef.current) onChange(v0);
    const move = (ev) => {
      if (!trackRef.current) return;
      const v = segAt(ev.clientX);
      if (v !== valueRef.current) onChange(v);
    };
    const up = () => {
      setDragging(false);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  return (
    <TweakRow label={label}>
      <div ref={trackRef} role="radiogroup" onPointerDown={onPointerDown}
           className={dragging ? 'twk-seg dragging' : 'twk-seg'}>
        <div className="twk-seg-thumb"
             style={{ left: `calc(2px + ${idx} * (100% - 4px) / ${n})`,
                      width: `calc((100% - 4px) / ${n})` }} />
        {opts.map((o) => (
          <button key={o.value} type="button" role="radio" aria-checked={o.value === value}>
            {o.label}
          </button>
        ))}
      </div>
    </TweakRow>
  );
}

function TweakSelect({ label, value, options, onChange }) {
  return (
    <TweakRow label={label}>
      <select className="twk-field" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => {
          const v = typeof o === 'object' ? o.value : o;
          const l = typeof o === 'object' ? o.label : o;
          return <option key={v} value={v}>{l}</option>;
        })}
      </select>
    </TweakRow>
  );
}

function TweakText({ label, value, placeholder, onChange }) {
  return (
    <TweakRow label={label}>
      <input className="twk-field" type="text" value={value} placeholder={placeholder}
             onChange={(e) => onChange(e.target.value)} />
    </TweakRow>
  );
}

function TweakNumber({ label, value, min, max, step = 1, unit = '', onChange }) {
  const clamp = (n) => {
    if (min != null && n < min) return min;
    if (max != null && n > max) return max;
    return n;
  };
  const startRef = React.useRef({ x: 0, val: 0 });
  const onScrubStart = (e) => {
    e.preventDefault();
    startRef.current = { x: e.clientX, val: value };
    const decimals = (String(step).split('.')[1] || '').length;
    const move = (ev) => {
      const dx = ev.clientX - startRef.current.x;
      const raw = startRef.current.val + dx * step;
      const snapped = Math.round(raw / step) * step;
      onChange(clamp(Number(snapped.toFixed(decimals))));
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  return (
    <div className="twk-num">
      <span className="twk-num-lbl" onPointerDown={onScrubStart}>{label}</span>
      <input type="number" value={value} min={min} max={max} step={step}
             onChange={(e) => onChange(clamp(Number(e.target.value)))} />
      {unit && <span className="twk-num-unit">{unit}</span>}
    </div>
  );
}

// Relative-luminance contrast pick — checkmarks drawn over a swatch need to
// read on both #111 and #fafafa without per-option configuration. Hex input
// only (#rgb / #rrggbb); named or rgb()/hsl() colors fall through to "light".
function __twkIsLight(hex) {
  const h = String(hex).replace('#', '');
  const x = h.length === 3 ? h.replace(/./g, (c) => c + c) : h.padEnd(6, '0');
  const n = parseInt(x.slice(0, 6), 16);
  if (Number.isNaN(n)) return true;
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return r * 299 + g * 587 + b * 114 > 148000;
}

const __TwkCheck = ({ light }) => (
  <svg viewBox="0 0 14 14" aria-hidden="true">
    <path d="M3 7.2 5.8 10 11 4.2" fill="none" strokeWidth="2.2"
          strokeLinecap="round" strokeLinejoin="round"
          stroke={light ? 'rgba(0,0,0,.78)' : '#fff'} />
  </svg>
);

// TweakColor — curated color/palette picker. Each option is either a single
// hex string or an array of 1-5 hex strings; the card adapts — a lone color
// renders solid, a palette renders colors[0] as the hero (left ~2/3) with the
// rest stacked in a sharp column on the right. onChange emits the
// option in the shape it was passed (string stays string, array stays array).
// Without options it falls back to the native color input for back-compat.
function TweakColor({ label, value, options, onChange }) {
  if (!options || !options.length) {
    return (
      <div className="twk-row twk-row-h">
        <div className="twk-lbl"><span>{label}</span></div>
        <input type="color" className="twk-swatch" value={value}
               onChange={(e) => onChange(e.target.value)} />
      </div>
    );
  }
  // Native <input type=color> emits lowercase hex per the HTML spec, so
  // compare case-insensitively. String() guards JSON.stringify(undefined),
  // which returns the primitive undefined (no .toLowerCase).
  const key = (o) => String(JSON.stringify(o)).toLowerCase();
  const cur = key(value);
  return (
    <TweakRow label={label}>
      <div className="twk-chips" role="radiogroup">
        {options.map((o, i) => {
          const colors = Array.isArray(o) ? o : [o];
          const [hero, ...rest] = colors;
          const sup = rest.slice(0, 4);
          const on = key(o) === cur;
          return (
            <button key={i} type="button" className="twk-chip" role="radio"
                    aria-checked={on} data-on={on ? '1' : '0'}
                    aria-label={colors.join(', ')} title={colors.join(' · ')}
                    style={{ background: hero }}
                    onClick={() => onChange(o)}>
              {sup.length > 0 && (
                <span>
                  {sup.map((c, j) => <i key={j} style={{ background: c }} />)}
                </span>
              )}
              {on && <__TwkCheck light={__twkIsLight(hero)} />}
            </button>
          );
        })}
      </div>
    </TweakRow>
  );
}

function TweakButton({ label, onClick, secondary = false }) {
  return (
    <button type="button" className={secondary ? 'twk-btn secondary' : 'twk-btn'}
            onClick={onClick}>{label}</button>
  );
}

Object.assign(window, {
  useTweaks, TweaksPanel, TweakSection, TweakRow,
  TweakSlider, TweakToggle, TweakRadio, TweakSelect,
  TweakText, TweakNumber, TweakColor, TweakButton,
});
})();
(() => {
/* ─── landing-ds.jsx — Yourcast LP Design System ─── */

const T = {
  ink:      '#1c1917',
  charcoal: '#2d2926',
  stone:    '#f0ebe4',
  coral:    '#c4654a',
  cream:    '#faf7f2',
  copper:   '#b08968',
  sage:     '#6b7c6e',
  dark:     '#141210',
  card:     '#1e1b18',
  linen:    '#e8e4dc',
};
const UI = "'Outfit', sans-serif";
const ED = "'Cormorant Garamond', serif";

/* ⚠️ Replace with your Mailchimp embed action URL: */
window.MAILCHIMP_URL = '#';

window.THEMES = {
  light: {
    hero:    { bg: T.cream,    fg: T.charcoal },
    problem: { bg: T.linen,    fg: T.charcoal },
    hiw:     { bg: T.cream,    fg: T.charcoal },
    diff:    { bg: T.stone,    fg: T.charcoal },
    pers:    { bg: T.cream,    fg: T.charcoal },
    faq:     { bg: T.linen,    fg: T.charcoal },
    team:    { bg: T.cream,    fg: T.charcoal },
    pricing: { bg: T.stone,    fg: T.charcoal },
    cta:     { bg: T.charcoal, fg: T.cream    },
    footer:  { bg: T.ink,      fg: T.cream    },
  },
  dark: {
    hero:    { bg: T.cream,    fg: T.charcoal },
    problem: { bg: T.charcoal, fg: T.cream    },
    hiw:     { bg: T.cream,    fg: T.charcoal },
    diff:    { bg: T.dark,     fg: T.cream    },
    pers:    { bg: T.stone,    fg: T.charcoal },
    faq:     { bg: T.cream,    fg: T.charcoal },
    team:    { bg: T.linen,    fg: T.charcoal },
    pricing: { bg: T.dark,     fg: T.cream    },
    cta:     { bg: T.coral,    fg: T.cream    },
    footer:  { bg: T.ink,      fg: T.cream    },
  },
};

/* ── DualVoice Logo ───────────────────────────────────── */
function DualVoiceLogo({ size = 28, fg = T.charcoal }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', lineHeight: 1 }}>
      <span style={{ fontFamily: UI, fontSize: size, fontWeight: 400, color: fg, letterSpacing: '0.01em' }}>your</span>
      <span style={{ fontFamily: ED, fontSize: size * 1.1, fontWeight: 400, fontStyle: 'italic', color: fg, letterSpacing: '0.03em', marginLeft: size * 0.025 }}>cast</span>
    </div>
  );
}

/* ── Phone Frame ─────────────────────────────────────── */
function PhoneFrame({ children, width = 240 }) {
  const h = Math.round(width * 2.1);
  const r = Math.round(width * 0.145);
  const b = Math.round(width * 0.025);
  return (
    <div style={{
      width, height: h, background: '#0c0a08',
      borderRadius: r, border: `${b}px solid #221e1a`,
      boxShadow: '0 28px 72px rgba(0,0,0,0.26), 0 6px 20px rgba(0,0,0,0.14)',
      overflow: 'hidden', flexShrink: 0, position: 'relative',
    }}>
      <div style={{ position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)', width: Math.round(width * 0.35), height: Math.round(width * 0.105), background: '#0c0a08', borderRadius: 999, zIndex: 10, pointerEvents: 'none' }} />
      <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>{children}</div>
    </div>
  );
}

/* ── WaitlistForm ────────────────────────────────────── */
function WaitlistForm({ light = true }) {
  const [email, setEmail] = React.useState('');
  const [done, setDone]   = React.useState(false);

  const btnBg  = light ? T.charcoal : T.cream;
  const btnFg  = light ? T.cream    : T.charcoal;
  const iBg    = light ? 'rgba(45,41,38,0.06)'  : 'rgba(250,247,242,0.1)';
  const iBord  = light ? 'rgba(45,41,38,0.14)'  : 'rgba(250,247,242,0.18)';
  const iFg    = light ? T.charcoal             : T.cream;
  const phCls  = light ? 'yc-ph-light'          : 'yc-ph-dark';
  const micro  = light ? 'rgba(45,41,38,0.4)'   : 'rgba(250,247,242,0.4)';

  const submit = (e) => {
    e.preventDefault();
    if (!email.includes('@')) return;
    setDone(true);
  };

  if (done) return (
    <div style={{ textAlign: 'center', padding: '20px 0' }}>
      <div style={{ fontFamily: ED, fontSize: 22, fontStyle: 'italic', color: light ? T.charcoal : T.cream, marginBottom: 6 }}>You're on the list.</div>
      <div style={{ fontFamily: UI, fontSize: 13, fontWeight: 300, color: micro }}>We'll reach out when we open your spot.</div>
    </div>
  );

  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center', width: '100%' }}>
      <div style={{ display: 'flex', width: '100%', maxWidth: 440, borderRadius: 999, overflow: 'hidden', border: `1px solid ${iBord}`, background: iBg }}>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)}
          placeholder="your@email.com" required
          className={phCls}
          style={{ flex: 1, padding: '13px 20px', background: 'transparent', border: 'none', outline: 'none', fontFamily: UI, fontSize: 14, fontWeight: 300, color: iFg, minWidth: 0 }} />
        <button type="submit"
          style={{ padding: '13px 24px', background: btnBg, color: btnFg, border: 'none', cursor: 'pointer', fontFamily: UI, fontSize: 14, fontWeight: 400, whiteSpace: 'nowrap', flexShrink: 0 }}>
          Join the waitlist
        </button>
      </div>
      <div style={{ fontFamily: UI, fontSize: 12, fontWeight: 300, color: micro }}>Just a launch update once we go live soon.</div>
    </form>
  );
}

/* ── App Screen: Player ──────────────────────────────── */
function ScreenPlayer() {
  const m  = 'rgba(250,247,242,0.35)';
  const ml = 'rgba(250,247,242,0.65)';
  return (
    <div style={{ width: '100%', height: '100%', background: T.dark, display: 'flex', flexDirection: 'column', padding: '46px 17px 17px', boxSizing: 'border-box' }}>
      <div style={{ fontFamily: UI, fontSize: 9, fontWeight: 300, color: m, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 3 }}>Tuesday, 27 May</div>
      <div style={{ fontFamily: UI, fontSize: 16, fontWeight: 300, color: T.cream, marginBottom: 14 }}>Good morning, Daniel.</div>
      <div style={{ background: T.card, borderRadius: 16, overflow: 'hidden', flex: 1 }}>
        <div style={{ height: 76, background: '#201b13', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 70% at 22% 18%, rgba(176,137,104,0.28) 0%, transparent 52%)' }} />
          <div style={{ position: 'absolute', bottom: 12, left: 14 }}>
            <div style={{ fontFamily: UI, fontSize: 7.5, fontWeight: 500, color: T.coral, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Morning Brief</div>
            <div style={{ fontFamily: ED, fontSize: 13.5, fontStyle: 'italic', color: T.cream, lineHeight: 1.3, marginTop: 2 }}>Your daily episode is ready.</div>
          </div>
        </div>
        <div style={{ padding: '10px 13px 13px' }}>
          <div style={{ fontFamily: UI, fontSize: 9, fontWeight: 300, color: m, marginBottom: 7 }}>monologue · newsbeat · <span style={{ color: T.copper }}>18 min</span></div>
          {['Claude 4.7 launches with agentic capabilities', "Karpathy's method goes viral", 'ECB signals rate pause'].map((topic, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginBottom: 5 }}>
              <div style={{ width: 3, height: 3, borderRadius: 2, background: T.coral, marginTop: 4, flexShrink: 0 }} />
              <div style={{ fontFamily: UI, fontSize: 9.5, fontWeight: 300, color: ml, lineHeight: 1.4 }}>{topic}</div>
            </div>
          ))}
          <div style={{ display: 'flex', gap: 7, marginTop: 11 }}>
            <div style={{ flex: 1, height: 34, borderRadius: 999, background: T.coral, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <svg width="7" height="9" viewBox="0 0 7 9" fill="none"><path d="M0.5 0.5L6.5 4.5L0.5 8.5V0.5Z" fill="white"/></svg>
              <span style={{ fontFamily: UI, fontSize: 11.5, fontWeight: 400, color: '#fff' }}>Listen · 18 min</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── App Screen: Topic Picker ────────────────────────── */
function ScreenTopicPicker() {
  const m  = 'rgba(250,247,242,0.35)';
  const ml = 'rgba(250,247,242,0.65)';
  const topics = ['AI & Tech', 'Climate', 'Policy', 'Science', 'Business', 'Culture', 'Philosophy', 'Geopolitics', 'Finance', 'Health'];
  const sel = [0, 1, 2, 6];
  return (
    <div style={{ width: '100%', height: '100%', background: T.dark, padding: '46px 15px 17px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
      <div style={{ fontFamily: UI, fontSize: 8, fontWeight: 500, color: T.coral, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>Step 1 of 3</div>
      <div style={{ fontFamily: ED, fontSize: 17, fontStyle: 'italic', color: T.cream, lineHeight: 1.3, marginBottom: 4 }}>What do you care about?</div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5.5 }}>
        {topics.map((t, i) => (
          <div key={i} style={{ padding: '5px 10px', borderRadius: 999, background: sel.includes(i) ? T.coral : 'rgba(255,255,255,0.07)', border: `1px solid ${sel.includes(i) ? T.coral : 'rgba(255,255,255,0.1)'}` }}>
            <span style={{ fontFamily: UI, fontSize: 9.5, fontWeight: sel.includes(i) ? 400 : 300, color: sel.includes(i) ? '#fff' : ml }}>{t}</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 'auto', paddingTop: 12 }}>
        <div style={{ height: 38, borderRadius: 999, background: T.coral, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontFamily: UI, fontSize: 12, fontWeight: 400, color: '#fff' }}>Continue</span>
        </div>
      </div>
    </div>
  );
}

/* ── App Screen: Episode Ready ───────────────────────── */
function ScreenEpisodeReady() {
  const m  = 'rgba(250,247,242,0.35)';
  const ml = 'rgba(250,247,242,0.65)';
  return (
    <div style={{ width: '100%', height: '100%', background: T.dark, padding: '46px 15px 18px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
      <div style={{ fontFamily: UI, fontSize: 9.5, fontWeight: 300, color: m, marginBottom: 8 }}>Tue, 27 May · 7:02 AM</div>
      <div style={{ fontFamily: ED, fontSize: 24, fontStyle: 'italic', color: T.cream, lineHeight: 1.25, marginBottom: 4 }}>Good morning.</div>
      <div style={{ fontFamily: UI, fontSize: 11.5, fontWeight: 300, color: ml, marginBottom: 24 }}>Your episode is ready.</div>
      <div style={{ width: 64, height: 64, borderRadius: 32, background: T.coral, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, boxShadow: '0 10px 28px rgba(196,101,74,0.4)' }}>
        <svg width="16" height="20" viewBox="0 0 16 20" fill="none"><path d="M1.5 1.5L14.5 10L1.5 18.5V1.5Z" fill="white"/></svg>
      </div>
      <div style={{ fontFamily: UI, fontSize: 13, fontWeight: 400, color: T.cream, marginBottom: 3 }}>Morning Brief</div>
      <div style={{ fontFamily: UI, fontSize: 10, fontWeight: 300, color: m, marginBottom: 20 }}>18 min · 5 stories</div>
      <div style={{ width: '100%', textAlign: 'left' }}>
        {['AI, Climate, Policy', 'Your saved sources', 'Deep dive: ECB'].map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <div style={{ width: 3, height: 3, borderRadius: 2, background: T.coral, flexShrink: 0 }} />
            <div style={{ fontFamily: UI, fontSize: 10, fontWeight: 300, color: ml }}>{s}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── App Screen: Feedback ────────────────────────────── */
function ScreenFeedback() {
  const m  = 'rgba(250,247,242,0.35)';
  const ml = 'rgba(250,247,242,0.65)';
  return (
    <div style={{ width: '100%', height: '100%', background: T.dark, padding: '46px 15px 17px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
      <div style={{ fontFamily: UI, fontSize: 8, fontWeight: 500, color: T.coral, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>Feedback</div>
      <div style={{ fontFamily: ED, fontSize: 15.5, fontStyle: 'italic', color: T.cream, lineHeight: 1.35, marginBottom: 4 }}>How was the Karpathy story?</div>
      <div style={{ fontFamily: UI, fontSize: 10, fontWeight: 300, color: m, marginBottom: 16 }}>Your feedback tunes the next episode.</div>
      <div style={{ display: 'flex', gap: 7, marginBottom: 16 }}>
        <div style={{ flex: 1, height: 38, borderRadius: 999, background: T.coral, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M2.5 4.8L4.5 1.2l1.1.6L4.5 4.6h4.3a.6.6 0 01.6.6v.7l-.6 2.7a1 1 0 01-.9.9H3.7a.6.6 0 01-.6-.6L2.5 4.8z" stroke="white" strokeWidth="1.1"/><rect x="1.2" y="4.5" width="1.7" height="4.8" rx=".85" fill="white"/></svg>
          <span style={{ fontFamily: UI, fontSize: 11, fontWeight: 400, color: '#fff' }}>Loved it</span>
        </div>
        <div style={{ flex: 1, height: 38, borderRadius: 999, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M8.5 6.2L6.5 9.8l-1.1-.6 1.1-2.8H2.2a.6.6 0 01-.6-.6v-.7l.6-2.7A1 1 0 013.1 2H7.3a.6.6 0 01.6.6L8.5 6.2z" stroke="rgba(250,247,242,0.45)" strokeWidth="1.1"/><rect x="8.1" y="1.7" width="1.7" height="4.8" rx=".85" fill="rgba(250,247,242,0.45)"/></svg>
          <span style={{ fontFamily: UI, fontSize: 11, fontWeight: 300, color: ml }}>Skip next</span>
        </div>
      </div>
      <div style={{ fontFamily: UI, fontSize: 9, fontWeight: 300, color: m, marginBottom: 7 }}>More or less like this?</div>
      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
        {['More AI', 'Less politics', 'Shorter', 'More depth'].map((l, i) => (
          <div key={i} style={{ padding: '4px 10px', borderRadius: 999, border: `1px solid ${i === 0 ? T.coral : 'rgba(255,255,255,0.14)'}`, background: i === 0 ? 'rgba(196,101,74,0.18)' : 'transparent' }}>
            <span style={{ fontFamily: UI, fontSize: 9.5, fontWeight: 300, color: i === 0 ? T.coral : ml }}>{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { T, UI, ED, DualVoiceLogo, PhoneFrame, WaitlistForm, ScreenPlayer, ScreenTopicPicker, ScreenEpisodeReady, ScreenFeedback });
})();
(() => {
/* ─── landing-nav.jsx — Fixed Top Navigation ─── */
const { T, UI, DualVoiceLogo } = window;

const NAV_LINKS = [
  { id: 'how-it-works',  label: 'How it works'     },
  { id: 'why-different', label: "Why it's different" },
  { id: 'faq',           label: 'FAQ'               },
  { id: 'team',          label: 'Team'              },
  { id: 'pricing',       label: 'Pricing'           },
];

function TopNav() {
  const [scrolled, setScrolled] = React.useState(false);
  const [active,   setActive]   = React.useState('');

  React.useEffect(() => {
    const ids = ['hero', ...NAV_LINKS.map(l => l.id)];
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      let cur = '';
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 90) cur = id;
      }
      setActive(cur);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const bg     = scrolled ? 'rgba(250,247,242,0.92)' : 'transparent';
  const blur   = scrolled ? 'blur(14px)'             : 'none';
  const shadow = scrolled ? '0 1px 0 rgba(45,41,38,0.09)' : 'none';

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
      height: 64,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 clamp(20px, 3.5vw, 48px)',
      background: bg,
      backdropFilter: blur,
      WebkitBackdropFilter: blur,
      boxShadow: shadow,
      transition: 'background 0.3s ease, box-shadow 0.3s ease',
    }}>

      {/* Logo */}
      <a href="#hero" style={{ textDecoration: 'none', display: 'flex', alignItems: 'baseline' }}>
        <DualVoiceLogo size={26} fg={T.charcoal} />
      </a>

      {/* Links + CTA */}
      <div className="yc-nav-links" style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
        {NAV_LINKS.map(({ id, label }) => (
          <a key={id} href={`#${id}`} style={{
            fontFamily: UI,
            fontSize: 13,
            fontWeight: active === id ? 400 : 300,
            color: active === id ? T.charcoal : 'rgba(45,41,38,0.48)',
            textDecoration: 'none',
            letterSpacing: '0.01em',
            transition: 'color 0.2s ease',
          }}>{label}</a>
        ))}

        <a href="#pricing" style={{
          fontFamily: UI, fontSize: 13, fontWeight: 400,
          color: T.cream, textDecoration: 'none',
          padding: '9px 22px', borderRadius: 999,
          background: T.charcoal,
          transition: 'opacity 0.2s ease',
          flexShrink: 0,
        }}>
          Join waitlist
        </a>
      </div>
    </nav>
  );
}

Object.assign(window, { TopNav });
})();
(() => {
/* ─── landing-s1-sa.jsx — Hero · Problem · How It Works (standalone) ─── */
const { T, UI, ED, DualVoiceLogo, PhoneFrame, WaitlistForm, ScreenPlayer, ScreenTopicPicker, ScreenEpisodeReady, ScreenFeedback } = window;

/* ── Inline waveform (replaces Player.html iframe) ───── */
const BAR_HEIGHTS = [0.28,0.55,0.72,0.38,0.85,0.62,0.91,0.48,0.32,0.67,0.82,0.41,0.74,0.52,0.29,0.63,0.88,0.44,0.71,0.54,0.31,0.79,0.61,0.43,0.57,0.76,0.35,0.93,0.50,0.65,0.40,0.78,0.33,0.84,0.53,0.68,0.45,0.90,0.36,0.70];

function InlineWaveform({ played = 0.38 }) {
  const total = BAR_HEIGHTS.length;
  const splitAt = Math.floor(played * total);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 2, height: 46, width: 256 }}>
      {BAR_HEIGHTS.map((h, i) => {
        const isPlayed = i < splitAt;
        const animDur  = (0.8 + (i % 7) * 0.18).toFixed(2);
        const animDel  = ((i % 11) * 0.07).toFixed(2);
        return (
          <div
            key={i}
            style={{
              flex: 1,
              height: `${h * 100}%`,
              borderRadius: 2,
              background: isPlayed ? 'rgba(196,101,74,0.90)' : 'rgba(250,247,242,0.22)',
              transformOrigin: 'center',
              animation: `waveBar ${animDur}s ease-in-out ${animDel}s infinite`,
            }}
          />
        );
      })}
    </div>
  );
}

/* ══════════════════ SECTION 1: HERO ══════════════════ */
function HeroSection({ th }) {
  return (
    <section style={{ background: th.bg, position: 'relative', overflow: 'hidden', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Copper glow */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 70% at 15% 10%, rgba(176,137,104,0.22) 0%, transparent 55%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 50% 50% at 80% 60%, rgba(196,101,74,0.05) 0%, transparent 55%)', pointerEvents: 'none' }} />

      {/* Two-column layout */}
      <div className="lp-hero-layout" style={{ flex: 1, display: 'flex', alignItems: 'stretch', position: 'relative', zIndex: 1, maxWidth: 1280, width: '100%', margin: '0 auto' }}>

        {/* Left: Text */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 'clamp(20px, 3vw, 48px) clamp(24px, 4vw, 56px) clamp(32px, 5vw, 64px) clamp(24px, 4vw, 48px)' }}>
          {/* Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 18px', borderRadius: 999, border: '1px solid rgba(196,101,74,0.28)', background: 'rgba(196,101,74,0.06)', marginBottom: 28, alignSelf: 'flex-start' }}>
            <div style={{ width: 5, height: 5, borderRadius: 3, background: T.coral }} />
            <span style={{ fontFamily: UI, fontSize: 11, fontWeight: 500, color: T.coral, letterSpacing: '0.09em', textTransform: 'uppercase' }}>Limited early access</span>
          </div>

          {/* H1 */}
          <h1 style={{ fontFamily: ED, fontSize: 'clamp(44px, 5.2vw, 72px)', fontWeight: 400, color: T.charcoal, lineHeight: 1.1, marginBottom: 16, letterSpacing: '-0.01em' }}>
            A podcast no one else<br />will ever hear.
          </h1>

          {/* Subheadline */}
          <p style={{ fontFamily: UI, fontSize: 'clamp(15px, 1.5vw, 17px)', fontWeight: 300, color: 'rgba(45,41,38,0.62)', maxWidth: 400, lineHeight: 1.75, marginBottom: 36 }}>
            Get a private researcher bringing you a daily hyper-personalized podcast with only the things you care about.
          </p>

          {/* Form */}
          <div style={{ maxWidth: 440 }}>
            <WaitlistForm light={true} />
          </div>
        </div>

        {/* Right: Phone — static image */}
        <div className="lp-hero-phone" style={{ width: '48%', maxWidth: 580, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 32px 0 0', position: 'relative', flexShrink: 0 }}>
          <img src="uploads/hero-phone.png" alt="Yourcast player screen" style={{ width: 465, height: 'auto', filter: 'drop-shadow(0 24px 60px rgba(0,0,0,0.15))' }} />
        </div>
      </div>
    </section>);
}

/* ══════════════════ SECTION 2: PROBLEM ══════════════════ */
const PLATFORMS = [
{ img: window.__resources.xIcon,            label: 'X',         count: 24, rot: -2.5 },
{ img: window.__resources.youtubeIcon,      label: 'YouTube',   count: 99, rot: 1.5  },
{ img: window.__resources.redditIcon,       label: 'Reddit',    count: 17, rot: -1   },
{ img: window.__resources.instagramIcon,    label: 'Instagram', count: 43, rot: 2    },
{ img: window.__resources.facebookIcon,     label: 'Facebook',  count: 12, rot: -1.5 },
{ img: window.__resources.mailIcon,         label: 'Mail',      count: 68, rot: 1    },
{ img: window.__resources.rssIcon,          label: 'RSS',       count: 31, rot: -2   },
{ img: window.__resources.substackIcon,     label: 'Substack',  count: 56, rot: 1.8  }];

function PlatformIcon({ img, label, count, rot, isLight }) {
  const boxBg = isLight ? 'rgba(45,41,38,0.06)' : 'rgba(250,247,242,0.08)';
  return (
    <div style={{ position: 'relative', transform: `rotate(${rot}deg)`, flexShrink: 0 }}>
      <div style={{ width: 58, height: 58, borderRadius: 15, background: boxBg, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <img src={img} alt={label} style={{ width: 46, height: 46, objectFit: 'contain', display: 'block' }} />
      </div>
      <div style={{ position: 'absolute', top: -7, right: -6, minWidth: 20, height: 20, borderRadius: 10, background: '#e03a2f', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 5px', boxShadow: '0 2px 6px rgba(224,58,47,0.4)' }}>
        <span style={{ fontFamily: UI, fontSize: 9, fontWeight: 700, color: '#fff' }}>{count}</span>
      </div>
    </div>);
}

function ProblemSection({ th }) {
  const isLight = th.fg === T.charcoal;
  const headColor = th.fg;
  const mutedFg = isLight ? 'rgba(45,41,38,0.58)' : 'rgba(250,247,242,0.62)';
  const emphFg = isLight ? T.charcoal : T.cream;
  return (
    <section style={{ background: th.bg, padding: '96px 24px' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontFamily: ED, fontSize: 'clamp(30px, 5vw, 54px)', fontWeight: 400, color: headColor, lineHeight: 1.18, marginBottom: 20 }}>
          Hundreds of tabs, feeds &amp; newsletters, screaming daily<br /> for your attention.
        </h2>

        <p style={{ fontFamily: UI, fontSize: 'clamp(16px, 2.2vw, 20px)', fontWeight: 400, color: emphFg, marginBottom: 44, lineHeight: 1.5 }}>
          They all have one thing in common:<br />you don't have time for them.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center', marginBottom: 56 }}>
          {PLATFORMS.map((p) => <PlatformIcon key={p.label} {...p} isLight={isLight} />)}
        </div>

        <p style={{ fontFamily: UI, fontSize: 'clamp(14px, 1.9vw, 17px)', fontWeight: 300, color: mutedFg, maxWidth: 520, margin: '0 auto', lineHeight: 1.75 }}>
          What if someone could cut through the noise and deliver only what actually matters — every day, exactly the way you like it?
        </p>
      </div>
    </section>);
}

/* ══════════════ SECTION 3: HOW IT WORKS ══════════════ */
const HIW_STEPS = [
{ n: '01', title: 'Define your areas of interest', body: "What do you want to track? What do you want to learn about? We'll handle the rest.", screen: 'TopicPicker' },
{ n: '02', title: 'We source, filter, and write', body: "AI scans hundreds of sources, cuts the noise, and writes a script tailored to your depth and style.", screen: 'Funnel' },
{ n: '03', title: 'Every morning, hit play', body: "Your unique podcast is ready. One tap and you're listening — no one else gets this episode.", screen: 'EpisodeReady' },
{ n: '04', title: 'You give feedback, we get smarter', body: "Optionally rate episodes or react to segments. The more you tell us, the better your next episode gets.", screen: 'Feedback' }];

function FunnelVisual({ isLight }) {
  const pillBg = isLight ? T.linen : 'rgba(255,255,255,0.06)';
  const pillBord = isLight ? 'rgba(45,41,38,0.12)' : 'rgba(255,255,255,0.1)';
  const pillFg = isLight ? 'rgba(45,41,38,0.55)' : 'rgba(250,247,242,0.55)';
  const cardBg = isLight ? T.stone : T.card;
  const cardFg = isLight ? 'rgba(45,41,38,0.5)' : 'rgba(250,247,242,0.45)';
  const sources = ['RSS feeds', 'Newsletters', 'Semantic Search APIs', 'Data feeds', 'Podcasts'];
  return (
    <div style={{ width: 240, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginBottom: 14 }}>
        {sources.map((s, i) =>
        <div key={i} style={{ padding: '5px 11px', borderRadius: 999, border: `1px solid ${pillBord}`, background: pillBg }}>
            <span style={{ fontFamily: UI, fontSize: 11, fontWeight: 300, color: pillFg }}>{s}</span>
          </div>
        )}
      </div>
      <svg width="48" height="52" viewBox="0 0 48 52" fill="none">
        <path d="M6 8 L42 8 L32 28 L16 28 Z" fill="rgba(196,101,74,0.14)" stroke="rgba(196,101,74,0.45)" strokeWidth="1.4" />
        <line x1="24" y1="28" x2="24" y2="42" stroke="rgba(196,101,74,0.4)" strokeWidth="1.4" strokeDasharray="3 3" />
        <circle cx="24" cy="46" r="4.5" fill={T.coral} opacity="0.75" />
      </svg>
      <div style={{ marginTop: 12, padding: '14px 16px', borderRadius: 14, background: cardBg, border: `1px solid ${pillBord}`, width: '100%' }}>
        <div style={{ fontFamily: UI, fontSize: 8.5, fontWeight: 500, color: T.coral, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 7 }}>Episode script</div>
        {['Story 1 · AI governance update', 'Story 2 · Climate Q2 data', 'Story 3 · Markets briefing'].map((l, i) =>
        <div key={i} style={{ fontFamily: UI, fontSize: 10, fontWeight: 300, color: cardFg, marginBottom: 4, lineHeight: 1.4 }}>{l}</div>
        )}
      </div>
    </div>);
}

function HIWSection({ th }) {
  const isLight = th.fg === T.charcoal;
  const headColor = th.fg;
  const mutedFg = isLight ? 'rgba(45,41,38,0.58)' : 'rgba(250,247,242,0.62)';
  const numFg = isLight ? 'rgba(45,41,38,0.07)' : 'rgba(250,247,242,0.07)';
  const ruleFg = isLight ? 'rgba(45,41,38,0.08)' : 'rgba(250,247,242,0.08)';

  const getVisual = (screen) => {
    if (screen === 'TopicPicker') return <PhoneFrame width={280}><ScreenTopicPicker /></PhoneFrame>;
    if (screen === 'Funnel') return <FunnelVisual isLight={isLight} />;
    if (screen === 'EpisodeReady') return <PhoneFrame width={280}><ScreenEpisodeReady /></PhoneFrame>;
    if (screen === 'Feedback') return <PhoneFrame width={280}><ScreenFeedback /></PhoneFrame>;
    return null;
  };

  return (
    <section style={{ background: th.bg, padding: '96px 24px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <h2 style={{ fontFamily: ED, fontSize: 'clamp(30px, 5vw, 52px)', fontWeight: 400, color: headColor, textAlign: 'center', marginBottom: 68 }}>
          Here's how it works.
        </h2>

        {HIW_STEPS.map((step, i) =>
        <div key={i}>
            <div className="lp-step-row" style={{ display: 'flex', alignItems: 'center', gap: 72, padding: '56px 0' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: UI, fontSize: 'clamp(56px, 9vw, 104px)', fontWeight: 300, color: numFg, lineHeight: 1, marginBottom: 8, letterSpacing: '-0.02em' }}>{step.n}</div>
                <h3 style={{ fontFamily: UI, fontSize: 'clamp(20px, 2.4vw, 26px)', fontWeight: 400, color: headColor, marginBottom: 12, lineHeight: 1.3 }}>{step.title}</h3>
                <p style={{ fontFamily: UI, fontSize: 'clamp(15px, 1.7vw, 17px)', fontWeight: 300, color: mutedFg, lineHeight: 1.75, maxWidth: 460 }}>{step.body}</p>
              </div>
              <div className="lp-step-phone" style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', width: 320 }}>
                {getVisual(step.screen)}
              </div>
            </div>
            {i < HIW_STEPS.length - 1 && <div style={{ height: 1, background: ruleFg }} />}
          </div>
        )}
      </div>
    </section>);
}

Object.assign(window, { HeroSection, ProblemSection, HIWSection });
})();
(() => {
/* ─── landing-s2.jsx — Differentiators · Personalization · FAQ ─── */
const { T, UI, ED, WaitlistForm } = window;

/* ══════════════ SECTION 5: DIFFERENTIATORS ══════════════ */
const DIFF_CARDS = [
{
  title: 'Written, not curated',
  body: 'We don\'t pick from existing podcasts. We write yours from scratch, every day.',
  glyph: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 3L13.5 7.5H18.5L14.5 10.5L16 15L12 12L8 15L9.5 10.5L5.5 7.5H10.5L12 3Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /><path d="M4 19h16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /><path d="M7 22h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
},
{
  title: 'Hyper-personalized, not just topics',
  body: 'Your trusted sources, specific people to follow, angles you care about, depth per topic. Not just what — but how, from whom, and how deep.',
  glyph: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
},
{
  title: 'Multi-source, one place',
  body: 'Pulls from RSS, newsletters, data feeds, semantic search APIs — you stop tab-hopping.',
  glyph: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.4" /><path d="M12 3a9 9 0 010 18M12 3a9 9 0 000 18M3 12h18" stroke="currentColor" strokeWidth="1.4" /></svg>
},
{
  title: 'Production quality',
  body: 'Background music, natural transitions, source citations. Sounds like a real show.',
  glyph: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="9" y="2" width="6" height="12" rx="3" stroke="currentColor" strokeWidth="1.4" /><path d="M5 10a7 7 0 0014 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /><line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /><line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
},
{
  title: 'Target semantic matching',
  body: "We don't look just for keywords or aggregate your favourite feeds. We understand what you told us about your interests and, as your private researcher, we find relevant and inter-connected topics or issues you should know about.",
  glyph: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.4" /><path d="M20 20l-3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /><path d="M8 11h6M11 8v6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
}];


function DifferentiatorsSection({ th }) {
  const isLight = th.fg === T.charcoal;
  const headColor = th.fg;
  const cardBg = isLight ? T.cream : 'rgba(250,247,242,0.04)';
  const cardBord = isLight ? 'rgba(45,41,38,0.1)' : 'rgba(250,247,242,0.08)';
  const iconFg = T.coral;
  const titleFg = th.fg;
  const bodyFg = isLight ? 'rgba(45,41,38,0.58)' : 'rgba(250,247,242,0.62)';
  const superFg = isLight ? 'rgba(45,41,38,0.35)' : 'rgba(250,247,242,0.35)';

  return (
    <section id="why-different" style={{ background: th.bg, padding: '96px 24px' }}>
      <div style={{ maxWidth: 1020, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ fontFamily: UI, fontSize: 11, fontWeight: 300, color: superFg, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 14 }}>What makes this different</div>
          <h2 style={{ fontFamily: ED, fontSize: 'clamp(26px, 4.5vw, 48px)', fontWeight: 400, color: headColor, lineHeight: 1.18, maxWidth: 960, margin: '0 auto', display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '0.25em', flexWrap: 'wrap' }}>
            <DualVoiceLogo size={42} fg={headColor} />
            <span>is not another AI summary tool. Or aggregator.</span>
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 18 }}>
          {DIFF_CARDS.map((card, i) => {
            const gridColumn = i < 3 ? 'span 2' : (i === 3 ? '2 / 4' : '4 / 6');
            return (
          <div key={i} style={{ gridColumn, padding: '32px 28px', borderRadius: 20, background: cardBg, border: `1px solid ${cardBord}` }}>
              <div style={{ color: iconFg, marginBottom: 18, opacity: 0.85 }}>{card.glyph}</div>
              <div style={{ fontFamily: UI, fontSize: 17, fontWeight: 400, color: titleFg, marginBottom: 10, lineHeight: 1.3 }}>{card.title}</div>
              <div style={{ fontFamily: UI, fontSize: 15, fontWeight: 300, color: bodyFg, lineHeight: 1.72 }}>{card.body}</div>
            </div>
            );
          })}
        </div>
        <div style={{ paddingTop: 56, maxWidth: 440, margin: '0 auto' }}>
          <WaitlistForm light={isLight} />
        </div>
      </div>
    </section>);

}

/* ══════════════ SECTION 6: PERSONALIZATION ══════════════ */
const PERS_GROUPS = [
{ label: 'Content', sub: 'what you hear', tags: ['Topics', 'Sources', 'Depth', 'Niche level', 'Serendipity', 'Recency', 'Diversity'] },
{ label: 'Shape', sub: 'how it\'s structured', tags: ['Format', 'Segment length', 'Perspectives', 'Transitions', 'Narrative style', 'Pacing'] },
{ label: 'Delivery', sub: 'how it sounds', tags: ['Voice', 'Energy', 'Warmth', 'Humor', 'Formality', 'Music style'] }];


function PersTag({ label, delay, isLight }) {
  const bg = isLight ? T.linen : 'rgba(255,255,255,0.07)';
  const bord = isLight ? 'rgba(45,41,38,0.11)' : 'rgba(250,247,242,0.1)';
  const fg = isLight ? 'rgba(45,41,38,0.7)' : 'rgba(250,247,242,0.7)';
  const dur = (2.6 + delay % 6 * 0.35).toFixed(2);
  const del = (delay * 0.17).toFixed(2);
  return (
    <div style={{
      display: 'inline-block',
      padding: '7px 16px', borderRadius: 999,
      background: bg, border: `1px solid ${bord}`,
      animation: `pillDrift ${dur}s ease-in-out ${del}s infinite`
    }}>
      <span style={{ fontFamily: UI, fontSize: 13, fontWeight: 300, color: fg }}>{label}</span>
    </div>);

}

function PersonalizationSection({ th }) {
  const isLight = th.fg === T.charcoal;
  const headColor = th.fg;
  const mutedFg = isLight ? 'rgba(45,41,38,0.55)' : 'rgba(250,247,242,0.55)';
  const ruleFg = isLight ? 'rgba(45,41,38,0.08)' : 'rgba(250,247,242,0.08)';
  const labelFg = isLight ? T.charcoal : T.cream;

  return (
    <section style={{ background: th.bg, padding: '96px 24px' }}>
      <div style={{ maxWidth: 740, margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontFamily: ED, fontSize: 'clamp(26px, 4.5vw, 48px)', fontWeight: 400, color: headColor, lineHeight: 1.18, marginBottom: 14 }}>
          We don't personalize.<br />We hyper-personalize.
        </h2>
        <p style={{ fontFamily: UI, fontSize: 'clamp(16px, 2vw, 18px)', fontWeight: 400, color: headColor, marginBottom: 10, lineHeight: 1.5 }}>

        </p>
        <p style={{ fontFamily: UI, fontSize: 15, fontWeight: 300, color: mutedFg, marginBottom: 56, lineHeight: 1.72, maxWidth: 500, margin: '0 auto 56px' }}>No knobs, no settings pages. Just tell us what you care about
The system figures out the rest.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 0, textAlign: 'left' }}>
          {PERS_GROUPS.map((g, gi) =>
          <div key={gi}>
              <div style={{ padding: '32px 0' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 18 }}>
                  <span style={{ fontFamily: UI, fontSize: 13, fontWeight: 500, color: labelFg, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{g.label}</span>
                  <span style={{ fontFamily: UI, fontSize: 13, fontWeight: 300, color: mutedFg }}>{g.sub}</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {g.tags.map((tag, ti) => <PersTag key={ti} label={tag} delay={gi * 8 + ti} isLight={isLight} />)}
                </div>
              </div>
              {gi < PERS_GROUPS.length - 1 && <div style={{ height: 1, background: ruleFg }} />}
            </div>
          )}
        </div>

        <p style={{ fontFamily: UI, fontSize: 15, fontWeight: 300, color: mutedFg, marginTop: 48, lineHeight: 1.75 }}>
          All of this adapts automatically as you listen.<br />
          <span style={{ fontWeight: 400, color: headColor }}>You just press play.</span>
        </p>
        <div style={{ paddingTop: 52, maxWidth: 440, margin: '0 auto' }}>
          <WaitlistForm light={isLight} />
        </div>
      </div>
    </section>);

}

/* ══════════════════ SECTION 8: FAQ ══════════════════ */
const FAQ_ITEMS = [
{
  q: 'Is this just AI-generated slop?',
  a: 'No. We use premium voice synthesis, music production, and source-cited scripts. Every story links to its original source. It\'s built to sound like a human-produced show — not a robot reading articles.'
},
{
  q: 'Why can\'t I just do this with ChatGPT?',
  a: 'You could summarize one article. But real-time multi-source target semantic matching, daily automation, production-quality audio, and a system that learns your preferences over weeks?\nThat\'s a pipeline, not a prompt. And that\'s what differs between an on-demand summarizer and your personal & automated research assistant.'
},
{
  q: 'What sources does it use?',
  a: 'Hundreds of RSS feeds, newsletters, semantic search APIs, and data feeds. You can also request specific sources or people to track.'
},
{
  q: 'How long are the episodes?',
  a: 'In the beginning, it will be fixed for around 6 minutes. Ultimately we want you to decide, from 2-minute headline scans to ~20-minute deep dives.'
},
{
  q: 'When is launch?',
  a: 'We\'re in private beta now. Join the waitlist and we\'ll invite you as spots open.'
}];


function FAQItem({ item, isOpen, onToggle, isLight }) {
  const headFg = isLight ? T.charcoal : T.cream;
  const bodyFg = isLight ? 'rgba(45,41,38,0.6)' : 'rgba(250,247,242,0.62)';
  const ruleFg = isLight ? 'rgba(45,41,38,0.1)' : 'rgba(250,247,242,0.1)';
  const iconFg = isLight ? 'rgba(45,41,38,0.35)' : 'rgba(250,247,242,0.35)';
  return (
    <div style={{ borderTop: `1px solid ${ruleFg}` }}>
      <button onClick={onToggle} style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '22px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, textAlign: 'left' }}>
        <span style={{ fontFamily: UI, fontSize: 'clamp(15px, 1.8vw, 17px)', fontWeight: 400, color: headFg, lineHeight: 1.4 }}>{item.q}</span>
        <span style={{ fontFamily: UI, fontSize: 22, fontWeight: 200, color: iconFg, flexShrink: 0, display: 'inline-block', transform: isOpen ? 'rotate(45deg)' : 'none', transition: 'transform 0.22s ease' }}>+</span>
      </button>
      {isOpen &&
      <div style={{ paddingBottom: 24 }}>
          <p style={{ fontFamily: UI, fontSize: 15, fontWeight: 300, color: bodyFg, lineHeight: 1.78, whiteSpace: 'pre-line' }}>{item.a}</p>
        </div>
      }
    </div>);

}

function FAQSection({ th }) {
  const isLight = th.fg === T.charcoal;
  const headColor = th.fg;
  const ruleFg = isLight ? 'rgba(45,41,38,0.1)' : 'rgba(250,247,242,0.1)';
  const [openIdx, setOpenIdx] = React.useState(null);
  return (
    <section id="faq" style={{ background: th.bg, padding: '96px 24px' }}>
      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        <h2 style={{ fontFamily: ED, fontSize: 'clamp(28px, 4.5vw, 48px)', fontWeight: 400, color: headColor, textAlign: 'center', marginBottom: 52 }}>
          Questions? We got you.
        </h2>
        {FAQ_ITEMS.map((item, i) =>
        <FAQItem key={i} item={item} isOpen={openIdx === i} onToggle={() => setOpenIdx(openIdx === i ? null : i)} isLight={isLight} />
        )}
        <div style={{ height: 1, background: ruleFg }} />
      </div>
    </section>);

}

Object.assign(window, { DifferentiatorsSection, PersonalizationSection, FAQSection });})();
(() => {
/* ─── landing-s3-sa.jsx — Team · Pricing · Final CTA · Footer (standalone) ─── */
const { T, UI, ED, WaitlistForm, DualVoiceLogo } = window;

/* ══════════════════ SECTION 9: TEAM ══════════════════ */
const TEAM = [
  {
    name: 'Daniel Woźniak',
    role: 'Product & Design',
    bio:  'Podcast & news junkie, fighting daily with his FOMO while trying to understand what is really going on around the world.',
    photo: window.__resources.team1Photo,
    linkedin: 'https://www.linkedin.com/in/daniel-a-wozniak',
    initials: null,
  },
  {
    name: 'Bartek Krawczyk',
    role: 'AI & Engineering',
    bio:  'Crazy about building difficult things — but even crazier about the quality of what we want to deliver for you.',
    photo: window.__resources.team2Photo,
    linkedin: 'https://www.linkedin.com/in/bart-krawczyk/',
    initials: null,
  },
];

function LinkedInIcon({ color }) {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <rect width="15" height="15" rx="3" fill={color}/>
      <rect x="2.5" y="5.5" width="2" height="7" fill="white"/>
      <circle cx="3.5" cy="3.5" r="1.2" fill="white"/>
      <path d="M7 5.5h2v1.2c.4-.8 1.2-1.4 2.2-1.4C13 5.3 13 6.8 13 8v4.5h-2V8.5c0-.8-.1-1.8-1.2-1.8-1.2 0-1.3.9-1.3 1.8V12.5H7V5.5z" fill="white"/>
    </svg>
  );
}

function TeamCard({ person, isLight }) {
  const cardBg   = isLight ? T.linen  : 'rgba(250,247,242,0.04)';
  const cardBord = isLight ? 'rgba(45,41,38,0.1)'  : 'rgba(250,247,242,0.08)';
  const nameFg   = isLight ? T.charcoal : T.cream;
  const roleFg   = T.copper;
  const bioFg    = isLight ? 'rgba(45,41,38,0.58)' : 'rgba(250,247,242,0.62)';
  const linkFg   = isLight ? 'rgba(45,41,38,0.38)' : 'rgba(250,247,242,0.38)';

  return (
    <div style={{ flex: '1 1 300px', padding: '36px 32px', borderRadius: 24, background: cardBg, border: `1px solid ${cardBord}`, display: 'flex', flexDirection: 'column' }}>
      <div style={{ width: 72, height: 72, borderRadius: 36, overflow: 'hidden', marginBottom: 20, background: T.copper, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {person.photo ? (
          <img src={person.photo} alt={person.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 15%' }} />
        ) : (
          <span style={{ fontFamily: UI, fontSize: 22, fontWeight: 300, color: 'rgba(250,247,242,0.9)' }}>{person.initials}</span>
        )}
      </div>
      <div style={{ fontFamily: UI, fontSize: 18, fontWeight: 400, color: nameFg, marginBottom: 4 }}>{person.name}</div>
      <div style={{ fontFamily: UI, fontSize: 11, fontWeight: 500, color: roleFg, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>{person.role}</div>
      <div style={{ fontFamily: UI, fontSize: 15, fontWeight: 300, color: bioFg, lineHeight: 1.72, flex: 1 }}>{person.bio}</div>
      {person.linkedin && (
        <a href={person.linkedin} target="_blank" rel="noopener noreferrer"
          style={{ marginTop: 20, display: 'inline-flex', alignItems: 'center', gap: 7, textDecoration: 'none' }}>
          <LinkedInIcon color={linkFg} />
          <span style={{ fontFamily: UI, fontSize: 12, fontWeight: 300, color: linkFg }}>LinkedIn</span>
        </a>
      )}
    </div>
  );
}

function TeamSection({ th }) {
  const isLight   = th.fg === T.charcoal;
  const headColor = th.fg;
  return (
    <section style={{ background: th.bg, padding: '96px 24px' }}>
      <div style={{ maxWidth: 840, margin: '0 auto' }}>
        <h2 style={{ fontFamily: ED, fontSize: 'clamp(28px, 4.5vw, 48px)', fontWeight: 400, color: headColor, textAlign: 'center', marginBottom: 52 }}>
          Built by people who get it.
        </h2>
        <div style={{ display: 'flex', gap: 22, flexWrap: 'wrap' }}>
          {TEAM.map((p, i) => <TeamCard key={i} person={p} isLight={isLight} />)}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════ SECTION 10: PRICING ══════════════════ */
function CheckItem({ label, fg, accent }) {
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, marginTop: 3 }}>
        <circle cx="7" cy="7" r="6.5" stroke={accent} strokeWidth="1"/>
        <path d="M4.2 7l2.1 2.1 3.5-3.7" stroke={accent} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span style={{ fontFamily: UI, fontSize: 14, fontWeight: 300, color: fg, lineHeight: 1.55 }}>{label}</span>
    </div>
  );
}

function PricingSection({ th }) {
  const isLight  = th.fg === T.charcoal;
  const headFg   = th.fg;
  const card1Bg  = isLight ? T.cream : 'rgba(250,247,242,0.04)';
  const card2Bg  = isLight ? T.linen : 'rgba(250,247,242,0.02)';
  const textFg   = isLight ? T.charcoal : T.cream;
  const mutedFg  = isLight ? 'rgba(45,41,38,0.52)' : 'rgba(250,247,242,0.52)';
  const ghostBg  = isLight ? 'rgba(45,41,38,0.06)'  : 'rgba(250,247,242,0.06)';
  const ghostFg  = isLight ? 'rgba(45,41,38,0.45)'  : 'rgba(250,247,242,0.45)';
  const ghostBord = isLight ? 'rgba(45,41,38,0.12)'  : 'rgba(250,247,242,0.12)';

  return (
    <section style={{ background: th.bg, padding: '96px 24px' }}>
      <div style={{ maxWidth: 840, margin: '0 auto' }}>
        <h2 style={{ fontFamily: ED, fontSize: 'clamp(28px, 4.5vw, 48px)', fontWeight: 400, color: headFg, textAlign: 'center', marginBottom: 52 }}>
          Early access is free.
        </h2>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 320px', padding: '36px 32px', borderRadius: 24, background: card1Bg, border: `1.5px solid ${T.coral}`, display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontFamily: UI, fontSize: 11, fontWeight: 500, color: T.coral, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Closed Beta</div>
            <div style={{ fontFamily: ED, fontSize: 52, fontStyle: 'italic', fontWeight: 400, color: textFg, lineHeight: 1, marginBottom: 6 }}>Free</div>
            <div style={{ fontFamily: UI, fontSize: 13, fontWeight: 300, color: mutedFg, marginBottom: 28, lineHeight: 1.55 }}>In exchange for your feedback.</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32, flex: 1 }}>
              {['Full personalized podcast experience', 'All sources', 'Preference learning', 'Daily delivery'].map((f, i) => (
                <CheckItem key={i} label={f} fg={textFg} accent={T.coral} />
              ))}
            </div>
            <WaitlistForm light={isLight} />
          </div>
          <div style={{ flex: '1 1 320px', padding: '36px 32px', borderRadius: 24, background: card2Bg, border: `1px solid ${ghostBord}`, display: 'flex', flexDirection: 'column', opacity: 0.7 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <div style={{ fontFamily: UI, fontSize: 11, fontWeight: 500, color: mutedFg, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Premium</div>
              <div style={{ padding: '2px 9px', borderRadius: 999, background: ghostBg }}>
                <span style={{ fontFamily: UI, fontSize: 10, fontWeight: 400, color: ghostFg }}>Coming soon</span>
              </div>
            </div>
            <div style={{ fontFamily: ED, fontSize: 52, fontStyle: 'italic', fontWeight: 400, color: textFg, lineHeight: 1, marginBottom: 6 }}>TBD</div>
            <div style={{ fontFamily: UI, fontSize: 13, fontWeight: 300, color: mutedFg, marginBottom: 28, lineHeight: 1.55 }}>Everything in Beta, plus:</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32, flex: 1 }}>
              {['Longer episodes', 'Multiple daily casts', 'Multiple podcasts with different cadence & vibe'].map((f, i) => (
                <CheckItem key={i} label={f} fg={textFg} accent={mutedFg} />
              ))}
            </div>
            <div style={{ height: 48, borderRadius: 999, border: `1px solid ${ghostBord}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <span style={{ fontFamily: UI, fontSize: 14, fontWeight: 300, color: ghostFg }}>Notify me when available</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════ SECTION 11: FINAL CTA ══════════════════ */
function FinalCTASection({ th }) {
  const isLight   = th.fg === T.charcoal;
  const headColor = th.fg;
  return (
    <section style={{ background: th.bg, padding: '120px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(250,247,242,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ maxWidth: 580, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <h2 style={{ fontFamily: ED, fontSize: 'clamp(32px, 5.5vw, 60px)', fontWeight: 400, color: headColor, lineHeight: 1.14, marginBottom: 40 }}>
          Your personalized podcast<br />is waiting.
        </h2>
        <WaitlistForm light={isLight} />
      </div>
    </section>
  );
}

/* ══════════════════ SECTION 12: FOOTER ══════════════════ */
function FooterSection({ th }) {
  const fadeFg = 'rgba(250,247,242,0.3)';
  return (
    <footer style={{ background: th.bg, padding: '36px 40px', borderTop: '1px solid rgba(250,247,242,0.06)' }}>
      <div style={{ maxWidth: 1020, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <DualVoiceLogo size={20} fg="rgba(250,247,242,0.65)" />
        <div style={{ fontFamily: UI, fontSize: 12, fontWeight: 300, color: fadeFg }}>Built by Bartek &amp; Daniel</div>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <a href="#" style={{ fontFamily: UI, fontSize: 12, fontWeight: 300, color: fadeFg, textDecoration: 'none' }}>Privacy Policy</a>
          <a href="#" style={{ fontFamily: UI, fontSize: 12, fontWeight: 300, color: fadeFg, textDecoration: 'none' }}>Contact</a>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, { TeamSection, PricingSection, FinalCTASection, FooterSection });
})();
(() => {
/* ─── landing-app.jsx — Main App + Tweaks ─── */
const { useTweaks, TweaksPanel, TweakSection, TweakRadio } = window;
const { THEMES } = window;
const { TopNav } = window;
const { HeroSection, ProblemSection, HIWSection } = window;
const { DifferentiatorsSection, PersonalizationSection, FAQSection } = window;
const { TeamSection, PricingSection, FinalCTASection, FooterSection } = window;

function LandingApp() {
  const theme = THEMES.dark;

  return (
    <div>
      <TopNav />
      <HeroSection           th={theme.hero}    />
      <ProblemSection        th={theme.problem} />
      <HIWSection            th={theme.hiw}     />
      <DifferentiatorsSection th={theme.diff}   />
      <PersonalizationSection th={theme.pers}   />
      <FAQSection            th={theme.faq}     />
      <TeamSection           th={theme.team}    />
      <PricingSection        th={theme.pricing} />
      <FinalCTASection       th={theme.cta}     />
      <FooterSection         th={theme.footer}  />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<LandingApp />);
})();
