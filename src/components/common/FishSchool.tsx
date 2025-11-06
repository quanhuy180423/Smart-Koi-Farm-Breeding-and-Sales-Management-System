"use client";

import React, { useEffect, useState } from "react";
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
          <ellipse cx="14" cy="12" rx="3" ry="2.5" fill="#FFA500" />
          <ellipse cx="24" cy="16" rx="3" ry="2.5" fill="#FFA500" />
          <ellipse cx="18" cy="18" rx="2" ry="1.5" fill="#FFA500" />
        </>
      )}

      {/* Head */}
      <circle cx="32" cy="15" r="6" fill={koiColor.primary} />

      {/* Mouth - golden */}
      <circle cx="37" cy="15" r="1.2" fill="#FFE082" />

      {/* Barbel (whiskers) - Koi characteristic */}
      <line
        x1="38"
        y1="15"
        x2="42"
        y2="16"
        stroke="#FFE082"
        strokeWidth="0.8"
      />
      <line
        x1="38"
        y1="15"
        x2="42"
        y2="14"
        stroke="#FFE082"
        strokeWidth="0.8"
      />

      {/* Eye - large and prominent */}
      <circle cx="35" cy="13" r="2" fill="#FFF" />
      <circle cx="35.3" cy="13" r="1.2" fill="#000" />

      {/* Top fin - large dorsal fin with pattern */}
      <path d="M 22 6 Q 24 2 26 6 L 24 12 Z" fill={koiColor.primary} />
      {selectedPattern !== "showa" && (
        <path
          d="M 23 6 Q 24 3 25 6"
          stroke="#FFFFFF"
          strokeWidth="0.4"
          fill="none"
          opacity="0.6"
        />
      )}

      {/* Bottom fin */}
      <path d="M 22 24 Q 24 28 26 24 L 24 18 Z" fill={koiColor.primary} />

      {/* Side fins */}
      <ellipse cx="16" cy="8" rx="2.5" ry="1.5" fill={koiColor.primary} />
      <ellipse cx="16" cy="22" rx="2.5" ry="1.5" fill={koiColor.primary} />

      {/* Tail - large and fan-like with distinct colors */}
      <path d="M 6 15 L -2 8 L -1 15 L -2 22 Z" fill={koiColor.primary} />
      {selectedPattern === "kohaku" && (
        <path d="M 4 12 L 0 7 L 1 12 L 0 17 Z" fill="#FFFFFF" opacity="0.7" />
      )}
      {selectedPattern === "sanke" && (
        <>
          <path d="M 4 12 L 0 7 L 1 12 Z" fill="#FFFFFF" opacity="0.7" />
          <path d="M 4 18 L 0 23 L 1 18 Z" fill="#1a1a1a" opacity="0.8" />
        </>
      )}
      {selectedPattern === "showa" && (
        <>
          <path d="M 4 12 L 0 7 L 1 12 Z" fill="#FFFFFF" opacity="0.7" />
          <path d="M 4 18 L 0 23 L 1 18 Z" fill="#FF6347" opacity="0.8" />
        </>
      )}
      {selectedPattern === "asagi" && (
        <path d="M 4 15 L 0 10 L 1 15 L 0 20 Z" fill="#FFB6C1" opacity="0.7" />
      )}
      {selectedPattern === "ogon" && (
        <path d="M 4 15 L 0 10 L 1 15 L 0 20 Z" fill="#FFA500" opacity="0.8" />
      )}

      {/* Gill lines */}
      <path
        d="M 28 10 Q 30 10 31 12"
        stroke="#FFF"
        strokeWidth="0.6"
        fill="none"
        opacity="0.5"
      />
      <path
        d="M 28 18 Q 30 18 31 16"
        stroke="#FFF"
        strokeWidth="0.6"
        fill="none"
        opacity="0.5"
      />

      {/* Scale shimmer */}
      <circle cx="12" cy="12" r="1" fill="#FFF" opacity="0.3" />
      <circle cx="18" cy="14" r="0.8" fill="#FFF" opacity="0.3" />
      <circle cx="24" cy="12" r="1" fill="#FFF" opacity="0.3" />
    </svg>
  );
};

export const FishSchool = () => {
  const { isEnabled } = useFishSchool();
  const [fishes, setFishes] = useState<Fish[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Khởi tạo bầy cá
  useEffect(() => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    const newFishes: Fish[] = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 1,
      scale: 0.6 + Math.random() * 0.6,
      rotation: Math.random() * 360,
      pattern: Math.floor(Math.random() * 5), // Random Koi pattern
    }));

    setFishes(newFishes);
  }, []);

  // Animation loop
  useEffect(() => {
    let animationId: number;
    const animate = () => {
      setFishes((prevFishes) =>
        prevFishes.map((fish) => {
          let newX = fish.x + fish.vx;
          let newY = fish.y + fish.vy;
          let newVx = fish.vx;
          let newVy = fish.vy;

          // Wrap around edges
          if (newX > dimensions.width + 50) {
            newX = -50;
          } else if (newX < -50) {
            newX = dimensions.width + 50;
          }

          if (newY > dimensions.height + 50) {
            newY = -50;
          } else if (newY < -50) {
            newY = dimensions.height + 50;
          }

          // Random direction change occasionally
          if (Math.random() < 0.02) {
            newVx = (Math.random() - 0.5) * 2;
            newVy = (Math.random() - 0.5) * 1;
          }

          // Calculate rotation based on direction
          const newRotation = Math.atan2(newVy, newVx) * (180 / Math.PI);

          return {
            ...fish,
            x: newX,
            y: newY,
            vx: newVx,
            vy: newVy,
            rotation: newRotation,
            pattern: fish.pattern,
          };
        }),
      );

      animationId = requestAnimationFrame(animate);
    };

    if (dimensions.width > 0) {
      animationId = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animationId);
    }
  }, [dimensions]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!isEnabled) {
    return null;
  }

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden bg-transparent">
      {fishes.map((fish) => (
        <div
          key={fish.id}
          style={{
            position: "absolute",
            left: fish.x,
            top: fish.y,
            transform: `translate(-50%, -50%) scale(${fish.scale})`,
            transition: "none",
          }}
        >
          <FishSVG scale={1} rotation={fish.rotation} pattern={fish.pattern} />
        </div>
      ))}
    </div>
  );
};
