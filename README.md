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
