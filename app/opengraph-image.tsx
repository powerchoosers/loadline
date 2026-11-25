import { ImageResponse } from 'next/og';
import { loadAt, PEAK_THRESHOLD } from '@/lib/load-shape';

export const alt = 'Loadline AI. Know the load before you make the call.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/** Share image: the headline over the same sample load shape used across the site. */
export default function OpenGraphImage() {
  const dots: { x: number; y: number; peak: boolean }[] = [];
  for (let i = 0; i <= 150; i += 1) {
    const u = i / 150;
    const v = loadAt(u);
    dots.push({ x: u * 1200, y: 600 - v * 300, peak: v > PEAK_THRESHOLD });
  }
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', position: 'relative', background: '#131313', color: '#eef1ef', fontFamily: 'sans-serif' }}>
        <div style={{ display: 'flex', flexDirection: 'column', padding: '70px 80px' }}>
          <div style={{ display: 'flex', fontSize: 30, fontWeight: 700, color: '#9dd9bf' }}>Loadline AI</div>
          <div style={{ display: 'flex', marginTop: 28, fontSize: 84, lineHeight: 1, letterSpacing: -3, maxWidth: 900 }}>
            Know the load before you make the call.
          </div>
        </div>
        {dots.map((dot, index) => (
          <div
            key={index}
            style={{ position: 'absolute', left: dot.x - 4, top: dot.y - 4, width: 8, height: 8, borderRadius: 8, background: dot.peak ? '#f2b26a' : '#9dd9bf' }}
          />
        ))}
      </div>
    ),
    size,
  );
}
