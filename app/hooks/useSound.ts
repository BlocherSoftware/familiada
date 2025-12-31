"use client";

import { useRef, useCallback } from "react";

export type SoundType = "intro" | "correct" | "wrong";

const SOUND_PATHS: Record<SoundType, string> = {
  intro: "/music/intro-familiada.mp3",
  correct: "/music/dobrze.mp3",
  wrong: "/music/blad.mp3",
};

export function useSound() {
  const audioRefs = useRef<Map<SoundType, HTMLAudioElement>>(new Map());

  const getAudio = useCallback((sound: SoundType): HTMLAudioElement => {
    if (!audioRefs.current.has(sound)) {
      const audio = new Audio(SOUND_PATHS[sound]);
      audioRefs.current.set(sound, audio);
    }
    return audioRefs.current.get(sound)!;
  }, []);

  const play = useCallback(
    (sound: SoundType) => {
      const audio = getAudio(sound);
      audio.currentTime = 0;
      audio.play().catch((err) => {
        console.warn("Nie można odtworzyć dźwięku:", err);
      });
    },
    [getAudio]
  );

  const stop = useCallback(
    (sound: SoundType) => {
      const audio = audioRefs.current.get(sound);
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    },
    []
  );

  const stopAll = useCallback(() => {
    audioRefs.current.forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });
  }, []);

  return { play, stop, stopAll };
}

