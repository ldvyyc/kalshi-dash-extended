"use client";
import { useEffect, useRef } from "react";

/**
 * ldvyyc brand Aurora background — shared across all sites.
 * Drop into any Next.js layout and place as a fixed layer behind content.
 * Requires brand CSS variables (brand.css or globals.css) to be loaded.
 */
export default function AuroraBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onMove = (e: MouseEvent) => {
      const dx = (e.clientX / window.innerWidth  - 0.5) * 28;
      const dy = (e.clientY / window.innerHeight - 0.5) * 28;
      el.style.transform = `translate(${dx}px, ${dy}px)`;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <>
      <style>{`
        @keyframes ldv-drift1 {
          0%   { transform: translate(0,0) scale(1); }
          33%  { transform: translate(60px,-80px) scale(1.08); }
          66%  { transform: translate(-40px,50px) scale(0.94); }
          100% { transform: translate(0,0) scale(1); }
        }
        @keyframes ldv-drift2 {
          0%   { transform: translate(0,0) scale(1); }
          33%  { transform: translate(-70px,60px) scale(1.06); }
          66%  { transform: translate(50px,-40px) scale(0.96); }
          100% { transform: translate(0,0) scale(1); }
        }
        @keyframes ldv-drift3 {
          0%   { transform: translate(0,0) scale(1); }
          50%  { transform: translate(40px,70px) scale(1.10); }
          100% { transform: translate(0,0) scale(1); }
        }
        @keyframes ldv-drift4 {
          0%   { transform: translate(0,0) scale(1); }
          40%  { transform: translate(-50px,-60px) scale(0.92); }
          80%  { transform: translate(30px,40px) scale(1.05); }
          100% { transform: translate(0,0) scale(1); }
        }
        @keyframes ldv-drift5 {
          0%   { transform: translate(0,0) scale(1); }
          60%  { transform: translate(80px,-50px) scale(1.12); }
          100% { transform: translate(0,0) scale(1); }
        }
        .ldv-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(90px);
          will-change: transform;
          mix-blend-mode: screen;
        }
      `}</style>

      {/* Base dark gradient */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0,
        background: "radial-gradient(ellipse at 50% 0%, #0A0C14 0%, #050508 55%, #030305 100%)",
      }} />

      {/* Noise grain */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`,
        opacity: 0.55,
      }} />

      {/* Blobs — mouse parallax wrapper */}
      <div ref={containerRef} style={{
        position: "fixed", inset: "-60px", zIndex: 0, pointerEvents: "none",
        transition: "transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94)",
      }}>
        {/* Blue — top center, dominant */}
        <div className="ldv-blob" style={{
          width: "65vw", height: "65vw", top: "-15%", left: "17%",
          background: "rgba(91,184,232,0.13)",
          animation: "ldv-drift1 22s ease-in-out infinite",
        }} />
        {/* Yellow-green — lower left */}
        <div className="ldv-blob" style={{
          width: "50vw", height: "50vw", bottom: "5%", left: "-10%",
          background: "rgba(200,212,74,0.09)",
          animation: "ldv-drift2 28s ease-in-out infinite",
        }} />
        {/* Green — right mid */}
        <div className="ldv-blob" style={{
          width: "45vw", height: "45vw", top: "20%", right: "-8%",
          background: "rgba(58,139,92,0.09)",
          animation: "ldv-drift3 19s ease-in-out infinite",
        }} />
        {/* Blue accent — bottom right */}
        <div className="ldv-blob" style={{
          width: "35vw", height: "35vw", bottom: "-5%", right: "10%",
          background: "rgba(91,184,232,0.07)",
          animation: "ldv-drift4 25s ease-in-out infinite",
        }} />
        {/* Yellow-green accent — top right */}
        <div className="ldv-blob" style={{
          width: "28vw", height: "28vw", top: "5%", right: "5%",
          background: "rgba(200,212,74,0.06)",
          animation: "ldv-drift5 31s ease-in-out infinite",
        }} />
      </div>
    </>
  );
}
