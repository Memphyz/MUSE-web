import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';

import { MotionService } from './motion.service';

const COLORS = ['#3B82F6', '#FBBF24', '#22C55E', '#A855F7', '#60A5FA', '#FCD34D'];
const DURATION_MS = 1600;

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  spin: number;
  shape: 'rect' | 'circle';
}

/**
 * Skylearn "Confetti Celebration": a 1.6 s burst in sky, sun, leaf and berry.
 * Reserved for completion moments (here: the download starting). With reduced
 * motion it draws a single static star burst instead.
 */
@Injectable({ providedIn: 'root' })
export class ConfettiService {
  private readonly document = inject(DOCUMENT);
  private readonly motion = inject(MotionService);

  burst(origin?: { x: number; y: number }): void {
    const view = this.document.defaultView;
    if (!view) return;

    const canvas = this.document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return;

    const dpr = Math.min(view.devicePixelRatio || 1, 2);
    const width = view.innerWidth;
    const height = view.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.cssText =
      'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:9999;';
    canvas.setAttribute('aria-hidden', 'true');
    this.document.body.appendChild(canvas);
    context.scale(dpr, dpr);

    const center = origin ?? { x: width / 2, y: height * 0.35 };

    if (this.motion.reduced()) {
      this.drawStaticBurst(context, center);
      view.setTimeout(() => canvas.remove(), 900);
      return;
    }

    const particles = this.createParticles(center, width);
    const start = view.performance.now();

    const frame = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / DURATION_MS, 1);
      context.clearRect(0, 0, width, height);
      const fade = progress > 0.75 ? 1 - (progress - 0.75) / 0.25 : 1;
      context.globalAlpha = fade;

      for (const p of particles) {
        p.vy += 0.18;
        p.vx *= 0.99;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.spin;
        context.save();
        context.translate(p.x, p.y);
        context.rotate(p.rotation);
        context.fillStyle = p.color;
        if (p.shape === 'rect') {
          context.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        } else {
          context.beginPath();
          context.arc(0, 0, p.size / 2.6, 0, Math.PI * 2);
          context.fill();
        }
        context.restore();
      }

      if (progress < 1) {
        view.requestAnimationFrame(frame);
      } else {
        canvas.remove();
      }
    };
    view.requestAnimationFrame(frame);
  }

  private createParticles(center: { x: number; y: number }, width: number): Particle[] {
    const count = Math.round(Math.min(160, Math.max(90, width / 8)));
    const particles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 0.9;
      const speed = 7 + Math.random() * 9;
      particles.push({
        x: center.x,
        y: center.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 8 + Math.random() * 8,
        color: COLORS[i % COLORS.length],
        rotation: Math.random() * Math.PI,
        spin: (Math.random() - 0.5) * 0.3,
        shape: Math.random() > 0.3 ? 'rect' : 'circle',
      });
    }
    return particles;
  }

  private drawStaticBurst(
    context: CanvasRenderingContext2D,
    center: { x: number; y: number },
  ): void {
    const rays = 12;
    context.lineWidth = 4;
    context.lineCap = 'round';
    for (let i = 0; i < rays; i++) {
      const angle = (i / rays) * Math.PI * 2;
      context.strokeStyle = COLORS[i % COLORS.length];
      context.beginPath();
      context.moveTo(center.x + Math.cos(angle) * 24, center.y + Math.sin(angle) * 24);
      context.lineTo(center.x + Math.cos(angle) * 64, center.y + Math.sin(angle) * 64);
      context.stroke();
    }
  }
}
