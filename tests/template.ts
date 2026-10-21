import { defineScopes } from "@/helpers/public";
import type { ResourceOf, ResourceTemplate } from "@/types/query/helpers";
import type { ScopedResource, ScopedResourceOf } from "@/types/query/scopes";

{
  const scopes = defineScopes({
    songs: {
      fields: ["name", "artwork"],
      relationships: {
        artists: "include",
      },
    },
    artists: {
      fields: ["name"],
    },
  });

  type Song = ScopedResourceOf<"songs", typeof scopes>;

  const song = {} as Song;

  void song.attributes?.name;
  void song.relationships?.artists.data[0]?.attributes?.name;
}

{
  type Template = ResourceTemplate<
    ResourceOf<"albums">,
    "name" | "artistName",
    "artistUrl",
    {
      artists: ResourceTemplate<ResourceOf<"artists">, "name">;
    },
    {
      "other-versions": ResourceTemplate<ResourceOf<"albums">, "name">;
    }
  >;

  const test = (resource: Template) => {
    void resource.attributes?.name;
    void resource.relationships?.artists.data[0]?.type;
  };

  type Response = ScopedResource<
    ResourceOf<"albums">,
    {
      albums: {
        fields: ["name", "artistName"];
        extend: ["artistUrl"];
        relationships: {
          artists: "include";
        };
        views: {
          "other-versions": true;
        };
      };
    }
  >;

  const album = {} as Response;

  test(album);
}

{
  type Template = ResourceTemplate<
    ResourceOf<"songs">,
    never,
    never,
    {
      albums?: ResourceTemplate<ResourceOf<"albums">>;
    }
  >;

  type Resource = ResourceTemplate<
    ResourceOf<"songs">,
    never,
    never,
    {
      artists?: ResourceTemplate<ResourceOf<"artists">>;
    }
  >;

  const test = (resource: Template) => {
    void resource.relationships?.albums?.data[0];
  };

  const song = {} as Resource;

  test(song);

  type Response = ScopedResource<
    ResourceOf<"songs">,
    {
      songs: {
        relationships: {
          artists: "include";
        };
      };
    }
  >;

  test({} as Response);
}
