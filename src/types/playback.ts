export interface PlaybackSongIds {
  catalogId?: string;
  libraryId?: string;
}

export interface PlaybackAssetMetadata {
  bitRate?: number;
  duration?: number;
  fileExtension?: string;
}

export interface PlaybackAsset {
  URL: string;
  flavor?: string;
  metadata?: PlaybackAssetMetadata;
}

export interface PlaybackSong {
  assets: readonly PlaybackAsset[];
  needsPlaybackReporting?: boolean;
  songId: string | number;
  "widevine-cert-url"?: string;
  "hls-key-server-url"?: string;
}

export interface PlaybackResponse {
  songList?: readonly PlaybackSong[];
  status?: number;
}

export enum PlayActivityEventType {
  PlayEnd = 0,
  PlayStart = 1,
}

export enum PlayActivityEndReasonType {
  NotApplicable = 0,
  Other = 1,
  TrackSkippedForwards = 2,
  PlaybackManuallyPaused = 3,
  PlaybackSuspended = 4,
  ManuallySelectedPlaybackOfDifferentItem = 5,
  PlaybackPausedDueToInactivity = 6,
  NaturalEndOfTrack = 7,
  PlaybackStoppedDueToSessionTimeout = 8,
  TrackBanned = 9,
  FailedToLoad = 10,
  PausedOnTimeout = 11,
  ScrubBegin = 12,
  ScrubEnd = 13,
  TrackSkippedBackwards = 14,
  NotSupportedByClient = 15,
  QuickPlay = 16,
  ExitedApplication = 17,
}

export enum PlayActivityEventReasonHintType {
  NotSpecified = 0,
  ContainerChanged = 1,
}

export enum PlayActivityContainerType {
  Unknown = 0,
  Radio = 1,
  Playlist = 2,
  Album = 3,
  Artist = 4,
}

export enum PlayActivityItemType {
  Invalid = 0,
  ItunesStoreContent = 1,
  NonSongClip = 2,
  Ad = 3,
  Stream = 4,
  AudioAd = 5,
  VideoAd = 6,
  TimedMetadataPing = 7,
  ArtistUploadedContent = 8,
  AggregateNonCatalogPlayTime = 9,
  OriginalContentMovies = 10,
  OriginalContentShows = 11,
}

export enum PlayActivityMediaType {
  Audio = 0,
  Video = 1,
}

export enum PlayActivitySourceType {
  OriginatingDevice = 0,
  PairedWatch = 1,
  Sonos = 2,
  CarPlay = 3,
  WebAuc = 4,
  TwitterAuc = 5,
  MusicSdk = 6,
  AtvRemote = 7,
  WebPlayer = 8,
  WholeHouseAudio = 9,
  MusicKit = 10,
  Vw = 11,
  Unknown = 12,
  Amazon = 13,
  Porsche = 14,
  Chromecast = 15,
  WebApp = 16,
  MercedesBenz = 17,
  ThirdPartyTv = 18,
  Seat = 19,
  Cupra = 20,
}

export enum PlayActivityRepeatMode {
  Unknown = 0,
  Off = 1,
  One = 2,
  All = 3,
}

export enum PlayActivityShuffleMode {
  Unknown = 0,
  Off = 1,
  On = 2,
}

export enum PlayActivityAutoplayMode {
  Unknown = 0,
  Off = 1,
  On = 2,
  OnContentUnsupported = 3,
}

export interface PlayActivityIds {
  "auc-adam-id"?: string | number;
  "cloud-id"?: string;
  "lyric-id"?: string | number;
  "purchased-adam-id"?: string | number;
  "radio-adam-id"?: string | number;
  "reporting-adam-id"?: string | number;
  "subscription-adam-id"?: string | number;
}

export interface PlayActivityContainerIds {
  "album-adam-id"?: string;
  "cloud-album-id"?: string;
  "global-playlist-id"?: string;
  "station-hash"?: string;
  "station-id"?: string;
  "universal-library-id"?: string;
}

export interface PlayActivityPlayMode {
  "auto-play-mode": PlayActivityAutoplayMode;
  "repeat-play-mode": PlayActivityRepeatMode;
  "shuffle-play-mode": PlayActivityShuffleMode;
}

interface PlayActivityEventBase {
  "build-version": string;
  "internal-build": boolean;
  "media-duration-in-milliseconds": number;
  "media-type": PlayActivityMediaType;
  "milliseconds-since-play": number;
  offline: boolean;
  "persistent-id": string;
  "play-mode": PlayActivityPlayMode;
  "private-enabled": boolean;
  "sb-enabled": boolean;
  "siri-initiated": boolean;
  "source-type": PlayActivitySourceType;
  "start-position-in-milliseconds": number;
  "store-front": string;
  "user-agent": string;
  "utc-offset-in-seconds": number;
}

interface PlayActivityIdentifiedEvent extends PlayActivityEventBase {
  "container-ids"?: PlayActivityContainerIds;
  "container-type": PlayActivityContainerType;
  "feature-name": string;
  ids: PlayActivityIds;
  "reco-data"?: string;
  type: Exclude<PlayActivityItemType, PlayActivityItemType.AggregateNonCatalogPlayTime>;
}

export interface PlayActivityStartEvent extends PlayActivityIdentifiedEvent {
  "end-position-in-milliseconds"?: never;
  "end-reason-type"?: never;
  "event-reason-hint-type": PlayActivityEventReasonHintType;
  "event-type": PlayActivityEventType.PlayStart;
}

export interface PlayActivityEndEvent extends PlayActivityIdentifiedEvent {
  "end-position-in-milliseconds": number;
  "end-reason-type": PlayActivityEndReasonType;
  "event-reason-hint-type"?: never;
  "event-type": PlayActivityEventType.PlayEnd;
}

export interface PlayActivityAggregateEndEvent extends PlayActivityEventBase {
  "container-type"?: never;
  "end-position-in-milliseconds": number;
  "end-reason-type": PlayActivityEndReasonType.NotApplicable;
  "event-reason-hint-type"?: never;
  "event-type": PlayActivityEventType.PlayEnd;
  "feature-name"?: never;
  ids?: never;
  "play-mode": {
    "auto-play-mode": PlayActivityAutoplayMode.Unknown;
    "repeat-play-mode": PlayActivityRepeatMode.Unknown;
    "shuffle-play-mode": PlayActivityShuffleMode.Unknown;
  };
  "start-position-in-milliseconds": 0;
  type: PlayActivityItemType.AggregateNonCatalogPlayTime;
  "utc-offset-in-seconds": 0;
}

export type PlayActivityEvent =
  | PlayActivityStartEvent
  | PlayActivityEndEvent
  | PlayActivityAggregateEndEvent;

export interface PlayActivityResponse {
  [key: string]: unknown;
}
