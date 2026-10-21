// oxlint-disable no-restricted-imports
import z, { ZodError } from "zod";

import { AppleMusicError, OpfelMusigClient } from "@/index";

const userToken = () => process.env.USER_TOKEN;
const developerToken = () => process.env.DEVELOPER_TOKEN;

export const client = new OpfelMusigClient({
  developerToken: developerToken,
  userToken: userToken,
  debug: true,
});

await client.useUserDefault();

export const TEST_ME = "1866862252";
export const TEST_ME_LIB = "i.8WdzrgpfMQBa4Vp";
export const TEST_ME_SINGLE = "1866862251";
export const CHANMINA = "1104839687";
export const CHANMINA_LIB = "r.IZlptIe";
export const SERENADE = "1858168846";
export const SERENADE_LIB = "i.2P0D1o3UVvBJ7x9";

try {
  for await (const folder of client.library.playlistFolders.iterateAll()) {
    console.log(
      `${folder.attributes?.name}, parent: ${folder.relationships?.parent.data[0]?.id}, children: ${folder.relationships?.children.data.length}`,
    );
  }
} catch (ex) {
  if (ex instanceof AppleMusicError) {
    console.log(`AM-ERR (${ex.message})`);
    if (ex.errors[0])
      console.log(
        `- [${ex.errors[0].status}] ${ex.errors[0].title}: ${ex.errors[0].detail} ${ex.errors[0].source?.parameter ? `(Param: ${ex.errors[0].source?.parameter})` : ""}`,
      );
  } else if (ex instanceof ZodError) {
    console.log(`ZOD-ERR (${ex.message})`);
    console.log(z.prettifyError(ex));
  } else {
    console.error("Unknown error", JSON.stringify(ex, null, 2));
  }
}
