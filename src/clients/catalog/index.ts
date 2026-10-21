import { AlbumClient } from "@/clients/catalog/album";
import { GenreClient } from "@/clients/catalog/genre";
import { MusicVideoClient } from "@/clients/catalog/musicVideo";
import { PlaylistClient } from "@/clients/catalog/playlist";
import { SongClient } from "@/clients/catalog/song";
import { StationClient } from "@/clients/catalog/station";
import { StationGenreClient } from "@/clients/catalog/stationGenre";
import { BaseResourceClient, createResourceClient } from "@/clients/resource";
import type { HttpClient } from "@/core/http";
import { RequestQueryBuilder } from "@/helpers/requestQuery";
import type { CatalogResources, CatalogResourceTypes } from "@/types/combined";
import type { ResultParams, PaginationParams, ConfigParam, DefaultParams } from "@/types/params";
import type { ResourceResponse } from "@/types/query/response";
import type { ResultShape, ShapedResult } from "@/types/query/results";
import type { ResourceScopes } from "@/types/query/scopes";
import type { SearchCatalogHintsResult, SearchCatalogResult } from "@/types/results/search";

class ActivityClient extends createResourceClient("activities") {}
class AppleCuratorClient extends createResourceClient("apple-curators") {}
class ArtistClient extends createResourceClient("artists") {}
class ConcertClient extends createResourceClient("concerts") {}
class CreditArtistClient extends createResourceClient("credit-artists") {}
class CuratorClient extends createResourceClient("curators") {}
class LyricsClient extends createResourceClient("lyrics") {}
class RecordLabelClient extends createResourceClient("record-labels") {}
class RoleCategoryClient extends createResourceClient("role-categories") {}
class SyllableLyricsClient extends createResourceClient("syllable-lyrics") {}

export class CatalogClient extends BaseResourceClient {
  activities: ActivityClient;
  albums: AlbumClient;
  appleCurators: AppleCuratorClient;
  playlists: PlaylistClient;
  artists: ArtistClient;
  concerts: ConcertClient;
  creditArtists: CreditArtistClient;
  curators: CuratorClient;
  genres: GenreClient;
  lyrics: LyricsClient;
  musicVideos: MusicVideoClient;
  recordLabels: RecordLabelClient;
  roleCategories: RoleCategoryClient;
  songs: SongClient;
  stations: StationClient;
  stationGenres: StationGenreClient;
  syllableLyrics: SyllableLyricsClient;

  constructor(
    protected http: HttpClient,
    protected path: string,
  ) {
    super(http, path);

    this.activities = new ActivityClient(http, path);
    this.albums = new AlbumClient(http, path);
    this.appleCurators = new AppleCuratorClient(http, path);
    this.playlists = new PlaylistClient(http, path);
    this.artists = new ArtistClient(http, path);
    this.concerts = new ConcertClient(http, path);
    this.creditArtists = new CreditArtistClient(http, path);
    this.curators = new CuratorClient(http, path);
    this.genres = new GenreClient(http, path);
    this.lyrics = new LyricsClient(http, path);
    this.musicVideos = new MusicVideoClient(http, path);
    this.recordLabels = new RecordLabelClient(http, path);
    this.roleCategories = new RoleCategoryClient(http, path);
    this.songs = new SongClient(http, path);
    this.stations = new StationClient(http, path);
    this.stationGenres = new StationGenreClient(http, path);
    this.syllableLyrics = new SyllableLyricsClient(http, path);
  }

  async search<
    const TTypes extends ResultShape<SearchCatalogResult>,
    const TScopes extends ResourceScopes = {},
  >(term: string, opts: ResultParams<SearchCatalogResult, TTypes, TScopes> & PaginationParams) {
    type Result = ShapedResult<SearchCatalogResult, TTypes, TScopes>;

    const query = new RequestQueryBuilder()
      .params(opts)
      .setString("term", term)
      .setStringArray("with", [...(opts.shape.with ?? []), "serverBubbles"]);

    const result = await this.http.request<Result>(`${this.path}/search`, {
      config: opts.config,
      query,
    });

    return this.prepareResults(result);
  }

  async searchHints(term: string, opts: ConfigParam = {}) {
    const query = new RequestQueryBuilder().params(opts).setString("term", term);

    const result = await this.http.request<SearchCatalogHintsResult>(`${this.path}/search/hints`, {
      config: opts.config,
      query,
    });

    return result.results.terms;
  }

  async getMany<const TScopes extends ResourceScopes = {}>(
    ids: Partial<Record<CatalogResourceTypes, string[]>>,
    opts: DefaultParams<TScopes> = {},
  ) {
    type Result = ResourceResponse<CatalogResources, TScopes>;

    const query = new RequestQueryBuilder().params(opts);

    for (const [key, value] of Object.entries(ids)) {
      query.setStringArray("ids", value, key);
    }

    const result = await this.http.request<Result>(this.path, {
      config: opts.config,
      query,
    });

    return this.prepare(result);
  }
}
