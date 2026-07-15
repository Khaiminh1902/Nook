"use client";

import { useEffect, useRef, useState } from "react";
import { FaMusic, FaPause } from "react-icons/fa6";

import { useGameStore } from "@/store/gameStore";

const MUSIC_SRC = "/audio/music.mp3";
const HOVER_DELAY_MS = 450;

export default function MusicToggle() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const hoverTimeoutRef = useRef<number | null>(null);
  const musicEnabled = useGameStore((state) => state.musicEnabled);
  const musicVolume = useGameStore((state) => state.musicVolume);
  const setMusicEnabled = useGameStore((state) => state.setMusicEnabled);
  const setMusicVolume = useGameStore((state) => state.setMusicVolume);
  const [showVolumeControl, setShowVolumeControl] = useState(false);

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current !== null) {
        window.clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    audio.volume = musicVolume;

    if (!musicEnabled) {
      audio.pause();
      return;
    }

    void audio.play().catch(() => {
      setMusicEnabled(false);
    });
  }, [musicEnabled, musicVolume, setMusicEnabled]);

  const toggleMusic = async () => {
    const audio = audioRef.current;

    if (!audio) return;

    if (musicEnabled) {
      setMusicEnabled(false);
      return;
    }

    try {
      audio.volume = musicVolume;
      await audio.play();
      setMusicEnabled(true);
    } catch {
      setMusicEnabled(false);
    }
  };

  const scheduleVolumeControl = () => {
    if (hoverTimeoutRef.current !== null) {
      window.clearTimeout(hoverTimeoutRef.current);
    }

    hoverTimeoutRef.current = window.setTimeout(() => {
      setShowVolumeControl(true);
      hoverTimeoutRef.current = null;
    }, HOVER_DELAY_MS);
  };

  const hideVolumeControl = () => {
    if (hoverTimeoutRef.current !== null) {
      window.clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }

    setShowVolumeControl(false);
  };

  return (
    <>
      <audio ref={audioRef} src={MUSIC_SRC} loop preload="auto" />

      <div
        className="absolute bottom-3 right-3 z-20 w-44"
        onMouseEnter={scheduleVolumeControl}
        onMouseLeave={hideVolumeControl}
      >
        {showVolumeControl && (
          <div className="mb-2 w-full border-2 border-[#8A6A4A] bg-[#5C4331]/95 px-3 py-2 shadow-[0_18px_40px_rgba(27,18,12,0.32)] backdrop-blur-md">
            <label
              htmlFor="music-volume"
              className="mb-2 block text-[10px] font-bold uppercase tracking-[0.14em] text-[#F2DFC2]"
            >
              Volume
            </label>
            <input
              id="music-volume"
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={musicVolume}
              onChange={(event) => setMusicVolume(Number(event.target.value))}
              className="h-1.5 w-full cursor-pointer accent-[#E8D0AB]"
              aria-label="Music volume"
            />
          </div>
        )}

        <div className="w-full border-2 border-[#8A6A4A] bg-[#5C4331]/95 p-2 shadow-[0_18px_40px_rgba(27,18,12,0.32)] backdrop-blur-md">
          <button
            onClick={() => void toggleMusic()}
            className={`flex w-full items-center justify-center gap-2 border-2 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.14em] transition cursor-pointer ${
              musicEnabled
                ? "border-[#E8D0AB] bg-[#F2DFC2] text-[#4A3323]"
                : "border-[#8A6A4A] bg-[#6B503C] text-[#F2DFC2] hover:bg-[#7A5D46]"
            }`}
            aria-pressed={musicEnabled}
            aria-label={musicEnabled ? "Turn music off" : "Turn music on"}
          >
            {musicEnabled ? (
              <FaPause className="h-3.5 w-3.5" />
            ) : (
              <FaMusic className="h-3.5 w-3.5" />
            )}
            <span>{musicEnabled ? "Music Off" : "Music On"}</span>
          </button>
        </div>
      </div>
    </>
  );
}
