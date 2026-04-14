"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+{}|:<>?0123456789";

interface ScrambleTextProps {
  text: string;
  scrambleSpeed?: number;
  delay?: number;
  className?: string;
  triggerOnHover?: boolean;
}

const ScrambleText: React.FC<ScrambleTextProps> = ({
  text,
  scrambleSpeed = 30,
  delay = 200,
  className,
  triggerOnHover = true,
}) => {
  const [displayText, setDisplayText] = useState(() =>
    text.split("").map(char => char === " " ? " " : CHARS[Math.floor(Math.random() * CHARS.length)]).join("")
  );
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startScramble = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    let iteration = 0;
    intervalRef.current = setInterval(() => {
      setDisplayText(() =>
        text
          .split("")
          .map((char, index) => {
            if (index < iteration) {
              return text[index];
            }
            if (char === " ") return " ";
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("")
      );

      if (iteration >= text.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
      }

      iteration += 1 / 3;
    }, scrambleSpeed);
  }, [text, scrambleSpeed]);

  useEffect(() => {
    // Phase 1: Flicker random characters during the initial delay
    const flickerInterval = setInterval(() => {
      setDisplayText(() =>
        text
          .split("")
          .map((char) => {
            if (char === " ") return " ";
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("")
      );
    }, 50);

    timeoutRef.current = setTimeout(() => {
      clearInterval(flickerInterval);
      startScramble();
    }, delay);

    return () => {
      clearInterval(flickerInterval);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startScramble, delay, text]);

  const handleMouseEnter = () => {
    if (triggerOnHover) {
      startScramble();
    }
  };

  return (
    <span
      className={className}
      onMouseEnter={handleMouseEnter}
      style={{ display: "inline-block", fontFamily: "monospace" }}
    >
      {displayText}
    </span>
  );
};

export default ScrambleText;
