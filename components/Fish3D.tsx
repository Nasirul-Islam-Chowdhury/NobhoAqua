"use client";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { specOf, type FishSpec } from "@/lib/fishModel";
import type { Species } from "@/lib/types";

const sstep = (a: number, b: number, x: number) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

function profile(t: number, s: FishSpec) {
  const tt = Math.pow(t, s.snout);
  let f = Math.pow(Math.max(0, Math.sin(Math.PI * tt)), s.fat) * (1 - s.taper * t);
  f = Math.max(f, s.peduncle * sstep(0.5, 0.97, t));
  return f;
}

function bodyGeometry(s: FishSpec) {
  const N = 64, M = 40;
  const back = new THREE.Color(s.palette.back), belly = new THREE.Color(s.palette.belly), c = new THREE.Color();
  const pos: number[] = [], col: number[] = [], idx: number[] = [];
  for (let i = 0; i <= N; i++) {
    const t = i / N, x = (t - 0.5) * s.L, f = profile(t, s);
    for (let j = 0; j < M; j++) {
      const a = (j / M) * Math.PI * 2;
      pos.push(x, s.H * f * Math.cos(a), s.W * f * Math.sin(a));
      const k = sstep(-0.3, 0.55, Math.cos(a));
      c.copy(belly).lerp(back, k);
      if (s.arch === "ray" || s.arch === "flat") c.copy(k > 0.5 ? back : belly);
      col.push(c.r, c.g, c.b);
    }
  }
  for (let i = 0; i < N; i++) for (let j = 0; j < M; j++) {
    const a = i * M + j, b = i * M + ((j + 1) % M), c2 = (i + 1) * M + j, d = (i + 1) * M + ((j + 1) % M);
    idx.push(a, b, c2, b, d, c2);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

function tailShape(kind: FishSpec["tail"]) {
  const sh = new THREE.Shape(), a = 0.12;
  if (kind === "lunate" || kind === "forked") {
    const notch = kind === "lunate" ? 0.6 : 0.45;
    sh.moveTo(0, a); sh.bezierCurveTo(0.35, a + 0.1, 0.7, 0.55, 1, 1);
    sh.bezierCurveTo(0.85, 0.45, notch + 0.2, 0.15, notch, 0);
    sh.bezierCurveTo(notch + 0.2, -0.15, 0.85, -0.45, 1, -1);
    sh.bezierCurveTo(0.7, -0.55, 0.35, -a - 0.1, 0, -a);
  } else if (kind === "shark") {
    sh.moveTo(0, 0.08); sh.bezierCurveTo(0.3, 0.3, 0.55, 1.0, 0.95, 1.5);
    sh.bezierCurveTo(0.7, 0.7, 0.65, 0.35, 0.6, 0.05);
    sh.bezierCurveTo(0.8, -0.1, 0.85, -0.35, 0.9, -0.65);
    sh.bezierCurveTo(0.55, -0.4, 0.3, -0.2, 0, -0.08);
  } else {
    sh.moveTo(0, 0.1); sh.bezierCurveTo(0.3, 0.5, 0.8, 1.0, 1.0, 0.6);
    sh.bezierCurveTo(1.05, 0.2, 1.05, -0.2, 1.0, -0.6);
    sh.bezierCurveTo(0.8, -1.0, 0.3, -0.5, 0, -0.1);
  }
  sh.closePath();
  return sh;
}

function finShape() {
  const sh = new THREE.Shape();
  sh.moveTo(0, 0); sh.lineTo(0.18, 1); sh.quadraticCurveTo(0.5, 0.5, 1, 0); sh.closePath();
  return sh;
}

function buildFish(sp: Species) {
  const s = specOf(sp);
  const group = new THREE.Group();
  const bodyMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.32, metalness: 0.22 });
  group.add(new THREE.Mesh(bodyGeometry(s), bodyMat));
  const finMat = new THREE.MeshStandardMaterial({ color: s.palette.fin, roughness: 0.55, metalness: 0.05, side: THREE.DoubleSide, transparent: true, opacity: 0.92 });
  const topAt = (t: number) => s.H * profile(t, s);

  // tail (pivot at body end so it can swing)
  const tailPivot = new THREE.Group();
  tailPivot.position.set(s.L / 2 - 0.02, 0, 0);
  const tail = new THREE.Mesh(new THREE.ShapeGeometry(tailShape(s.tail), 24), finMat);
  tail.scale.set(s.tailLen, s.tailH, 1);
  tailPivot.add(tail);
  group.add(tailPivot);

  if (s.whip) {
    const w = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.07, s.whip, 8), bodyMat.clone());
    (w.material as THREE.MeshStandardMaterial).vertexColors = false;
    (w.material as THREE.MeshStandardMaterial).color.set(s.palette.back);
    w.rotation.z = Math.PI / 2; w.position.x = s.whip / 2 - 0.05;
    tailPivot.add(w);
  }

  const addFin = (f: { x: number; len: number; h: number }, up: boolean) => {
    const m = new THREE.Mesh(new THREE.ShapeGeometry(finShape(), 12), finMat);
    const t = f.x, x = (t - 0.5) * s.L;
    m.scale.set(f.len, f.h * (up ? 1 : -1), 1);
    m.position.set(x - f.len * 0.35, (up ? 1 : -1) * topAt(t) * 0.9, 0);
    group.add(m);
  };
  if (s.dorsal) addFin(s.dorsal, true);
  if (s.anal) addFin(s.anal, false);

  const pects: THREE.Mesh[] = [];
  if (s.pectoral > 0) {
    for (const side of [1, -1]) {
      const m = new THREE.Mesh(new THREE.ShapeGeometry(finShape(), 12), finMat);
      const t = 0.3, f = profile(t, s);
      m.scale.set(s.pectoral, s.pectoral * 0.9, 1);
      m.position.set((t - 0.5) * s.L - 0.1, -s.H * f * 0.3, side * s.W * f * 0.85);
      m.rotation.x = side * (Math.PI / 2 + 0.4);
      group.add(m); pects.push(m);
    }
  }

  if (s.bill) {
    const bill = new THREE.Mesh(new THREE.ConeGeometry(0.075, s.bill, 12), new THREE.MeshStandardMaterial({ color: s.palette.back, roughness: 0.4 }));
    bill.rotation.z = Math.PI / 2; bill.position.x = -s.L / 2 - s.bill / 2 + 0.06;
    group.add(bill);
  }

  // eyes
  const eyeT = 0.15, ef = profile(eyeT, s), ex = (eyeT - 0.5) * s.L;
  const white = new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.2 }), pupil = new THREE.MeshStandardMaterial({ color: "#0a0f14", roughness: 0.1 });
  for (const side of [1, -1]) {
    const e = new THREE.Mesh(new THREE.SphereGeometry(s.eye, 20, 16), white);
    const p = new THREE.Mesh(new THREE.SphereGeometry(s.eye * 0.58, 16, 12), pupil);
    if (s.topView) { e.position.set(ex, s.H * ef * 0.95, side * s.W * ef * 0.35); }
    else { e.position.set(ex, s.H * ef * 0.4, side * s.W * ef * 0.88); }
    p.position.copy(e.position).addScaledVector(new THREE.Vector3(-0.35, s.topView ? 0.8 : 0, s.topView ? 0 : side * 0.9).normalize(), s.eye * 0.55);
    group.add(e, p);
  }

  // fit & centre
  const box = new THREE.Box3().setFromObject(group), size = box.getSize(new THREE.Vector3()), centre = box.getCenter(new THREE.Vector3());
  const scale = Math.min(4.6 / size.x, 2.9 / Math.max(size.y, 0.01), 3.2 / Math.max(size.z, 0.01));
  group.children.forEach((c) => c.position.sub(centre));
  const holder = new THREE.Group();
  holder.add(group); holder.scale.setScalar(scale);
  return { holder, tailPivot, pects, topView: s.topView, eel: s.arch === "eel", dispose: () => holder.traverse((o) => {
    const m = o as THREE.Mesh; m.geometry?.dispose?.(); const mat = m.material as THREE.Material | THREE.Material[] | undefined;
    if (Array.isArray(mat)) mat.forEach((x) => x.dispose()); else mat?.dispose?.();
  }) };
}

export default function Fish3D({ species }: { species: Species }) {
  const mount = useRef<HTMLDivElement>(null);
  const api = useRef<{ set: (s: Species) => void } | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = mount.current; if (!el) return;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }); } catch {
      setFailed(true); // eslint-disable-line react-hooks/set-state-in-effect
      return;
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    el.appendChild(renderer.domElement);
    renderer.domElement.style.cssText = "width:100%;height:100%;display:block;touch-action:pan-y;cursor:grab";
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    scene.add(new THREE.HemisphereLight("#cfeeff", "#0a3c52", 1.15));
    const key = new THREE.DirectionalLight("#ffffff", 2.1); key.position.set(3, 5, 4); scene.add(key);
    const rim = new THREE.DirectionalLight("#5fe0ff", 1.2); rim.position.set(-4, 2, -3); scene.add(rim);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false; controls.enablePan = false; controls.enableDamping = true;
    controls.autoRotate = !reduce; controls.autoRotateSpeed = 1.6;

    // bubbles
    const bubbles = Array.from({ length: 12 }, (_, i) => {
      const m = new THREE.Mesh(new THREE.SphereGeometry(0.05 + (i % 4) * 0.02, 12, 10), new THREE.MeshStandardMaterial({ color: "#bfefff", transparent: true, opacity: 0.35, roughness: 0.1 }));
      m.position.set(((i * 37) % 100) / 100 * 5 - 2.5, ((i * 53) % 100) / 100 * 3 - 1.5, ((i * 29) % 100) / 100 * 2 - 1);
      scene.add(m); return m;
    });

    let cur: ReturnType<typeof buildFish> | null = null;
    let born = performance.now();
    const set = (sp: Species) => {
      if (cur) { scene.remove(cur.holder); cur.dispose(); }
      cur = buildFish(sp);
      cur.holder.rotation.y = -0.6;
      scene.add(cur.holder);
      if (cur.topView) camera.position.set(0, 5.2, 5.2); else camera.position.set(0, 0.9, 7.2);
      controls.target.set(0, 0, 0); controls.update();
      born = performance.now();
    };
    api.current = { set };
    set(species);

    const resize = () => {
      const w = el.clientWidth, h = el.clientHeight; if (!w || !h) return;
      renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize); ro.observe(el);

    let raf = 0; const t0 = performance.now();
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const t = (performance.now() - t0) / 1000, grow = Math.min(1, (performance.now() - born) / 450);
      if (cur) {
        const amp = reduce ? 0 : 1, e = 1 - Math.pow(1 - grow, 3);
        cur.tailPivot.rotation.y = Math.sin(t * 4.2) * 0.38 * amp * (cur.eel ? 1.4 : 1);
        cur.pects.forEach((p, i) => { p.rotation.x = (i ? -1 : 1) * (Math.PI / 2 + 0.4 + Math.sin(t * 3 + i) * 0.18 * amp); });
        cur.holder.position.y = Math.sin(t * 1.4) * 0.07 * amp;
        cur.holder.children[0].rotation.y = Math.sin(t * 2.1) * 0.05 * amp;
        const s = (cur.holder.userData.s ??= cur.holder.scale.x) as number;
        cur.holder.scale.setScalar(s * (0.7 + 0.3 * e));
      }
      bubbles.forEach((b, i) => { b.position.y += 0.004 + i * 0.0003; if (b.position.y > 1.8) b.position.y = -1.8; });
      controls.update();
      renderer.render(scene, camera);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf); ro.disconnect(); controls.dispose();
      cur?.dispose(); bubbles.forEach((b) => { b.geometry.dispose(); (b.material as THREE.Material).dispose(); });
      renderer.dispose(); renderer.domElement.remove(); api.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { api.current?.set(species); }, [species]);

  if (failed) return <div className="grid h-full place-items-center p-4 text-center text-sm text-muted">3D view isn’t supported on this device.</div>;
  return <div ref={mount} role="img" aria-label={`Interactive 3D illustration of ${species.name}`} className="h-full w-full" />;
}
