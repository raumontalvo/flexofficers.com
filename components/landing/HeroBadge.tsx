import Image from "next/image";
import {
  BRAND_BADGE_TRANSPARENT_HEIGHT,
  BRAND_BADGE_TRANSPARENT_PNG,
  BRAND_BADGE_TRANSPARENT_WIDTH,
} from "@/components/brand/brand-assets";

const PARTICLES = [
  { top: "20%", left: "24%", delay: "0s", duration: "4.8s" },
  { top: "30%", left: "76%", delay: "1.2s", duration: "5.6s" },
  { top: "70%", left: "20%", delay: "2.4s", duration: "5.2s" },
  { top: "66%", left: "80%", delay: "0.8s", duration: "6s" },
  { top: "14%", left: "50%", delay: "1.8s", duration: "5.4s" },
] as const;

export function HeroBadge() {
  return (
    <div className="hero-badge-scene" aria-hidden="true">
      <div className="hero-badge-float">
        <div className="hero-badge-stage">
          <div className="hero-badge-orbit-host">
            <div className="hero-badge-orbit">
              <div className="hero-badge-orbit-ring" />
            </div>
          </div>

          <div className="hero-badge-particles">
            {PARTICLES.map((particle, index) => (
              <span
                key={index}
                className="hero-badge-particle"
                style={{
                  top: particle.top,
                  left: particle.left,
                  animationDelay: particle.delay,
                  animationDuration: particle.duration,
                }}
              />
            ))}
          </div>

          <div className="hero-badge-glow">
            <Image
              src={BRAND_BADGE_TRANSPARENT_PNG}
              alt=""
              width={BRAND_BADGE_TRANSPARENT_WIDTH}
              height={BRAND_BADGE_TRANSPARENT_HEIGHT}
              quality={100}
              className="hero-badge-image"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
