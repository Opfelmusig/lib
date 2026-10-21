# Öpfelmusig

A fully typed Apple Music API client.

Öpfelmusig is the literal Swiss German translation of "Apple Music":

- Öpfel = Swiss German for "apple" (standard German: "Apfel")
- Musig = Swiss German for "music" (standard German: "Musik")

I intend to use it primarily for my own projects, so I do not plan to make it production-ready (though it may become so).

## Getting started

```ts
import { OpfelMusigClient } from "@opfelmusig/lib";

export const client = new OpfelMusigClient({
  developerToken: token.developer,
  userToken: token.user,
});

await client.useUserDefault();

const result = await client.catalog.songs.get("1866862252", {
  scopes: {
    songs: { fields: ["name"], relationships: { library: "include" } },
  },
});
```

Most of the library should hopefully be self-explanatory. For more in-depth examples, see how it's used in the [Öpfelmusig app](https://github.com/opfelmusig/app).

## Examples

### Load all library songs

```ts
import { collect } from "@opfelmusig/lib/helpers";

const songs = await collect(client.library.songs.iterateAll());
```

### Shared scopes

Reuse field and relationship selections across requests and derive matching TypeScript types from them.

```ts
import { defineScopes } from "@opfelmusig/lib";
import type { ScopedResourceOf } from "@opfelmusig/lib/types";

const scopes = defineScopes({
  songs: { fields: ["name", "artwork"], extend: ["personalRating"] },
});

type Song = ScopedResourceOf<"songs", typeof scopes>;

// Usage

const result = await client.catalog.songs.get("SONG_ID", { scopes }); // result.data -> Song[]
```

### Error handling

```ts
import { AppleMusicError } from "@opfelmusig/lib";

try {
  await client.catalog.songs.get("SONG_ID");
} catch (error) {
  if (error instanceof AppleMusicError && error.status === 404) {
    console.log("Song not found");
  } else {
    throw error;
  }
}
```

### Artwork URLs

```ts
import { getArtworkUrl, getArtworkExpiresAt } from "@opfelmusig/lib/helpers";

const thumbnail = getArtworkUrl(artwork, { width: 256, format: "webp" });
const expiresAt = getArtworkExpiresAt(artwork); // custom library song artworks normally expire after 24h
```

### Templates

Templates describe the resource shape a function accepts, independently of the scopes used to fetch it.

```ts
import type { ResourceTemplateOf } from "@opfelmusig/lib/types";

// Template

type Song = ResourceTemplateOf<
  "library-songs",
  never,
  never,
  { catalog: ResourceTemplateOf<"songs", never, "personalRating"> }
>;

function getRating(song: Song) {
  return song.relationships?.catalog.data[0]?.attributes?.personalRating;
}

// Usage

const { data } = await client.library.songs.get("SONG_ID", {
  scopes: {
    "library-songs": {
      relationships: { catalog: "include" },
    },
    songs: {
      extend: ["personalRating"],
    },
  },
});

const ratings = data.map(getRating);
```
