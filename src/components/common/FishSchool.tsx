"use client";

import React, { useEffect, useState, useRef } from "react";
import { useFishSchool } from "@/lib/context/FishSchoolContext";

interface Fish {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  scale: number;
  rotation: number;
  pattern: number;
  targetX?: number;
  targetY?: number;
  waveOffset?: number;
  opacity?: number;
  isFading?: boolean;
}

// Koi pattern types
const KoiPatterns = {
  kohaku: {
    primary: "#FF6B35",
    pattern: "white-red",
    colors: ["#FFFFFF", "#FF4500"],
  },
  sanke: {
    primary: "#FF8C42",
    pattern: "red-white-black",
    colors: ["#FFFFFF", "#FF4500", "#1a1a1a"],
  },
  showa: {
    primary: "#1a1a1a",
    pattern: "black-white-red",
    colors: ["#1a1a1a", "#FFFFFF", "#FF6347"],
  },
  asagi: {
    primary: "#4A90E2",
    pattern: "blue-red",
    colors: ["#4A90E2", "#FFB6C1"],
  },
  ogon: {
    primary: "#FFD700",
    pattern: "gold",
    colors: ["#FFD700", "#FFA500"],
  },
};

type PatternType = keyof typeof KoiPatterns;

const FishSVG = ({
  scale,
  rotation,
  pattern,
}: {
  scale: number;
  rotation: number;
  pattern: number;
}) => {
  const patternTypes = Object.keys(KoiPatterns) as PatternType[];
  const selectedPattern = patternTypes[pattern % patternTypes.length];
  const koiColor = KoiPatterns[selectedPattern];

  return (
    <svg
      width={50 * scale}
      height={30 * scale}
      viewBox="0 0 50 30"
      fill="none"
      style={{
        transform: `rotate(${rotation}deg)`,
        transformOrigin: "center",
        filter: `drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3)) drop-shadow(0 0 12px rgba(${
          selectedPattern === "ogon" ? "255, 215, 0" : "255, 107, 53"
        }, 0.4))`,
      }}
    >
      {/* Base body */}
      <ellipse cx="20" cy="15" rx="14" ry="9" fill={koiColor.primary} />

      {/* Pattern spots on body based on type */}
      {selectedPattern === "kohaku" && (
        <>
          <ellipse cx="14" cy="12" rx="5" ry="4" fill="#FFFFFF" />
          <ellipse cx="24" cy="16" rx="4" ry="3.5" fill="#FFFFFF" />
        </>
      )}
      {selectedPattern === "sanke" && (
        <>
          <ellipse cx="12" cy="11" rx="4" ry="3" fill="#FFFFFF" />
          <ellipse cx="22" cy="15" rx="3.5" ry="2.5" fill="#1a1a1a" />
          <ellipse cx="26" cy="18" rx="3" ry="2" fill="#FFFFFF" />
        </>
      )}
      {selectedPattern === "showa" && (
        <>
          <ellipse cx="14" cy="13" rx="4.5" ry="3.5" fill="#FFFFFF" />
          <ellipse cx="24" cy="14" rx="4" ry="3" fill="#FF6347" />
          <ellipse cx="12" cy="18" rx="3" ry="2" fill="#FF6347" />
        </>
      )}
      {selectedPattern === "asagi" && (
        <>
          <ellipse cx="14" cy="12" rx="4" ry="3" fill="#FFB6C1" />
          <ellipse cx="24" cy="16" rx="4" ry="3" fill="#FFB6C1" />
        </>
      )}
      {selectedPattern === "ogon" && (
        <>
          <circle cx="16" cy="14" r="3" fill="#FFA500" opacity={0.7} />
          <circle cx="24" cy="15" r="2.5" fill="#FFA500" opacity={0.7} />
        </>
      )}

      {/* Head */}
      <circle cx="32" cy="15" r="6" fill={koiColor.primary} />

      {/* Eyes - prominent feature of Koi */}
      <circle cx="35" cy="13" r="2.5" fill="#FFFFFF" />
      <circle cx="35" cy="13" r="1.2" fill="#000000" />

      {/* Mouth */}
      <circle cx="38" cy="15" r="1.5" fill="#FFE082" />

      {/* Barbels (whiskers) */}
      <line
        x1="38"
        y1="15"
        x2="42"
        y2="14"
        stroke="#FFE082"
        strokeWidth={0.8}
      />
      <line
        x1="38"
        y1="15"
        x2="42"
        y2="16"
        stroke="#FFE082"
        strokeWidth={0.8}
      />

      {/* Dorsal fin - triangular */}
      <polygon
        points="22,5 18,15 26,15"
        fill={koiColor.primary}
        opacity={0.9}
      />
      <line x1="22" y1="5" x2="20" y2="12" stroke="#FFFFFF" strokeWidth={0.6} />

      {/* Tail fin - fan shape */}
      <ellipse
        cx="6"
        cy="15"
        rx="6"
        ry="10"
        fill={koiColor.primary}
        opacity={0.8}
      />
      <ellipse
        cx="4"
        cy="15"
        rx="4"
        ry="7"
        fill={koiColor.colors[1]}
        opacity={0.5}
      />

      {/* Bottom fins */}
      <ellipse
        cx="15"
        cy="24"
        rx="3"
        ry="4"
        fill={koiColor.primary}
        opacity={0.7}
      />
      <ellipse
        cx="22"
        cy="24"
        rx="3"
        ry="4"
        fill={koiColor.primary}
        opacity={0.7}
      />

      {/* Side pectoral fins */}
      <ellipse
        cx="18"
        cy="10"
        rx="4"
        ry="2"
        fill={koiColor.primary}
        opacity={0.6}
      />
      <ellipse
        cx="18"
        cy="20"
        rx="4"
        ry="2"
        fill={koiColor.primary}
        opacity={0.6}
      />

      {/* Gill lines */}
      <path
        d="M 28 10 Q 26 15 28 20"
        stroke="#FFFFFF"
        strokeWidth={0.6}
        fill="none"
        opacity={0.5}
      />

      {/* Scale shimmer effect */}
      <circle cx="16" cy="12" r={1.2} fill="#FFFFFF" opacity={0.4} />
      <circle cx="22" cy="14" r={1} fill="#FFFFFF" opacity={0.3} />
      <circle cx="26" cy="16" r={1.1} fill="#FFFFFF" opacity={0.35} />
    </svg>
  );
};

function FishSchoolComponent() {
  const { isEnabled } = useFishSchool();
  const [fishes, setFishes] = useState<Fish[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const animationIdRef = useRef<number | undefined>(undefined);
  const timeRef = useRef(0);
  const initialFishCountRef = useRef(15);
  const nextFishIdRef = useRef(15);
  const respawnTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Initialize fish
  useEffect(() => {
    if (!isEnabled) return;

    const newFishes: Fish[] = [];
    for (let i = 0; i < 15; i++) {
      newFishes.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 0.5) * 2,
        scale: 0.6 + Math.random() * 0.6,
        rotation: 0,
        pattern: Math.floor(Math.random() * 5),
        waveOffset: Math.random() * Math.PI * 2,
      });
    }
    setFishes(newFishes);
    setDimensions({ width: window.innerWidth, height: window.innerHeight });
  }, [isEnabled]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Main animation loop
  useEffect(() => {
    if (!isEnabled || fishes.length === 0) return;

    const animate = () => {
      timeRef.current += 0.016;

      setFishes((prevFishes) => {
        // Remove fading fish that have fully disappeared (after animation)
        const visibleFishes = prevFishes.filter((f) => !f.isFading);

        return [
          ...visibleFishes.map((fish) => {
            let newVx = fish.vx;
            let newVy = fish.vy;

            // Separation force - keep fish from sticking together
            const tooCloseDistance = 60; // Minimum comfortable distance
            const closeFish = prevFishes.filter((f) => {
              const dist = Math.hypot(f.x - fish.x, f.y - fish.y);
              return f.id !== fish.id && dist < tooCloseDistance && dist > 0;
            });

            closeFish.forEach((otherFish) => {
              const dist = Math.hypot(
                otherFish.x - fish.x,
                otherFish.y - fish.y,
              );
              if (dist < tooCloseDistance) {
                const separationForce =
                  ((tooCloseDistance - dist) / tooCloseDistance) * 0.005;
                const angle = Math.atan2(
                  fish.y - otherFish.y,
                  fish.x - otherFish.x,
                );
                newVx += Math.cos(angle) * separationForce;
                newVy += Math.sin(angle) * separationForce;
              }
            });

            // Repulsion from mouse (fish run away)
            const mouseDistance = Math.hypot(
              mousePos.x - fish.x,
              mousePos.y - fish.y,
            );
            if (mouseDistance < 200) {
              const repelForce = (0.002 * (200 - mouseDistance)) / 200;
              newVx += (fish.x - mousePos.x) * repelForce;
              newVy += (fish.y - mousePos.y) * repelForce;
            }

            // Attraction to food (center of screen) - gentle wandering
            const centerX = dimensions.width / 2;
            const centerY = dimensions.height / 2;
            const distToCenter = Math.hypot(centerX - fish.x, centerY - fish.y);
            if (distToCenter > dimensions.width * 0.8) {
              newVx += (centerX - fish.x) * 0.00005;
              newVy += (centerY - fish.y) * 0.00005;
            }

            // Random behavior - occasional direction change
            if (Math.random() < 0.02) {
              newVx += (Math.random() - 0.5) * 0.9;
              newVy += (Math.random() - 0.5) * 0.8;
            }

            // Wave motion for natural swimming
            const waveAmount =
              Math.sin(timeRef.current * 2 + (fish.waveOffset || 0)) * 0.15;
            newVy += waveAmount * 0.005;

            // Speed damping
            newVx *= 0.98;
            newVy *= 0.98;

            // Speed limits
            const maxSpeed = 5;
            const speed = Math.hypot(newVx, newVy);
            if (speed > maxSpeed) {
              newVx = (newVx / speed) * maxSpeed;
              newVy = (newVy / speed) * maxSpeed;
            }

            // Update position
            let newX = fish.x + newVx;
            let newY = fish.y + newVy;

            // Keep fish within screen bounds (no wrapping)
            const boundary = 50;
            if (newX > dimensions.width - boundary) {
              newX = dimensions.width - boundary;
              newVx *= -0.8; // Bounce back
            }
            if (newX < boundary) {
              newX = boundary;
              newVx *= -0.8; // Bounce back
            }
            if (newY > dimensions.height - boundary) {
              newY = dimensions.height - boundary;
              newVy *= -0.8; // Bounce back
            }
            if (newY < boundary) {
              newY = boundary;
              newVy *= -0.8; // Bounce back
            }

            // Calculate rotation
            const newRotation = Math.atan2(newVy, newVx) * (180 / Math.PI);

            return {
              ...fish,
              x: newX,
              y: newY,
              vx: newVx,
              vy: newVy,
              rotation: newRotation,
            };
          }),
          // Keep fading fish so they can animate out
          ...prevFishes.filter((f) => f.isFading),
        ];
      });

      animationIdRef.current = requestAnimationFrame(animate);
    };

    animationIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [isEnabled, fishes.length, dimensions, mousePos]);

  if (!isEnabled || fishes.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Gradient background overlay for depth */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(100,200,255,0.05) 0%, transparent 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Fish */}
      {fishes.map((fish) => (
        <div
          key={fish.id}
          onClick={() => {
            // Start fade out animation
            setFishes((prev) =>
              prev.map((f) =>
                f.id === fish.id ? { ...f, isFading: true, opacity: 1 } : f,
              ),
            );

            // Spawn new fish after 3 seconds if count is below initial
            if (respawnTimerRef.current) {
              clearTimeout(respawnTimerRef.current);
            }
            respawnTimerRef.current = setTimeout(() => {
              setFishes((prev) => {
                const currentCount = prev.filter((f) => !f.isFading).length;
                if (currentCount < initialFishCountRef.current) {
                  const newFish: Fish = {
                    id: nextFishIdRef.current++,
                    x: Math.random() * dimensions.width,
                    y: Math.random() * dimensions.height,
                    vx: (Math.random() - 0.5) * 3,
                    vy: (Math.random() - 0.5) * 2,
                    scale: 0.6 + Math.random() * 0.6,
                    rotation: 0,
                    pattern: Math.floor(Math.random() * 5),
                    waveOffset: Math.random() * Math.PI * 2,
                    opacity: 1,
                    isFading: false,
                  };
                  return [...prev, newFish];
                }
                return prev;
              });
            }, 3000);
          }}
          style={{
            position: "absolute",
            left: fish.x,
            top: fish.y,
            transform: `translate(-50%, -50%) scale(${fish.scale})`,
            pointerEvents: "auto",
            cursor: "pointer",
            transition: fish.isFading
              ? "opacity 0.8s ease-out"
              : "transform 0.1s ease-out",
            opacity: fish.isFading ? 0 : (fish.opacity ?? 1),
            zIndex: Math.floor(fish.y),
          }}
        >
          <FishSVG
            scale={fish.scale}
            rotation={fish.rotation}
            pattern={fish.pattern}
          />
        </div>
      ))}

      {/* Ambient glow effect */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at top right, rgba(255,200,100,0.03), transparent 50%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

export default FishSchoolComponent;
