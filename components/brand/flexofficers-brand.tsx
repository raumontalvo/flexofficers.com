import Image from "next/image";
import Link from "next/link";
import {
  BRAND_BADGE_ASPECT,
  BRAND_BADGE_PNG,
  BRAND_BADGE_SIZE,
  BRAND_LOGO_ASPECT,
  BRAND_LOGO_HEIGHT,
  BRAND_LOGO_PNG,
  BRAND_LOGO_WIDTH,
} from "@/components/brand/brand-assets";
import { cn } from "@/lib/cn";

type BrandImageProps = {
  className?: string;
  height?: number;
  priority?: boolean;
};

export function FlexOfficersLogo({
  className,
  height = 44,
  priority = false,
}: BrandImageProps) {
  const width = Math.round(height * BRAND_LOGO_ASPECT);

  return (
    <Image
      src={BRAND_LOGO_PNG}
      alt="FlexOfficers"
      width={width}
      height={height}
      sizes={
        className?.includes("landing-nav-logo-image")
          ? "(max-width: 389px) 88px, (max-width: 767px) 100px, (max-width: 1023px) 113px, 280px"
          : "(max-width: 767px) 200px, (max-width: 1023px) 240px, 280px"
      }
      quality={100}
      className={cn("block h-auto w-auto max-w-full object-contain", className)}
      style={
        className?.includes("landing-nav-logo-image")
          ? undefined
          : { height, width: "auto", maxHeight: height }
      }
      priority={priority}
    />
  );
}

export function FlexOfficersBadge({
  className,
  height = 44,
  priority = false,
}: BrandImageProps) {
  return (
    <Image
      src={BRAND_BADGE_PNG}
      alt="FlexOfficers"
      width={height}
      height={height}
      sizes={`${height}px`}
      quality={100}
      className={cn("block h-auto w-auto shrink-0 object-contain", className)}
      style={{ height, width: height }}
      priority={priority}
    />
  );
}

type FlexOfficersLogoLinkProps = BrandImageProps & {
  href?: string;
  imageClassName?: string;
};

export function FlexOfficersLogoLink({
  href = "/",
  className,
  imageClassName,
  height = 44,
  priority = false,
}: FlexOfficersLogoLinkProps) {
  return (
    <Link href={href} className={cn("inline-flex shrink-0 items-center", className)}>
      <FlexOfficersLogo
        height={height}
        priority={priority}
        className={cn("max-w-none", imageClassName)}
      />
    </Link>
  );
}

type FlexOfficersBadgeLinkProps = BrandImageProps & {
  href?: string;
};

export function FlexOfficersBadgeLink({
  href = "/",
  className,
  height = 40,
  priority = false,
}: FlexOfficersBadgeLinkProps) {
  return (
    <Link href={href} className={cn("inline-flex shrink-0 items-center", className)}>
      <FlexOfficersBadge height={height} priority={priority} />
    </Link>
  );
}

type BrandHeaderProps = {
  className?: string;
  logoHeight?: number;
  href?: string;
  showWordmark?: boolean;
};

export function BrandHeader({
  className,
  logoHeight = 52,
  href = "/",
  showWordmark = true,
}: BrandHeaderProps) {
  return (
    <div className={cn("flex justify-center", className)}>
      <Link href={href} className="inline-flex shrink-0 items-center">
        {showWordmark ? (
          <FlexOfficersLogo height={logoHeight} priority />
        ) : (
          <FlexOfficersBadge height={logoHeight} priority />
        )}
      </Link>
    </div>
  );
}

export {
  BRAND_BADGE_ASPECT,
  BRAND_BADGE_PNG,
  BRAND_BADGE_SIZE,
  BRAND_LOGO_ASPECT,
  BRAND_LOGO_HEIGHT,
  BRAND_LOGO_PNG,
  BRAND_LOGO_WIDTH,
};
