import { useEffect, useRef, useState, useCallback } from "react";

// Wraps a single <audio> element and exposes everything the Player UI
// needs: current song, play/pause, scrubbing, volume, next/prev/shuffle.
export function useAudioPlayer(songs) {
  const audioRef = useRef(new Audio());
  const [currentIndex, setCurrentIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [shuffle, setShuffle] = useState(false);

  const currentSong = currentIndex === null ? null : songs[currentIndex];

  // keep the audio element's src in sync with the selected song
  useEffect(() => {
    const audio = audioRef.current;
    if (!currentSong) return;

    audio.src = import.meta.env.BASE_URL.replace(/\/$/, "") + currentSong.file;
    audio.volume = volume;
    audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  useEffect(() => {
    audioRef.current.volume = volume;
  }, [volume]);

  // wire up native audio events once
  useEffect(() => {
    const audio = audioRef.current;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMeta = () => setDuration(audio.duration || 0);
    const onEnded = () => playNext();
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMeta);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMeta);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, shuffle, songs.length]);

  const playSongAt = useCallback((index) => {
    setCurrentIndex(index);
  }, []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!currentSong) return;
    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  }, [currentSong]);

  const playNext = useCallback(() => {
    if (songs.length === 0 || currentIndex === null) return;
    if (shuffle) {
      let next = Math.floor(Math.random() * songs.length);
      if (songs.length > 1) {
        while (next === currentIndex) next = Math.floor(Math.random() * songs.length);
      }
      setCurrentIndex(next);
    } else {
      setCurrentIndex((currentIndex + 1) % songs.length);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, shuffle, songs.length]);

  const playPrev = useCallback(() => {
    if (songs.length === 0 || currentIndex === null) return;
    setCurrentIndex((currentIndex - 1 + songs.length) % songs.length);
  }, [currentIndex, songs.length]);

  const seek = useCallback((time) => {
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  }, []);

  return {
    currentSong,
    currentIndex,
    isPlaying,
    currentTime,
    duration,
    volume,
    shuffle,
    setShuffle,
    setVolume,
    playSongAt,
    togglePlay,
    playNext,
    playPrev,
    seek,
  };
}
