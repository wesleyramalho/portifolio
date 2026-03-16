'use client'

export default function VideoBackground() {
  return (
    <video
      autoPlay
      muted
      loop
      playsInline
      className="absolute inset-0 w-full h-full object-cover"
    >
      <source src="/video.webm" type="video/webm" />
      <source src="/video.mp4" type="video/mp4" />
    </video>
  )
}
