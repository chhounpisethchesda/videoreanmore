import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Share2,
  QrCode,
  Check,
  Download,
  MessageSquare,
  Video,
} from 'lucide-react';

export type VideoMode = 'chat' | 'live';

export interface VideoInfo {
  id: VideoMode;
  labelEng: string;
  labelKhmer: string;
  titleEng: string;
  titleKhmer: string;
  descriptionEng: string;
  descriptionKhmer: string;
  videoSrc: string;
  poster?: string;
  youtubeId?: string; // Optional if using YouTube embed
}

export const VIDEOS: Record<VideoMode, VideoInfo> = {
  chat: {
    id: 'chat',
    labelEng: 'Chat Session',
    labelKhmer: 'ការជជែក (Chat)',
    titleEng: 'Chat Tutor Session',
    titleKhmer: 'ការរៀនតាមរយៈការជជែកជាមួយគ្រូ AI',
    descriptionEng: 'Step-by-step Socratic math tutoring with visual models and hints in chat.',
    descriptionKhmer: 'ការណែនាំសិស្សដោះស្រាយលំហាត់គណិតវិទ្យាតាមការជជែកជាជំហានៗ។',
    videoSrc: '/chat_demo.mp4',
    poster: '/worksheet.png',
  },
  live: {
    id: 'live',
    labelEng: 'Live Session',
    labelKhmer: 'ការរៀនផ្ទាល់ (Live)',
    titleEng: 'Live Webcam Tutor Session',
    titleKhmer: 'ការរៀនផ្ទាល់តាមកាមេរ៉ាជាមួយគ្រូ AI',
    descriptionEng: 'Real-time worksheet handwriting tracking, paper checking, and voice tutor.',
    descriptionKhmer: 'ការពិនិត្យមើលសន្លឹកកិច្ចការ និងការសរសេរដៃផ្ទាល់តាមកាមេរ៉ាជាមួយនឹងការឆ្លើយតបជាសំឡេង។',
    videoSrc: '/live_demo.mp4',
    poster: '/worksheet.png',
  },
};

export default function App() {
  const [language, setLanguage] = useState<'en' | 'km'>('en');
  const isKhmer = language === 'km';
  const [activeMode, setActiveMode] = useState<VideoMode>('chat');
  const activeVideo = VIDEOS[activeMode];

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [copied, setCopied] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
    }
  }, []);

  const handleSwitchMode = (mode: VideoMode) => {
    if (mode === activeMode) return;
    setActiveMode(mode);
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.pause();
    }
  };

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      void v.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    } else {
      v.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setIsMuted(v.muted);
  };

  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (!v) return;
    setCurrentTime(v.currentTime);
    if (v.duration) {
      setProgress((v.currentTime / v.duration) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    const v = videoRef.current;
    if (!v) return;
    setDuration(v.duration);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    const seekTime = (parseFloat(e.target.value) / 100) * v.duration;
    v.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const handleRestart = () => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    void v.play();
    setIsPlaying(true);
  };

  const handleFullscreen = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.requestFullscreen) {
      void v.requestFullscreen();
    } else if ((v as any).webkitRequestFullscreen) {
      void (v as any).webkitRequestFullscreen();
    }
  };

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      void navigator.clipboard.writeText(currentUrl || window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=360x360&margin=10&data=${encodeURIComponent(
    currentUrl || 'https://videoreanmore.vercel.app'
  )}`;

  return (
    <div className="min-h-screen bg-[#FAF5EA] text-[#1B4332] flex flex-col items-center justify-between p-3 sm:p-5 md:p-8 font-sans selection:bg-[#E8F5E9]">
      {/* ── Top Header ── */}
      <header className="w-full max-w-3xl flex items-center justify-between pb-3 border-b-2 border-[#1B4332]/15">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-[#1B4332] border-2 border-[#1B4332] shadow-[2px_2px_0px_#1B4332] flex items-center justify-center p-0.5 text-white font-black text-xs">
            🦁
          </div>
          <div>
            <h1 className="font-black text-base sm:text-lg text-[#1B4332] leading-tight flex items-center gap-1.5">
              <span>ReanMore</span>
              <span className="px-1.5 py-0.5 text-[10px] font-black bg-[#E8F5E9] text-[#2D6A4F] rounded-md border border-[#1B4332]/30">
                Demo
              </span>
            </h1>
            <p className="text-[11px] font-bold text-[#1B4332]/70 leading-tight">
              {isKhmer ? 'វីដេអូបទបង្ហាញផ្លូវការ' : 'Official Presentation Showcase'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setLanguage(isKhmer ? 'en' : 'km')}
            className="px-2 sm:px-2.5 py-1.5 bg-white hover:bg-[#E8F5E9] text-[#1B4332] rounded-xl font-black text-xs border-2 border-[#1B4332] shadow-[2px_2px_0px_#1B4332] cursor-pointer"
          >
            {isKhmer ? 'EN' : 'ខ្មែរ'}
          </button>

          <button
            type="button"
            onClick={() => setShowQrModal(true)}
            className="px-2.5 sm:px-3 py-1.5 bg-white hover:bg-[#E8F5E9] text-[#1B4332] rounded-xl font-black text-xs border-2 border-[#1B4332] shadow-[2px_2px_0px_#1B4332] flex items-center gap-1.5 cursor-pointer active:translate-y-0.5 transition-all"
            title="Show QR Code for Audience"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isKhmer ? 'កូដ QR' : 'Show QR'}</span>
          </button>

          <button
            type="button"
            onClick={handleCopyLink}
            className="px-2.5 sm:px-3 py-1.5 bg-[#40916C] hover:bg-[#2D6A4F] text-white rounded-xl font-black text-xs border-2 border-[#1B4332] shadow-[2px_2px_0px_#1B4332] flex items-center gap-1.5 cursor-pointer active:translate-y-0.5 transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-white stroke-[3]" /> : <Share2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? (isKhmer ? 'បានចម្លង!' : 'Copied!') : (isKhmer ? 'ចែករំលែក' : 'Share')}</span>
          </button>
        </div>
      </header>

      {/* ── Main Content / Video Player ── */}
      <main className="w-full max-w-3xl flex-1 flex flex-col items-center justify-center my-4 sm:my-6 space-y-4">
        {/* Mode Selector: Chat Session vs Live Session */}
        <div className="flex items-center gap-2 p-1.5 bg-white rounded-2xl border-3 border-[#1B4332] shadow-[3px_3px_0px_#1B4332]">
          <button
            type="button"
            onClick={() => handleSwitchMode('chat')}
            className={`px-4 sm:px-6 py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
              activeMode === 'chat'
                ? 'bg-[#1B4332] text-white shadow-[1px_1px_0px_#1B4332]'
                : 'text-[#1B4332] hover:bg-[#E8F5E9]'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>{isKhmer ? VIDEOS.chat.labelKhmer : VIDEOS.chat.labelEng}</span>
          </button>

          <button
            type="button"
            onClick={() => handleSwitchMode('live')}
            className={`px-4 sm:px-6 py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
              activeMode === 'live'
                ? 'bg-[#1B4332] text-white shadow-[1px_1px_0px_#1B4332]'
                : 'text-[#1B4332] hover:bg-[#E8F5E9]'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>{isKhmer ? VIDEOS.live.labelKhmer : VIDEOS.live.labelEng}</span>
          </button>
        </div>

        {/* Title Box */}
        <div className="w-full text-center px-2">
          <h2 className="font-black text-lg sm:text-2xl text-[#1B4332] tracking-tight">
            {isKhmer ? activeVideo.titleKhmer : activeVideo.titleEng}
          </h2>
          <p className="text-xs sm:text-sm font-bold text-[#1B4332]/75 mt-0.5 max-w-xl mx-auto">
            {isKhmer ? activeVideo.descriptionKhmer : activeVideo.descriptionEng}
          </p>
        </div>

        {/* Video Card Container */}
        <div className="w-full bg-white rounded-2xl sm:rounded-3xl border-3 border-[#1B4332] shadow-[4px_4px_0px_#1B4332] sm:shadow-[6px_6px_0px_#1B4332] overflow-hidden flex flex-col">
          {/* Video Screen */}
          <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden group">
            {activeVideo.youtubeId ? (
              <iframe
                src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0`}
                title={activeVideo.titleEng}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <>
                <video
                  key={activeMode}
                  ref={videoRef}
                  playsInline
                  controls={false}
                  preload="metadata"
                  poster={activeVideo.poster}
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onClick={togglePlay}
                  onEnded={() => setIsPlaying(false)}
                  className="w-full h-full object-contain cursor-pointer"
                >
                  <source src={activeVideo.videoSrc} type="video/mp4" />
                  Your browser does not support HTML5 video.
                </video>

                {/* Big Center Play Button when paused */}
                {!isPlaying && (
                  <button
                    type="button"
                    onClick={togglePlay}
                    className="absolute inset-0 m-auto w-16 h-16 sm:w-20 sm:h-20 bg-[#1B4332]/90 hover:bg-[#1B4332] text-white rounded-full border-3 border-white shadow-[4px_4px_0px_rgba(0,0,0,0.4)] flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer z-10"
                    aria-label="Play video"
                  >
                    <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-white translate-x-0.5" />
                  </button>
                )}
              </>
            )}
          </div>

          {/* Custom Controls Bar */}
          {!activeVideo.youtubeId && (
            <div className="p-2.5 sm:p-3 bg-[#FAFDF9] border-t-2 border-[#1B4332]/15 flex flex-col gap-2 select-none">
              {/* Progress Slider */}
              <div className="flex items-center gap-2 w-full">
                <span className="text-[10px] sm:text-xs font-mono font-black text-[#1B4332]/70 w-10 text-right">
                  {formatTime(currentTime)}
                </span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="0.1"
                  value={progress || 0}
                  onChange={handleSeek}
                  className="w-full h-2 bg-[#E8F5E9] rounded-lg appearance-none cursor-pointer accent-[#1B4332] border border-[#1B4332]/30"
                  aria-label="Video seek slider"
                />
                <span className="text-[10px] sm:text-xs font-mono font-black text-[#1B4332]/70 w-10">
                  {formatTime(duration)}
                </span>
              </div>

              {/* Bottom Buttons */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <button
                    type="button"
                    onClick={togglePlay}
                    className="p-2 bg-[#1B4332] hover:bg-[#2D6A4F] text-white rounded-xl border border-[#1B4332] shadow-[1.5px_1.5px_0px_#1B4332] cursor-pointer active:translate-y-0.5 transition-all"
                    title={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white translate-x-0.5" />}
                  </button>

                  <button
                    type="button"
                    onClick={handleRestart}
                    className="p-2 bg-white hover:bg-gray-100 text-[#1B4332] rounded-xl border border-[#1B4332] shadow-[1.5px_1.5px_0px_#1B4332] cursor-pointer active:translate-y-0.5 transition-all"
                    title="Restart"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={toggleMute}
                    className="p-2 bg-white hover:bg-gray-100 text-[#1B4332] rounded-xl border border-[#1B4332] shadow-[1.5px_1.5px_0px_#1B4332] cursor-pointer active:translate-y-0.5 transition-all"
                    title={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2">
                  <a
                    href={activeVideo.videoSrc}
                    download="reanmore_demo.mp4"
                    className="p-2 bg-white hover:bg-gray-100 text-[#1B4332] rounded-xl border border-[#1B4332] shadow-[1.5px_1.5px_0px_#1B4332] cursor-pointer active:translate-y-0.5 transition-all hidden xs:flex items-center"
                    title="Download Video"
                  >
                    <Download className="w-4 h-4" />
                  </a>

                  <button
                    type="button"
                    onClick={handleFullscreen}
                    className="p-2 bg-white hover:bg-gray-100 text-[#1B4332] rounded-xl border border-[#1B4332] shadow-[1.5px_1.5px_0px_#1B4332] cursor-pointer active:translate-y-0.5 transition-all"
                    title="Fullscreen"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="w-full max-w-3xl pt-3 border-t-2 border-[#1B4332]/15 text-center text-[11px] font-bold text-[#1B4332]/60 flex items-center justify-between">
        <span>© {new Date().getFullYear()} ReanMore • Video Showcase</span>
        <button
          type="button"
          onClick={() => setShowQrModal(true)}
          className="text-[#2D6A4F] font-black hover:underline inline-flex items-center gap-1 cursor-pointer"
        >
          <QrCode className="w-3 h-3" />
          <span>{isKhmer ? 'ទាញយកកូដ QR' : 'Get QR Code'}</span>
        </button>
      </footer>

      {/* ── QR Code Modal ── */}
      {showQrModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl border-3 border-[#1B4332] shadow-[6px_6px_0px_#1B4332] max-w-sm w-full p-5 flex flex-col items-center text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#E8F5E9] border-2 border-[#1B4332] flex items-center justify-center">
              <QrCode className="w-6 h-6 text-[#1B4332]" />
            </div>

            <div>
              <h3 className="font-black text-lg text-[#1B4332]">
                {isKhmer ? 'ស្កែនកូដ QR ដើម្បីមើលវីដេអូ' : 'Scan to Watch Video'}
              </h3>
              <p className="text-xs font-bold text-[#1B4332]/70 mt-0.5">
                {isKhmer
                  ? 'ទស្សនិកជនអាចស្កែនជាមួយកាមេរ៉ាទូរស័ព្ទដើម្បីមើលភ្លាមៗ'
                  : 'Point any phone camera to watch this showcase instantly'}
              </p>
            </div>

            <div className="p-3 bg-white rounded-2xl border-3 border-[#1B4332] shadow-[3px_3px_0px_#1B4332]">
              <img
                src={qrApiUrl}
                alt="QR Code for Video"
                className="w-56 h-56 object-contain"
              />
            </div>

            <p className="text-[10px] font-mono text-[#1B4332]/60 break-all px-2 max-w-xs">
              {currentUrl || 'https://videoreanmore.vercel.app'}
            </p>

            <div className="flex items-center gap-2 w-full pt-1">
              <a
                href={qrApiUrl}
                download="reanmore_video_qr.png"
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2 bg-[#40916C] hover:bg-[#2D6A4F] text-white rounded-xl font-black text-xs border-2 border-[#1B4332] shadow-[2px_2px_0px_#1B4332] flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isKhmer ? 'ទាញយក QR' : 'Save QR'}</span>
              </a>

              <button
                type="button"
                onClick={() => setShowQrModal(false)}
                className="flex-1 py-2 bg-[#FAF5EA] hover:bg-gray-100 text-[#1B4332] rounded-xl font-black text-xs border-2 border-[#1B4332] shadow-[2px_2px_0px_#1B4332] cursor-pointer"
              >
                {isKhmer ? 'បិទ' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
