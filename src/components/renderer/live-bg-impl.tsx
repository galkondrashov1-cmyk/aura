"use client";

import { useEffect, useRef } from "react";

/* Animated page backgrounds. One canvas, one rAF loop, colors read from the
   page's own CSS variables (so every effect follows the chosen palette).
   Frugal by design: capped pixel ratio, half-resolution shaders, paused when
   the tab is hidden or the page is scrolled away, a single still frame for
   reduced-motion visitors. */

type RGB = [number, number, number];
type Palette = { a: RGB; b: RGB; ink: RGB; light: boolean };

function toRgb(color: string, fallback: RGB): RGB {
  const c = document.createElement("canvas");
  c.width = c.height = 1;
  const x = c.getContext("2d");
  if (!x || !color) return fallback;
  x.fillStyle = "#000";
  x.fillStyle = color.trim();
  x.fillRect(0, 0, 1, 1);
  const d = x.getImageData(0, 0, 1, 1).data;
  return [d[0], d[1], d[2]];
}

function readPalette(el: HTMLElement): Palette {
  const cs = getComputedStyle(el);
  const a = toRgb(cs.getPropertyValue("--primary"), [0, 229, 160]);
  const b = toRgb(cs.getPropertyValue("--fx-c2") || cs.getPropertyValue("--accent"), [168, 85, 247]);
  const ink = toRgb(cs.getPropertyValue("--fx-ink"), [255, 255, 255]);
  return { a, b, ink, light: ink[0] < 128 };
}

const rgba = (c: RGB, a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

type Scene2D = {
  init: (w: number, h: number) => void;
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number, t: number, dt: number) => void;
};

type Pointer = { x: number; y: number; active: boolean };

function makeScene(variant: string, pal: Palette, ptr: Pointer): Scene2D | null {
  const rnd = (a: number, b: number) => a + Math.random() * (b - a);

  switch (variant) {
    case "particles": {
      let ps: { x: number; y: number; vx: number; vy: number }[] = [];
      return {
        init: (w, h) => {
          const n = Math.min(90, Math.round((w * h) / 9000));
          ps = Array.from({ length: n }, () => ({ x: rnd(0, w), y: rnd(0, h), vx: rnd(-0.25, 0.25), vy: rnd(-0.25, 0.25) }));
        },
        draw: (ctx, w, h) => {
          ctx.clearRect(0, 0, w, h);
          const R = 120;
          for (const p of ps) {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > w) p.vx *= -1;
            if (p.y < 0 || p.y > h) p.vy *= -1;
          }
          for (let i = 0; i < ps.length; i++) {
            const p = ps[i];
            for (let j = i + 1; j < ps.length; j++) {
              const q = ps[j];
              const d = Math.hypot(p.x - q.x, p.y - q.y);
              if (d < R) {
                ctx.strokeStyle = rgba(pal.a, (1 - d / R) * 0.35);
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(q.x, q.y);
                ctx.stroke();
              }
            }
            if (ptr.active) {
              const d = Math.hypot(p.x - ptr.x, p.y - ptr.y);
              if (d < 170) {
                ctx.strokeStyle = rgba(pal.b, (1 - d / 170) * 0.6);
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(ptr.x, ptr.y);
                ctx.stroke();
                p.x += (ptr.x - p.x) * 0.004;
                p.y += (ptr.y - p.y) * 0.004;
              }
            }
            ctx.fillStyle = rgba(pal.ink, 0.75);
            ctx.beginPath();
            ctx.arc(p.x, p.y, 1.7, 0, Math.PI * 2);
            ctx.fill();
          }
        },
      };
    }
    case "fireflies": {
      let fs: { x: number; y: number; r: number; s: number; o: number; c: RGB }[] = [];
      return {
        init: (w, h) => {
          fs = Array.from({ length: Math.min(46, Math.round((w * h) / 22000) + 14) }, () => ({
            x: rnd(0, w),
            y: rnd(0, h),
            r: rnd(1.2, 2.8),
            s: rnd(0.2, 0.7),
            o: rnd(0, Math.PI * 2),
            c: Math.random() < 0.5 ? pal.a : pal.b,
          }));
        },
        draw: (ctx, w, h, t) => {
          ctx.clearRect(0, 0, w, h);
          ctx.globalCompositeOperation = pal.light ? "source-over" : "lighter";
          for (const f of fs) {
            f.x += Math.cos(t * 0.0004 * f.s * 3 + f.o) * f.s;
            f.y += Math.sin(t * 0.0003 * f.s * 3 + f.o * 2) * f.s - 0.08;
            if (f.y < -20) f.y = h + 20;
            if (f.x < -20) f.x = w + 20;
            if (f.x > w + 20) f.x = -20;
            const flick = 0.45 + 0.55 * Math.sin(t * 0.003 * f.s + f.o) ** 2;
            const g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r * 9);
            g.addColorStop(0, rgba(f.c, 0.9 * flick));
            g.addColorStop(1, rgba(f.c, 0));
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(f.x, f.y, f.r * 9, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.globalCompositeOperation = "source-over";
        },
      };
    }
    case "snow": {
      let fl: { x: number; y: number; r: number; v: number; o: number }[] = [];
      return {
        init: (w, h) => {
          fl = Array.from({ length: Math.min(170, Math.round((w * h) / 6000)) }, () => ({
            x: rnd(0, w),
            y: rnd(0, h),
            r: rnd(0.8, 3.2),
            v: rnd(0.3, 1.1),
            o: rnd(0, 100),
          }));
        },
        draw: (ctx, w, h, t) => {
          ctx.clearRect(0, 0, w, h);
          for (const f of fl) {
            f.y += f.v;
            f.x += Math.sin(t * 0.0012 + f.o) * 0.45;
            if (f.y > h + 5) {
              f.y = -5;
              f.x = rnd(0, w);
            }
            ctx.fillStyle = rgba(pal.ink, 0.35 + f.r * 0.15);
            ctx.beginPath();
            ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
            ctx.fill();
          }
        },
      };
    }
    case "bubbles": {
      let bs: { x: number; y: number; r: number; v: number; o: number; c: RGB }[] = [];
      const spawn = (w: number, h: number, anywhere: boolean) => ({
        x: rnd(0, w),
        y: anywhere ? rnd(0, h) : h + rnd(10, 80),
        r: rnd(6, 26),
        v: rnd(0.25, 0.8),
        o: rnd(0, 100),
        c: Math.random() < 0.5 ? pal.a : pal.b,
      });
      return {
        init: (w, h) => {
          bs = Array.from({ length: Math.min(30, Math.round((w * h) / 30000) + 10) }, () => spawn(w, h, true));
        },
        draw: (ctx, w, h, t) => {
          ctx.clearRect(0, 0, w, h);
          bs.forEach((b, i) => {
            b.y -= b.v;
            b.x += Math.sin(t * 0.001 + b.o) * 0.35;
            if (b.y < -40) bs[i] = spawn(w, h, false);
            ctx.strokeStyle = rgba(b.c, 0.5);
            ctx.lineWidth = 1.2;
            ctx.fillStyle = rgba(b.c, 0.07);
            ctx.beginPath();
            ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = rgba(pal.ink, 0.35);
            ctx.beginPath();
            ctx.arc(b.x - b.r * 0.35, b.y - b.r * 0.35, b.r * 0.18, 0, Math.PI * 2);
            ctx.fill();
          });
        },
      };
    }
    case "waves": {
      return {
        init: () => {},
        draw: (ctx, w, h, t) => {
          ctx.clearRect(0, 0, w, h);
          const layers: [RGB, number, number, number, number][] = [
            [pal.b, 0.16, 0.62, 28, 0.00035],
            [pal.a, 0.18, 0.7, 22, -0.0005],
            [pal.a, 0.28, 0.8, 16, 0.0007],
          ];
          for (const [c, alpha, base, amp, sp] of layers) {
            ctx.fillStyle = rgba(c, alpha);
            ctx.beginPath();
            ctx.moveTo(0, h);
            for (let x = 0; x <= w; x += 8) {
              const y = h * base + Math.sin(x * 0.012 + t * sp) * amp + Math.sin(x * 0.005 - t * sp * 0.7) * amp * 0.8;
              ctx.lineTo(x, y);
            }
            ctx.lineTo(w, h);
            ctx.closePath();
            ctx.fill();
          }
        },
      };
    }
    case "confetti": {
      const colors: RGB[] = [pal.a, pal.b, [251, 191, 36], [244, 114, 182], [96, 165, 250]];
      let cs: { x: number; y: number; w: number; h: number; v: number; r: number; vr: number; o: number; c: RGB }[] = [];
      return {
        init: (w, h) => {
          cs = Array.from({ length: Math.min(80, Math.round((w * h) / 12000) + 20) }, () => ({
            x: rnd(0, w),
            y: rnd(-h, h),
            w: rnd(5, 9),
            h: rnd(8, 14),
            v: rnd(0.4, 1.2),
            r: rnd(0, Math.PI),
            vr: rnd(-0.03, 0.03),
            o: rnd(0, 100),
            c: colors[Math.floor(rnd(0, colors.length))],
          }));
        },
        draw: (ctx, w, h, t) => {
          ctx.clearRect(0, 0, w, h);
          for (const p of cs) {
            p.y += p.v;
            p.x += Math.sin(t * 0.0015 + p.o) * 0.6;
            p.r += p.vr;
            if (p.y > h + 20) {
              p.y = -20;
              p.x = rnd(0, w);
            }
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.r);
            ctx.scale(1, Math.cos(t * 0.004 + p.o));
            ctx.fillStyle = rgba(p.c, 0.85);
            ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
            ctx.restore();
          }
        },
      };
    }
    case "warp": {
      let ss: { x: number; y: number; z: number; pz: number }[] = [];
      return {
        init: (w) => {
          ss = Array.from({ length: 220 }, () => ({ x: rnd(-w, w), y: rnd(-w, w), z: rnd(1, w), pz: 0 }));
          ss.forEach((s) => (s.pz = s.z));
        },
        draw: (ctx, w, h) => {
          ctx.fillStyle = pal.light ? "rgba(255,255,255,0.25)" : "rgba(4,5,10,0.28)";
          ctx.fillRect(0, 0, w, h);
          const cx = w / 2;
          const cy = h * 0.4;
          for (const s of ss) {
            s.pz = s.z;
            s.z -= 7;
            if (s.z < 1) {
              s.z = w;
              s.pz = s.z;
              s.x = rnd(-w, w);
              s.y = rnd(-w, w);
            }
            const sx = cx + (s.x / s.z) * w * 0.5;
            const sy = cy + (s.y / s.z) * w * 0.5;
            const px = cx + (s.x / s.pz) * w * 0.5;
            const py = cy + (s.y / s.pz) * w * 0.5;
            const k = 1 - s.z / w;
            ctx.strokeStyle = rgba(k > 0.7 ? pal.a : pal.ink, k);
            ctx.lineWidth = k * 2.2;
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(sx, sy);
            ctx.stroke();
          }
        },
      };
    }
  }
  return null;
}

const VERT = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;
const FRAG_HEAD = `precision mediump float;uniform vec2 u_res;uniform float u_t;uniform vec3 u_a;uniform vec3 u_b;uniform vec3 u_c;`;
const SHADERS: Record<string, string> = {
  liquid: `${FRAG_HEAD}
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.-2.*f);
return mix(mix(h(i),h(i+vec2(1.,0.)),u.x),mix(h(i+vec2(0.,1.)),h(i+vec2(1.,1.)),u.x),u.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n(p);p*=2.;a*=.5;}return v;}
void main(){vec2 uv=gl_FragCoord.xy/u_res;vec2 p=uv*vec2(u_res.x/u_res.y,1.)*1.7;float t=u_t*.07;
vec2 q=vec2(fbm(p+t),fbm(p+vec2(5.2,1.3)-t));
vec2 r=vec2(fbm(p+3.*q+vec2(1.7,9.2)+t*1.4),fbm(p+3.*q+vec2(8.3,2.8)-t));
float f=fbm(p+3.*r);
vec3 col=mix(u_c,u_a,clamp(f*f*1.5,0.,.7));
col=mix(col,u_b,clamp(length(q)*.8-.35,0.,.55));
col*=.42+.38*f;
gl_FragColor=vec4(col,1.);}`,
  silk: `${FRAG_HEAD}
void main(){vec2 p=(gl_FragCoord.xy*2.-u_res)/min(u_res.x,u_res.y);float t=u_t*.22;
for(float i=1.;i<6.;i++){p.x+=.32/i*sin(i*2.4*p.y+t+i*.7);p.y+=.3/i*cos(i*1.7*p.x+t*.8);}
float s=.5+.5*sin(p.x*2.1+p.y*1.4);
float sheen=pow(s,7.);
vec3 col=mix(u_c,u_a,s*.55);
col+=u_b*sheen*.4;
col*=.62;
gl_FragColor=vec4(col,1.);}`,
};

function startShader(canvas: HTMLCanvasElement, variant: string, pal: Palette) {
  const gl = canvas.getContext("webgl", { antialias: false, premultipliedAlpha: false });
  if (!gl) return null;
  const compile = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  };
  const prog = gl.createProgram()!;
  gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, SHADERS[variant]));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, "p");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const u = (n: string) => gl.getUniformLocation(prog, n);
  const f = (c: RGB): [number, number, number] => [c[0] / 255, c[1] / 255, c[2] / 255];
  const base: RGB = pal.light
    ? [Math.min(255, pal.a[0] * 0.15 + 225), Math.min(255, pal.a[1] * 0.15 + 225), Math.min(255, pal.a[2] * 0.15 + 228)]
    : [pal.a[0] * 0.08 + 5, pal.a[1] * 0.08 + 6, pal.a[2] * 0.08 + 12];
  gl.uniform3fv(u("u_a"), f(pal.a));
  gl.uniform3fv(u("u_b"), f(pal.b));
  gl.uniform3fv(u("u_c"), f(base));
  const uRes = u("u_res");
  const uT = u("u_t");
  return {
    resize: (w: number, h: number) => {
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uRes, w, h);
    },
    draw: (t: number) => {
      gl.uniform1f(uT, t / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    },
  };
}

export default function LiveBgImpl({ variant, fixed }: { variant: string; fixed: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;
    const pal = readPalette(host);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isShader = variant in SHADERS;
    const ptr: Pointer = { x: 0, y: 0, active: false };

    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = true;
    let last = performance.now();

    const shader = isShader ? startShader(canvas, variant, pal) : null;
    const ctx = isShader ? null : canvas.getContext("2d");
    const scene = ctx ? makeScene(variant, pal, ptr) : null;
    if (!shader && !scene) return;

    const size = () => {
      const r = fixed
        ? { width: window.innerWidth, height: window.innerHeight }
        : host.getBoundingClientRect();
      w = Math.max(1, Math.round(r.width));
      h = Math.max(1, Math.round(r.height));
      // Shaders render at half resolution (smooth gradients upscale for free);
      // 2D scenes get a capped device pixel ratio.
      const k = isShader ? 0.5 : Math.min(window.devicePixelRatio || 1, 1.75);
      canvas.width = Math.max(1, Math.round(w * k));
      canvas.height = Math.max(1, Math.round(h * k));
      if (shader) shader.resize(canvas.width, canvas.height);
      if (ctx) ctx.setTransform(k, 0, 0, k, 0, 0);
      scene?.init(w, h);
    };

    const frame = (now: number) => {
      const dt = now - last;
      last = now;
      if (shader) shader.draw(now);
      else if (ctx && scene) scene.draw(ctx, w, h, now, dt);
      if (!reduced && visible && !document.hidden) raf = requestAnimationFrame(frame);
    };
    const kick = () => {
      cancelAnimationFrame(raf);
      if (!reduced && visible && !document.hidden) raf = requestAnimationFrame(frame);
    };

    size();
    frame(performance.now());

    const ro = new ResizeObserver(() => {
      size();
      if (reduced) frame(performance.now());
    });
    ro.observe(host);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      kick();
    });
    io.observe(host);
    const onVis = () => kick();
    document.addEventListener("visibilitychange", onVis);
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      ptr.x = e.clientX - r.left;
      ptr.y = e.clientY - r.top;
      ptr.active = true;
    };
    const onLeave = () => (ptr.active = false);
    host.addEventListener("pointermove", onMove, { passive: true });
    host.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, [variant, fixed]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={fixed ? "pointer-events-none fixed inset-0 h-full w-full" : "pointer-events-none absolute inset-0 h-full w-full"}
    />
  );
}
