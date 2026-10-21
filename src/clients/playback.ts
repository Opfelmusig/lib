import type { HttpClient } from "@/core/http";
import type { ConfigParam } from "@/types/params";
import type {
  PlayActivityEvent,
  PlayActivityResponse,
  PlaybackResponse,
  PlaybackSong,
  PlaybackSongIds,
} from "@/types/playback";

const webPlaybackUrl = "https://play.music.apple.com/WebObjects/MZPlay.woa/wa/webPlayback";
const playActivityUrl = "https://universal-activity-service.itunes.apple.com/play";

export class PlaybackClient {
  constructor(private readonly http: HttpClient) {}

  async getSong(ids: PlaybackSongIds, opts: ConfigParam = {}): Promise<PlaybackSong> {
    const catalogId = ids.catalogId?.trim();
    const libraryId = ids.libraryId?.trim();

    if (!catalogId && !libraryId) {
      throw new Error("webPlayback requires a catalog or library ID.");
    }

    const response = await this.http.requestUrl<PlaybackResponse>(webPlaybackUrl, {
      config: opts.config,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...(catalogId
          ? libraryId
            ? { subscriptionAdamId: catalogId }
            : { salableAdamId: catalogId }
          : {}),
        ...(libraryId ? { universalLibraryId: libraryId } : {}),
      }),
    });

    const song = response.songList?.[0];

    if (!song) {
      throw new Error(
        `webPlayback returned no songs${response.status === undefined ? "." : ` (status ${response.status}).`}`,
      );
    }

    if (!song.assets?.length) {
      throw new Error("webPlayback returned a song without assets.");
    }

    return song;
  }

  async reportPlayActivity(
    events: PlayActivityEvent | PlayActivityEvent[],
    opts: ConfigParam = {},
  ): Promise<PlayActivityResponse> {
    const data = Array.isArray(events) ? events : [events];

    if (data.length === 0) {
      throw new Error("Play activity reporting requires at least one event.");
    }

    return this.http.requestUrl<PlayActivityResponse>(playActivityUrl, {
      config: opts.config,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: ({ developerToken, userToken }) => {
        if (!developerToken) {
          throw new Error("Play activity reporting requires a developer token.");
        }

        if (!userToken) {
          throw new Error("Play activity reporting requires a music user token.");
        }

        return JSON.stringify({
          client_id: "JSCLIENT",
          event_type: "JSPLAY",
          data: data.map((event) => ({
            ...event,
            "developer-token": developerToken,
            "user-token": userToken,
          })),
        });
      },
    });
  }
}
