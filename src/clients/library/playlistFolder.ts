import { ResourceClient } from "@/clients/resource";
import { collect, defineScopes } from "@/helpers/public";
import { RequestQueryBuilder } from "@/helpers/requestQuery";
import type { ConfigParam, DefaultParams } from "@/types/params";
import type { Registry } from "@/types/query/registry";
import type { ResourceResponse } from "@/types/query/response";
import type { ResourceScopes, ScopedResourceIterator } from "@/types/query/scopes";
import type { MutateLibraryPlaylistFolder } from "@/types/resources/library/mutate/playlistFolder";

export const ROOT_FOLDER_ID = "p.playlistsroot";

const type = "library-playlist-folders" as const satisfies keyof Registry;
type TResource = Registry[typeof type];

const playlistFolderTreeLimit = 100;

export const playlistFolderTreeScopes = defineScopes({
  "library-playlist-folders": {
    relationships: {
      children: { mode: "relate", limit: playlistFolderTreeLimit },
      parent: "relate",
    },
  },
});

export class LibraryPlaylistFolderClient extends ResourceClient<typeof type, TResource> {
  protected readonly type = "playlist-folders";

  async getRoot<const TScopes extends ResourceScopes = {}>(opts: DefaultParams<TScopes> = {}) {
    type Result = ResourceResponse<TResource, TScopes>;

    const query = new RequestQueryBuilder()
      .params(opts)
      .setStringArray("filter[identity]", "playlistsroot");

    const result = await this.http.request<Result>(`${this.path}/${this.type}`, {
      config: opts.config,
      query,
    });

    return this.prepare(result);
  }

  async create<const TScopes extends ResourceScopes = {}>(
    attributes: MutateLibraryPlaylistFolder["attributes"],
    opts: DefaultParams<TScopes> & {
      parentId?: string;
    } = {},
  ) {
    type Result = ResourceResponse<TResource, TScopes>;

    const query = new RequestQueryBuilder().params(opts);

    const body: MutateLibraryPlaylistFolder = {
      attributes,
    };

    if (opts.parentId) {
      body.relationships = {
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
    attributes: Partial<MutateLibraryPlaylistFolder["attributes"]>,
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

  /** Only returns references for children. */
  async *iterateAll(
    opts: ConfigParam & {
      folderId?: string;
    } = {},
  ): ScopedResourceIterator<TResource, typeof playlistFolderTreeScopes> {
    const seenFolderIds = new Set<string>();
    let folderIds = [opts.folderId ?? ROOT_FOLDER_ID];

    while (folderIds.length > 0) {
      const currentFolderIds = folderIds.filter((id) => {
        if (seenFolderIds.has(id)) return false;

        seenFolderIds.add(id);
        return true;
      });

      const folders = await Promise.all(
        currentFolderIds.map(async (folderId) => {
          const response = await this.get(folderId, {
            config: opts.config,
            scopes: playlistFolderTreeScopes,
          });

          const folder = response.data[0];

          if (!folder) {
            throw new Error(`Apple Music did not return playlist folder "${folderId}"`);
          }

          const children = folder.relationships?.children;

          if (!children?.next) return folder;

          const remainingChildren = await collect(
            this.iterate(
              (offset) =>
                this.getRelationship(folderId, "children", {
                  config: opts.config,
                  limit: playlistFolderTreeLimit,
                  offset,
                }),
              playlistFolderTreeLimit,
            ),
            { signal: opts.config?.signal },
          );

          children.data.push(
            ...remainingChildren.map((child) => ({
              id: child.id,
              type: child.type,
              ...(child.href ? { href: child.href } : {}),
            })),
          );
          children.next = undefined;

          return folder;
        }),
      );

      folderIds = [];

      for (const folder of folders) {
        yield folder;

        const children = folder.relationships?.children.data ?? [];

        for (const child of children) {
          if (child.type === "library-playlist-folders") {
            folderIds.push(child.id);
          }
        }
      }
    }
  }
}
