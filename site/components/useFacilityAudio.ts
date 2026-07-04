'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

// Facility audio: an ambience bed + mechanical interaction SFX.
// Off by default (browser autoplay policy requires a gesture anyway); the
// HUD SOUND chip enables it and the choice persists. All sounds are plain
// HTMLAudioElements — four small files don't need a library.
export function useFacilityAudio() {
  const [enabled, setEnabled] = useState(false);
  const bed = useRef<HTMLAudioElement | null>(null);
  const servo = useRef<HTMLAudioElement | null>(null);
  const clunk = useRef<HTMLAudioElement | null>(null);
  const warm = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    bed.current = new Audio('/audio/ambience.mp3');
    bed.current.loop = true;
    bed.current.volume = 0.32;
    servo.current = new Audio('/audio/servo-turn.mp3');
    servo.current.volume = 0.5;
    clunk.current = new Audio('/audio/detent-clunk.mp3');
    clunk.current.volume = 0.7;
    warm.current = new Audio('/audio/crt-warm.mp3');
    warm.current.volume = 0.35;
    if (window.localStorage.getItem('ic-sound') === 'on') setEnabled(true);
    return () => {
      bed.current?.pause();
      bed.current = null;
    };
  }, []);

  // the bed follows the toggle (toggle click = the required user gesture)
  useEffect(() => {
    if (!bed.current) return;
    if (enabled) void bed.current.play().catch(() => {});
    else bed.current.pause();
  }, [enabled]);

  const toggle = useCallback(() => {
    setEnabled((v) => {
      window.localStorage.setItem('ic-sound', v ? 'off' : 'on');
      return !v;
    });
  }, []);

  const play = useCallback(
    (ref: React.RefObject<HTMLAudioElement | null>) => {
      if (!enabled || !ref.current) return;
      ref.current.currentTime = 0;
      void ref.current.play().catch(() => {});
    },
    [enabled],
  );

  return {
    enabled,
    toggle,
    playServo: useCallback(() => play(servo), [play]),
    stopServo: useCallback(() => servo.current?.pause(), []),
    playClunk: useCallback(() => play(clunk), [play]),
    playWarm: useCallback(() => play(warm), [play]),
  };
}
