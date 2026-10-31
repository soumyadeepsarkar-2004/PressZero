"use client";

import React, { useState, useEffect } from "react";
import { 
  Sliders, 
  FileSignature, 
  ShieldCheck, 
  Layers, 
  WifiOff, 
  Cpu,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  Eye,
  Activity,
  Play
} from "lucide-react";
import VideoDemoModal, { VideoTopic } from "@/components/common/VideoDemoModal";

export default function FeatureGrid() {
  const [activeVideoTopic, setActiveVideoTopic] = useState<VideoTopic | null>(null);

  // Micro-demo 1: Interactive Target KB Bisection Simulator
  const [bisectionTarget, setBisectionTarget] = useState<number>(20);
  const [bisectionSteps, setBisectionSteps] = useState<number>(7);
  const [convergedBytes, setConvergedBytes] = useState<string>("19.8 KB");

  const handleTargetChange = (target: number) => {
    setBisectionTarget(target);
    const simulatedSteps = target < 10 ? 8 : target < 50 ? 7 : 6;
    setBisectionSteps(simulatedSteps);
    const converged = (target * 0.985).toFixed(1);
    setConvergedBytes(`${converged} KB`);
  };

  // Micro-demo 2: Signature Bleach Interactive Wipe
  const [bleachWipe, setBleachWipe] = useState<number>(50);

  // Micro-demo 3: Telemetry Live Status
  const [outboundRequests] = useState<number>(0);
  const [telemetryUptime, setTelemetryUptime] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTelemetryUptime((t) => t + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Micro-demo 4: Worker Cores simulation
  const [workerProgress, setWorkerProgress] = useState<number[]>([100, 78, 92, 64]);
  useEffect(() => {
    const interval = setInterval(() => {
      setWorkerProgress((prev) => 
        prev.map((val) => (val >= 100 ? 15 : val + Math.floor(Math.random() * 12) + 5))
      );
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  // Micro-demo 5: Online / Air-Gap Simulator
  const [isSimulatedAirgap, setIsSimulatedAirgap] = useState<boolean>(false);

  // Micro-demo 6: Detected Hardware Cores
  const [detectedCores, setDetectedCores] = useState<number>(8);
  useEffect(() => {
    if (typeof window !== "undefined" && window.navigator && window.navigator.hardwareConcurrency) {
      setDetectedCores(window.navigator.hardwareConcurrency);
    }
  }, []);

  return (
    <section id="features" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[var(--color-rule)]">
      {/* Section Masthead */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-12">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[var(--color-paper-2)] border border-[var(--color-rule)] text-[var(--color-ink)]">
              Interactive demonstrations
            </span>
            <span className="text-xs text-[var(--color-ok)] flex items-center gap-1 font-normal">
              <CheckCircle2 className="w-3.5 h-3.5" /> 6 living engineering simulations
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold text-[var(--color-ink)] tracking-tight">
            Engineered for precision, speed, and privacy
          </h2>
          <p className="text-sm text-[var(--color-muted)] mt-1.5 leading-relaxed">
            Eliminates arbitrary quality sliders, illegible signatures, and security concerns with verified client-side algorithms.
          </p>
        </div>

        <a
          href="#product-tour"
          className="btn-ghost px-3.5 py-1.5 text-xs font-medium flex items-center gap-1.5 cursor-pointer active:scale-98 focus-visible:outline-2 focus-visible:outline-[var(--color-ink)]"
        >
          <span>Watch full video tour</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Interactive 6-Capsule Engineering Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Capsule 1: Dual-Axis Target Engine */}
        <div className="p-5 rounded-xl panel-console border border-[var(--color-rule)] flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 rounded-lg bg-[var(--color-paper-3)] border border-[var(--color-rule)] flex items-center justify-center text-[var(--color-ink)]">
                <Sliders className="w-4 h-4" />
              </div>
              <button
                onClick={() => setActiveVideoTopic("bisection")}
                className="px-2 py-0.5 rounded text-[10px] font-medium bg-[var(--color-paper-2)] hover:bg-[var(--color-paper-3)] border border-[var(--color-rule)] text-[var(--color-ink)] flex items-center gap-1 cursor-pointer active:scale-98 focus-visible:outline-2 focus-visible:outline-[var(--color-ink)]"
              >
                <Play className="w-3 h-3 text-[var(--color-ok)]" />
                <span>Video demo</span>
              </button>
            </div>
            <h3 className="text-sm font-semibold text-[var(--color-ink)]">Dual-axis exact target engine</h3>
            <p className="text-xs text-[var(--color-muted)] mt-1 leading-relaxed">
              Binary search bisects quality matrix and downscales dimensions to land within exact kilobyte limits.
            </p>
          </div>

          {/* Interactive Bisection Micro-Widget */}
          <div className="p-3 rounded-lg bg-[var(--color-paper-2)] border border-[var(--color-rule)] space-y-2.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[var(--color-muted)]">Target ceiling:</span>
              <span className="text-[var(--color-ink)] font-medium">
                <span className="font-measured">{bisectionTarget}</span> KB
              </span>
            </div>

            <div className="flex gap-1.5">
              {[4, 20, 50, 100].map((val) => (
                <button
                  key={val}
                  onClick={() => handleTargetChange(val)}
                  className={`flex-1 py-1 rounded text-[10px] font-medium border cursor-pointer active:scale-98 focus-visible:outline-2 focus-visible:outline-[var(--color-ink)] ${
                    bisectionTarget === val
                      ? "bg-[var(--color-ink)] text-[var(--color-accent-ink)] border-[var(--color-ink)]"
                      : "bg-[var(--color-paper)] text-[var(--color-muted)] border-[var(--color-rule)] hover:text-[var(--color-ink)]"
                  }`}
                >
                  <span className="font-measured">{val}</span>KB
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-[var(--color-rule)] flex items-center justify-between text-[10px] text-[var(--color-muted)]">
              <span>Bisection: <strong className="text-[var(--color-ink)]"><span className="font-measured">{bisectionSteps}</span> steps</strong></span>
              <span className="text-[var(--color-ok)] font-medium">Output: {convergedBytes}</span>
            </div>
          </div>
        </div>

        {/* Capsule 2: Signature Ink Bleach Filter */}
        <div className="p-5 rounded-xl panel-console border border-[var(--color-rule)] flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 rounded-lg bg-[var(--color-paper-3)] border border-[var(--color-rule)] flex items-center justify-center text-[var(--color-ink)]">
                <FileSignature className="w-4 h-4" />
              </div>
              <button
                onClick={() => setActiveVideoTopic("bleach")}
                className="px-2 py-0.5 rounded text-[10px] font-medium bg-[var(--color-paper-2)] hover:bg-[var(--color-paper-3)] border border-[var(--color-rule)] text-[var(--color-ink)] flex items-center gap-1 cursor-pointer active:scale-98 focus-visible:outline-2 focus-visible:outline-[var(--color-ink)]"
              >
                <Play className="w-3 h-3 text-[var(--color-ok)]" />
                <span>Video demo</span>
              </button>
            </div>
            <h3 className="text-sm font-semibold text-[var(--color-ink)]">Signature and ink bleach filter</h3>
            <p className="text-xs text-[var(--color-muted)] mt-1 leading-relaxed">
              Adaptive thresholding strips smartphone desk shadows, leveling background paper to pure white.
            </p>
          </div>

          {/* Interactive Split Wipe Micro-Widget */}
          <div className="p-3 rounded-lg bg-[var(--color-paper-2)] border border-[var(--color-rule)] space-y-2">
            <div className="relative h-14 rounded border border-[var(--color-rule)] overflow-hidden select-none">
              {/* Left Side: Gray Shadowed Paper */}
              <div className="absolute inset-0 bg-[var(--color-paper-3)] flex items-center justify-center">
                <span className="text-xs font-serif text-[var(--color-muted)] italic font-semibold">
                  Sample Signature
                </span>
              </div>

              {/* Right Side: Bleached Clean Paper */}
              <div
                style={{ clipPath: `inset(0 0 0 ${bleachWipe}%)` }}
                className="absolute inset-0 bg-[var(--color-paper)] flex items-center justify-center"
              >
                <span className="text-xs font-serif text-[var(--color-ink)] italic font-bold">
                  Sample Signature
                </span>
              </div>

              {/* Divider Line */}
              <div
                style={{ left: `${bleachWipe}%` }}
                className="absolute inset-y-0 w-0.5 bg-[var(--color-ink)] pointer-events-none"
              />
            </div>

            <div className="flex items-center justify-between text-[10px] text-[var(--color-muted)]">
              <span>Shadowed paper</span>
              <input
                type="range"
                min="0"
                max="100"
                value={bleachWipe}
                onChange={(e) => setBleachWipe(Number(e.target.value))}
                className="w-24 accent-[var(--color-ink)] h-1 cursor-pointer"
                aria-label="Bleach wipe slider"
              />
              <span className="text-[var(--color-ok)] font-medium">Pure white</span>
            </div>
          </div>
        </div>

        {/* Capsule 3: Zero-Knowledge Verification */}
        <div className="p-5 rounded-xl panel-console border border-[var(--color-rule)] flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 rounded-lg bg-[var(--color-paper-3)] border border-[var(--color-rule)] flex items-center justify-center text-[var(--color-ok)]">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <button
                onClick={() => setActiveVideoTopic("loupe")}
                className="px-2 py-0.5 rounded text-[10px] font-medium bg-[var(--color-paper-2)] hover:bg-[var(--color-paper-3)] border border-[var(--color-rule)] text-[var(--color-ink)] flex items-center gap-1 cursor-pointer active:scale-98 focus-visible:outline-2 focus-visible:outline-[var(--color-ink)]"
              >
                <Play className="w-3 h-3 text-[var(--color-ok)]" />
                <span>Video demo</span>
              </button>
            </div>
            <h3 className="text-sm font-semibold text-[var(--color-ink)]">Zero-knowledge client privacy</h3>
            <p className="text-xs text-[var(--color-muted)] mt-1 leading-relaxed">
              No server uploads. No database storage. Images process exclusively within your local device memory heap.
            </p>
          </div>

          {/* Interactive Network Telemetry Display */}
          <div className="p-3 rounded-lg bg-[var(--color-paper-2)] border border-[var(--color-rule)] space-y-2 text-[11px]">
            <div className="flex items-center justify-between">
              <span className="text-[var(--color-muted)] flex items-center gap-1.5">
                <Activity className="w-3 h-3 text-[var(--color-ok)]" />
                Network egress:
              </span>
              <span className="text-[var(--color-ok)] font-medium">
                <span className="font-measured">{outboundRequests}</span> bytes (0 requests)
              </span>
            </div>
            <div className="flex items-center justify-between text-[10px] text-[var(--color-muted)] pt-1 border-t border-[var(--color-rule)]">
              <span>Local heap session:</span>
              <span><span className="font-measured">{telemetryUptime}</span>s active</span>
            </div>
          </div>
        </div>

        {/* Capsule 4: Multi-Core Worker Pool */}
        <div className="p-5 rounded-xl panel-console border border-[var(--color-rule)] flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 rounded-lg bg-[var(--color-paper-3)] border border-[var(--color-rule)] flex items-center justify-center text-[var(--color-ink)]">
                <Layers className="w-4 h-4" />
              </div>
              <button
                onClick={() => setActiveVideoTopic("batch")}
                className="px-2 py-0.5 rounded text-[10px] font-medium bg-[var(--color-paper-2)] hover:bg-[var(--color-paper-3)] border border-[var(--color-rule)] text-[var(--color-ink)] flex items-center gap-1 cursor-pointer active:scale-98 focus-visible:outline-2 focus-visible:outline-[var(--color-ink)]"
              >
                <Play className="w-3 h-3 text-[var(--color-ok)]" />
                <span>Video demo</span>
              </button>
            </div>
            <h3 className="text-sm font-semibold text-[var(--color-ink)]">Multi-core Web Worker batching</h3>
            <p className="text-xs text-[var(--color-muted)] mt-1 leading-relaxed">
              Distributes compression jobs across dedicated Web Worker threads to keep the main user interface silky smooth.
            </p>
          </div>

          {/* Parallel Thread Meters */}
          <div className="p-3 rounded-lg bg-[var(--color-paper-2)] border border-[var(--color-rule)] space-y-2">
            <div className="grid grid-cols-4 gap-2 text-center">
              {workerProgress.map((prog, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="h-10 rounded bg-[var(--color-paper-3)] border border-[var(--color-rule)] flex flex-col justify-end p-0.5 overflow-hidden">
                    <div
                      style={{ transform: `scaleY(${prog / 100})` }}
                      className="w-full bg-[var(--color-ink)] rounded-sm origin-bottom transition-transform duration-300"
                    />
                  </div>
                  <span className="text-[9px] text-[var(--color-muted)] block">
                    Core <span className="font-measured">{idx}</span>
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-[10px] text-[var(--color-muted)] pt-1 border-t border-[var(--color-rule)]">
              <span>Dispatch mode:</span>
              <span className="text-[var(--color-ink)] font-medium">OffscreenCanvas worker</span>
            </div>
          </div>
        </div>

        {/* Capsule 5: Offline & Air-Gap Engine */}
        <div className="p-5 rounded-xl panel-console border border-[var(--color-rule)] flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 rounded-lg bg-[var(--color-paper-3)] border border-[var(--color-rule)] flex items-center justify-center text-[var(--color-ink)]">
                <WifiOff className="w-4 h-4" />
              </div>
              <button
                onClick={() => setActiveVideoTopic("bisection")}
                className="px-2 py-0.5 rounded text-[10px] font-medium bg-[var(--color-paper-2)] hover:bg-[var(--color-paper-3)] border border-[var(--color-rule)] text-[var(--color-ink)] flex items-center gap-1 cursor-pointer active:scale-98 focus-visible:outline-2 focus-visible:outline-[var(--color-ink)]"
              >
                <Play className="w-3 h-3 text-[var(--color-ok)]" />
                <span>Video demo</span>
              </button>
            </div>
            <h3 className="text-sm font-semibold text-[var(--color-ink)]">Offline and air-gap certified</h3>
            <p className="text-xs text-[var(--color-muted)] mt-1 leading-relaxed">
              Progressive Web App service workers cache all scripts locally. Disconnect Wi-Fi and continue compressing.
            </p>
          </div>

          {/* Interactive Air-Gap Toggle */}
          <div className="p-3 rounded-lg bg-[var(--color-paper-2)] border border-[var(--color-rule)] space-y-2.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[var(--color-muted)]">Connection state:</span>
              <span className="text-[var(--color-ok)] font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-ok)]" />
                {isSimulatedAirgap ? "Air-gap mode (100% operational)" : "Service worker active"}
              </span>
            </div>

            <button
              onClick={() => setIsSimulatedAirgap(!isSimulatedAirgap)}
              className="w-full py-1.5 rounded text-[11px] font-medium bg-[var(--color-paper-3)] hover:bg-[var(--color-paper)] border border-[var(--color-rule)] text-[var(--color-ink)] flex items-center justify-center gap-1.5 cursor-pointer active:scale-98 focus-visible:outline-2 focus-visible:outline-[var(--color-ink)]"
            >
              <RefreshCw className="w-3 h-3" />
              <span>{isSimulatedAirgap ? "Reset simulation" : "Test air-gap simulation"}</span>
            </button>
          </div>
        </div>

        {/* Capsule 6: Decentralized Compute Scalability */}
        <div className="p-5 rounded-xl panel-console border border-[var(--color-rule)] flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 rounded-lg bg-[var(--color-paper-3)] border border-[var(--color-rule)] flex items-center justify-center text-[var(--color-ink)]">
                <Cpu className="w-4 h-4" />
              </div>
              <button
                onClick={() => setActiveVideoTopic("cropper")}
                className="px-2 py-0.5 rounded text-[10px] font-medium bg-[var(--color-paper-2)] hover:bg-[var(--color-paper-3)] border border-[var(--color-rule)] text-[var(--color-ink)] flex items-center gap-1 cursor-pointer active:scale-98 focus-visible:outline-2 focus-visible:outline-[var(--color-ink)]"
              >
                <Play className="w-3 h-3 text-[var(--color-ok)]" />
                <span>Video demo</span>
              </button>
            </div>
            <h3 className="text-sm font-semibold text-[var(--color-ink)]">Client compute scalability</h3>
            <p className="text-xs text-[var(--color-muted)] mt-1 leading-relaxed">
              No centralized server choke point. Each user brings their own processor, allowing millions to compress simultaneously.
            </p>
          </div>

          {/* Local Hardware Inspector */}
          <div className="p-3 rounded-lg bg-[var(--color-paper-2)] border border-[var(--color-rule)] space-y-2 text-[11px]">
            <div className="flex items-center justify-between">
              <span className="text-[var(--color-muted)]">Available CPU threads:</span>
              <span className="text-[var(--color-ink)] font-medium">
                <span className="font-measured">{detectedCores}</span> cores detected
              </span>
            </div>
            <div className="flex items-center justify-between text-[10px] text-[var(--color-muted)] pt-1 border-t border-[var(--color-rule)]">
              <span>Server cost per user:</span>
              <span className="text-[var(--color-ok)] font-medium">\$0.00 / compression</span>
            </div>
          </div>
        </div>
      </div>

      {/* Video Demo Modal when triggered */}
      {activeVideoTopic && (
        <VideoDemoModal
          isOpen={true}
          onClose={() => setActiveVideoTopic(null)}
          topic={activeVideoTopic}
        />
      )}
    </section>
  );
}