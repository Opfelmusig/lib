import thisval from "thisval";

import {
  defineResourceScope,
  defineScopes,
  isLibraryResource,
  isNotResourceType,
  isResourceType,
} from "@/helpers/public";
import type { ResultsOf, ShapedResult } from "@/types/query/results";
import type { ScopedResource } from "@/types/query/scopes";
import type { CatalogSong } from "@/types/resources/catalog/song";
import type { LibraryMusicVideo } from "@/types/resources/library/musicVideo";
import type { LibrarySong } from "@/types/resources/library/song";
import type { SearchCatalogResult } from "@/types/results/search";

{
  const song = {} as ScopedResource<CatalogSong, {}>;

  thisval.is.type<"songs">(song.type);

  thisval.has.keys(song.attributes, "name", "albumName");
  thisval.has.notKeys(song.attributes, "personalRating");
}

{
  const song = {} as ScopedResource<
    CatalogSong,
    {
      songs: {
        fields: ["name"];
        extend: ["personalRating"];
        relationships: {
          albums: "include";
        };
      };
    }
  >;

  thisval.is.notAny(song);

  thisval.is.type<"songs">(song.type);
  thisval.has.exactKeys(song.attributes, "name", "personalRating");
  thisval.has.exactKeys(song.relationships, "albums");
}

{
  const results = {} as ResultsOf<
    ShapedResult<
      SearchCatalogResult,
      {
        types: ["songs"];
      },
      {}
    >
  >;

  thisval.is.notAny(results.song);

  thisval.is.array<ScopedResource<CatalogSong, {}>>(results.song.data);
}

{
  const results = {} as ResultsOf<
    ShapedResult<
      SearchCatalogResult,
      {
        types: ["songs"];
        with: ["topResults"];
      },
      {
        songs: {
          relationships: {
            albums: "include";
          };
        };
      }
    >
  >;

  const top = results.top.data[0];

  if (top?.type === "songs") {
    thisval.has.exactKeys(top.relationships, "albums");
  }
}

{
  const song = {} as CatalogSong | LibrarySong;

  thisval.is.notAny(song);
  thisval.is.type<"songs" | "library-songs">(song.type);

  if (isLibraryResource(song)) {
    thisval.is.type<"library-songs">(song.type);

    // @ts-expect-error Catalog songs were excluded.
    thisval.is.type<"songs">(song.type);
  } else {
    thisval.is.type<"songs">(song.type);

    // @ts-expect-error The false branch excludes library resources.
    thisval.is.type<"library-songs">(song.type);
  }
}

{
  const songScope = defineResourceScope("songs", {
    fields: ["name"],
  });

  const scopes = defineScopes({
    songs: songScope,
  });

  const song = {} as ScopedResource<CatalogSong, typeof scopes>;

  thisval.is.notAny(song);

  thisval.is.type<"songs">(song.type);
  thisval.has.exactKeys(song.attributes, "name");
}

{
  const resource = {} as CatalogSong | LibrarySong | LibraryMusicVideo;

  if (isResourceType(resource, "library-songs", "library-music-videos")) {
    thisval.is.type<"library-songs" | "library-music-videos">(resource.type);

    // @ts-expect-error Catalog songs are not among the requested types.
    thisval.is.type<"songs">(resource.type);
  }

  if (isNotResourceType(resource, "library-songs", "library-music-videos")) {
    thisval.is.type<"songs">(resource.type);

    // @ts-expect-error Library songs were excluded.
    thisval.is.type<"library-songs">(resource.type);

    // @ts-expect-error Library music videos were excluded.
    thisval.is.type<"library-music-videos">(resource.type);
  }
}
