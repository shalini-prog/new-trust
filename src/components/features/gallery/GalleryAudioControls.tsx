import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Film } from 'lucide-react';

interface GalleryAudioControlsProps {
  isPlaying: boolean;
  isMuted: boolean;
  isAutoPlay: boolean;
  onTogglePlay: () => void;
  onToggleMute: () => void;
  onToggleAutoPlay: () => void;
}

export default function GalleryAudioControls({
  isPlaying,
  isMuted,
  isAutoPlay,
  onTogglePlay,
  onToggleMute,
  onToggleAutoPlay
}: GalleryAudioControlsProps) {
  return (
    <div className="flex items-center space-x-4">
      <motion.button
        className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700"
        onClick={onTogglePlay}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
      </motion.button>
      
      <motion.button
        className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700"
        onClick={onToggleMute}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </motion.button>
      
      <motion.button
        className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700"
        onClick={onToggleAutoPlay}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Film size={20} className={isAutoPlay ? "text-purple-600" : ""} />
      </motion.button>
      
      <div className="text-sm text-gray-600 hidden md:block">
        {isAutoPlay ? "Auto-play on" : "Auto-play off"}
      </div>
    </div>
  );
}