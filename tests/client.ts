import thisval from "thisval";

import type { OpfelMusigClient } from "@/core/client";

declare const client: OpfelMusigClient;

{
  const response = await client.catalog.songs.get("");

  const song = response.data[0]!;

  thisval.is.type<"songs">(song.type);

  thisval.has.keys(song.attributes, "name", "albumName");
  thisval.has.notKeys(song.attributes, "audioVariants");
}

{
  const response = await client.catalog.songs.getRelationship("", "syllable-lyrics");

  const song = response.data[0]!;

  thisval.is.type<"syllable-lyrics">(song.type);

  thisval.has.keys(song.attributes, "playParams");
  thisval.has.notKeys(song.attributes, "ttmlLocalizations");
}
