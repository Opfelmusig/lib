import { LibraryPlaylistClient } from "@/clients/library/playlist";
import { LibraryPlaylistFolderClient } from "@/clients/library/playlistFolder";
import { BaseResourceClient, createLibraryResourceClient } from "@/clients/resource";
import type { HttpClient } from "@/core/http";
import { RequestQueryBuilder } from "@/helpers/requestQuery";
import type {
  LibraryResources,
  LibraryResourceTypes,
  PinnableResources,
  RecentlyAddedResources,
} from "@/types/combined";
import type {
  ConfigParam,
  DefaultParams,
  LimitParam,
  PaginationParams,
  ResultParams,
} from "@/types/params";
import type { ResourceOf } from "@/types/query/helpers";
import type { ResourceResponse } from "@/types/query/response";
import type { ResultShape, ShapedResult } from "@/types/query/results";
import type { ResourceScopes, ScopedResourceIterator } from "@/types/query/scopes";
import type { SearchLibraryResult } from "@/types/results/search";

class LibraryAlbumClient extends createLibraryResourceClient<"library-albums">("albums") {}
class LibraryArtistClient extends createLibraryResourceClient<"library-artists">("artists") {}
class LibraryMusicVideoClient extends createLibraryResourceClient<"library-music-videos">(
  "music-videos",
) {}
class LibrarySongClient extends createLibraryResourceClient<"library-songs">("songs") {}

type LibraryMutationType = "albums" | "artists" | "music-videos" | "playlists" | "songs";
type LibraryMutationResponseType =
  | "library-albums"
  | "library-artists"
  | "library-music-videos"
  | "library-playlists"
  | "library-songs";

export class LibraryClient extends BaseResourceClient {
  songs: LibrarySongClient;
  albums: LibraryAlbumClient;
  artists: LibraryArtistClient;
  musicVideos: LibraryMusicVideoClient;
  playlists: LibraryPlaylistClient;
  playlistFolders: LibraryPlaylistFolderClient;

  constructor(http: HttpClient, path: string) {
    super(http, path);

    this.songs = new LibrarySongClient(http, path);
    this.albums = new LibraryAlbumClient(http, path);
    this.artists = new LibraryArtistClient(http, path);
    this.musicVideos = new LibraryMusicVideoClient(http, path);
    this.playlists = new LibraryPlaylistClient(http, path);
    this.playlistFolders = new LibraryPlaylistFolderClient(http, path);
  }

  async add<const TScopes extends ResourceScopes = {}>(
    ids: Partial<Record<LibraryMutationType, string[]>>,
    opts: DefaultParams<TScopes> = {},
  ) {
    type Result = ResourceResponse<ResourceOf<LibraryMutationResponseType>, TScopes>;

    const query = new RequestQueryBuilder().params(opts).setString("representation", "resources");

    for (const [key, value] of Object.entries(ids)) {
      query.setStringArray("ids", value, key);
    }

    const result = await this.http.request<Result>(this.path, {
      config: opts.config,
      query,
      method: "POST",
    });

    return this.prepare(result);
  }

  async remove(id: string, type: LibraryMutationType, opts: ConfigParam = {}) {
    await this.http.request(`${this.path}/${type}/${id}`, {
      config: opts.config,
      method: "DELETE",
    });
  }

  async getPins<const TScopes extends ResourceScopes = {}>(
    opts: DefaultParams<TScopes> & LimitParam = {},
  ) {
    type Result = ResourceResponse<PinnableResources, TScopes>;

    const query = new RequestQueryBuilder().params(opts);

    const result = await this.http.request<Result>(`${this.path}/pins`, {
      config: opts.config,
      query,
    });

    return this.prepare(result);
  }

  async pin(id: string, opts: ConfigParam = {}) {
    await this.http.request(`${this.path}/pins/${id}`, {
      config: opts.config,
      method: "POST",
    });
  }

  async unpin(id: string, opts: ConfigParam = {}) {
    await this.http.request(`${this.path}/pins/${id}`, {
      config: opts.config,
      method: "DELETE",
    });
  }

  async getRecentlyAdded<const TScopes extends ResourceScopes = {}>(
    opts: DefaultParams<TScopes> & PaginationParams = {},
  ) {
    type Result = ResourceResponse<RecentlyAddedResources, TScopes>;

    const query = new RequestQueryBuilder().params(opts);

    const result = await this.http.request<Result>(`${this.path}/recently-added`, {
      config: opts.config,
      query,
    });

    return this.prepare(result);
  }

  async search<
    const TTypes extends ResultShape<SearchLibraryResult>,
    const TScopes extends ResourceScopes = {},
  >(term: string, opts: ResultParams<SearchLibraryResult, TTypes, TScopes> & PaginationParams) {
    type Result = ShapedResult<SearchLibraryResult, TTypes, TScopes>;

    const query = new RequestQueryBuilder().params(opts).setString("term", term);

    const result = await this.http.request<Result>(`${this.path}/search`, {
      config: opts.config,
      query,
    });

    return this.prepareResults(result);
  }

  async getMany<const TScopes extends ResourceScopes = {}>(
    ids: Partial<Record<LibraryResourceTypes, string[]>>,
    opts: DefaultParams<TScopes> = {},
  ) {
    type Result = ResourceResponse<LibraryResources, TScopes>;

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

  iterateRecentlyAdded<const TScopes extends ResourceScopes = {}>(
    opts: DefaultParams<TScopes> & LimitParam = {},
  ): ScopedResourceIterator<RecentlyAddedResources, TScopes> {
    return this.iterate((offset) => this.getRecentlyAdded<TScopes>({ ...opts, offset }));
  }
}
