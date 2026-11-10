import { useEffect, useState, RefObject, MutableRefObject } from 'react';
import MP4Box from 'mp4box';

const SRC = '/assets/hero/hero-video.mp4';
export type ScrubMode = 'loading' | 'webcodecs' | 'video';

/** Desktop: decode via WebCodecs into bitmaps drawn on canvas; falls back to lerped <video> seeking. */
export function useVideoScrub(
  canvasRef: RefObject<HTMLCanvasElement>,
  videoRef: RefObject<HTMLVideoElement>,
  pRef: MutableRefObject<number>,
  enabled: boolean
): ScrubMode {
  const [mode, setMode] = useState<ScrubMode>('loading');
  useEffect(() => {
    if (!enabled) return;
    let dead = false, raf = 0, cur = 0;
    let frames: ImageBitmap[] = [];
    const loop = () => {
      const t = pRef.current;
      cur += (t - cur) * 0.12;
      if (Math.abs(t - cur) < 1e-4) cur = t;
      const c = canvasRef.current, v = videoRef.current;
      if (frames.length && c) {
        c.getContext('2d')!.drawImage(frames[Math.round(cur * (frames.length - 1))], 0, 0, c.width, c.height);
      } else if (v && v.duration) v.currentTime = cur * v.duration;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    const fallback = () => !dead && setMode('video');

    (async () => {
      try {
        if (!('VideoDecoder' in window)) throw new Error('no WebCodecs');
        const buf = (await (await fetch(SRC)).arrayBuffer()) as ArrayBuffer & { fileStart: number };
        buf.fileStart = 0;
        const pending: Promise<ImageBitmap>[] = [];
        const decoder = new VideoDecoder({
          output: (f) => {
            pending.push(createImageBitmap(f, { resizeWidth: 1280, resizeHeight: 720 }).finally(() => f.close()));
          },
          error: fallback,
        });
        const file = MP4Box.createFile();
        file.onError = fallback;
        file.onReady = (info: any) => {
          const tr = info.videoTracks[0];
          const entry = file.getTrackById(tr.id).mdia.minf.stbl.stsd.entries[0];
          const box = entry.avcC || entry.hvcC || entry.vpcC;
          const ds = new MP4Box.DataStream(undefined, 0, MP4Box.DataStream.BIG_ENDIAN);
          box.write(ds);
          decoder.configure({
            codec: tr.codec.startsWith('vp08') ? 'vp8' : tr.codec,
            codedWidth: tr.video.width,
            codedHeight: tr.video.height,
            description: new Uint8Array(ds.buffer, 8),
          });
          file.setExtractionOptions(tr.id, null, { nbSamples: 500 });
          file.start();
        };
        file.onSamples = (_id: number, _u: unknown, samples: any[]) => {
          for (const s of samples)
            decoder.decode(new EncodedVideoChunk({
              type: s.is_sync ? 'key' : 'delta',
              timestamp: (1e6 * s.cts) / s.timescale,
              duration: (1e6 * s.duration) / s.timescale,
              data: s.data,
            }));
        };
        file.appendBuffer(buf);
        file.flush();
        await decoder.flush();
        const all = await Promise.all(pending);
        if (dead || !all.length) throw new Error('no frames');
        frames = all;
        setMode('webcodecs');
      } catch {
        fallback();
      }
    })();
    return () => { dead = true; cancelAnimationFrame(raf); frames.forEach((b) => b.close()); };
  }, [enabled]);
  return mode;
}
