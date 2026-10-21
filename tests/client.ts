import thisval from "thisval";

import type { OpfelMusigClient } from "@/core/client";

declare const client: OpfelMusigClient;

{
  const response = client.catalog.songs.get("");

  const song = {} as Awaited<typeof response>["data"][number];

  thisval.is.type<"songs">(song.type);

  thisval.has.keys(song.attributes, "name", "albumName");
  thisval.has.notKeys(song.attributes, "audioVariants");
}

{
  const response = client.catalog.songs.getRelationship("", "syllable-lyrics");

  const song = {} as Awaited<typeof response>["data"][number];

  thisval.is.type<"syllable-lyrics">(song.type);

  thisval.has.keys(song.attributes, "playParams");
  thisval.has.notKeys(song.attributes, "ttmlLocalizations");
}
