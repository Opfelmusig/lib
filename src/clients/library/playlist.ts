import { LibraryResourceClient } from "@/clients/resource";
import { RequestQueryBuilder } from "@/helpers/requestQuery";
import type { MutateRelationshipItems } from "@/types/mutate";
import type { ConfigParam, DefaultParams } from "@/types/params";
import type { Registry } from "@/types/query/registry";
import type { ResourceResponse } from "@/types/query/response";
import type { ResourceScopes } from "@/types/query/scopes";
import type { MutateLibraryPlaylist } from "@/types/resources/library/mutate/playlist";

const type = "library-playlists" as const satisfies keyof Registry;
type TResource = Registry[typeof type];

export class LibraryPlaylistClient extends LibraryResourceClient<typeof type, TResource> {
  protected readonly type = "playlists";

  async create<const TScopes extends ResourceScopes = {}>(
    attributes: MutateLibraryPlaylist["attributes"],
    opts: DefaultParams<TScopes> & {
      tracks?: MutateRelationshipItems<MutateLibraryPlaylist, "tracks">;
      parentId?: string;
    } = {},
  ) {
    type Result = ResourceResponse<TResource, TScopes>;

    const query = new RequestQueryBuilder().params(opts);

    const body: MutateLibraryPlaylist = {
      attributes,
    };

    if (opts.tracks) {
      body.relationships = {
        tracks: {
          data: opts.tracks,
        },
      };
    }

    if (opts.parentId) {
      body.relationships = {
        ...body.relationships,
        parent: {
          data: [
            {
              id: opts.parentId,
              type: "library-playlist-folders",
            },
          ],
        },
      };
    }

    const result = await this.http.request<Result>(`${this.path}/${this.type}`, {
      config: opts.config,
      query,
      body: JSON.stringify(body),
      method: "POST",
    });

    return this.prepare(result);
  }

  async edit(
    id: string,
    attributes: Partial<MutateLibraryPlaylist["attributes"]>,
    opts: ConfigParam = {},
  ) {
    await this.http.request(`${this.path}/${this.type}/${id}`, {
      config: opts.config,
      body: JSON.stringify({
        attributes,
      }),
      method: "PATCH",
    });
  }

  async delete(id: string, opts: ConfigParam = {}) {
    await this.http.request(`${this.path}/${this.type}/${id}`, {
      config: opts.config,
      method: "DELETE",
    });
  }

  async removeTracks(id: string, songIds: string[], opts: ConfigParam = {}) {
    if (songIds.length === 0) return;

    const query = new RequestQueryBuilder()
      .setStringArray("ids", songIds, "library-songs")
      .setString("mode", "all");

    await this.http.request(`${this.path}/${this.type}/${id}/tracks`, {
      config: opts.config,
      query,
      method: "DELETE",
    });
  }

  async setTracks(
    id: string,
    tracks: MutateRelationshipItems<MutateLibraryPlaylist, "tracks">,
    opts: ConfigParam = {},
  ) {
    await this.http.request(`${this.path}/${this.type}/${id}/tracks`, {
      config: opts.config,
      body: JSON.stringify({
        data: tracks,
      }),
      method: "PUT",
    });
  }

  async setParent(id: string, parentId: string, opts: ConfigParam = {}) {
    await this.http.request(`${this.path}/${this.type}/${id}/parent`, {
      config: opts.config,
      body: JSON.stringify({
        data: [
          {
            id: parentId,
            type: "library-playlist-folders",
          },
        ],
      }),
      method: "PUT",
    });
  }

  async appendTracks(
    id: string,
    tracks: MutateRelationshipItems<MutateLibraryPlaylist, "tracks">,
    opts: ConfigParam = {},
  ) {
    await this.http.request(`${this.path}/${this.type}/${id}/tracks`, {
      config: opts.config,
      body: JSON.stringify({
        data: tracks,
      }),
      method: "POST",
    });
  }
}
