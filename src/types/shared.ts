export interface ArtworkColor {
  bgColor?: string;
  gradient?: {
    color?: string;
    y2?: number;
  };

  textColor1?: string;
  textColor2?: string;
  textColor3?: string;
  textColor4?: string;
  textGradient?: readonly [string, string];
}

export interface Artwork extends ArtworkColor {
  url: string;
  alt?: string;
  hasP3?: boolean;

  height: number;
  width: number;
}

export interface Preview {
  artwork?: Artwork;
  url: string;
  hlsUrl?: string;
}

export interface Description {
  short?: string;
  standard: string;
}

export interface EditorialNote {
  short?: string;
  standard?: string;
  name?: string;
  tagline?: string;
}

export interface PlayParameters {
  format?: string;
  hasDrm?: boolean;
  id: string;
  isLibrary?: boolean;
  kind: string;
  mediaType?: number;
  reporting?: boolean;
  reportingId?: string;
  catalogId?: string;
  stationHash?: string;
}

export type AudioVariants =
  | "atmos"
  | "hi-res-lossless"
  | "lossless"
  | "lossy-stereo"
  | "spatial"
  | "dolby-atmos"
  | "dolby-audio";

export type ContentRating = "clean" | "explicit";

export type RatingValue = 1 | -1;

export interface MotionVideo {
  alt?: string;
  previewFrame: Artwork;
  video: string;
}

export interface EditorialVideo {
  motionDetailSquare?: MotionVideo;
  motionDetailTall?: MotionVideo;
  motionSquareVideo1x1?: MotionVideo;
  motionTallVideo3x4?: MotionVideo;
  motionWideVideo21x9?: MotionVideo;
}

export interface EditorialArtwork {
  brandLogo?: Artwork;
  musicContentColorLogoTrimmed?: Artwork;
  staticDetailSquare?: Artwork;
  staticDetailTall?: Artwork;
  subscriptionCover?: Artwork;
  subscriptionHero?: Artwork;
  superHeroTall?: Artwork;
  superHeroWide?: Artwork;
}

export interface AssetUrls {
  enhancedHls?: string;
  lightweight?: string;
  lightweightPlus?: string;
  plus?: string;
  superLightweight?: string;
}

export interface Offer {
  buyParams: string;
  price: number;
  priceFormatted: string;
  type: string;
}
