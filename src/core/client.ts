import { CatalogClient } from "@/clients/catalog";
import { LibraryClient } from "@/clients/library";
import { MeClient } from "@/clients/me";
import { PlaybackClient } from "@/clients/playback";
import { SocialClient } from "@/clients/social";
import { StorefrontClient } from "@/clients/storefront";
import { HttpClient } from "@/core/http";
import { lyricScriptFromLanguage } from "@/helpers/language";
import type { OpfelMusigConfig } from "@/types/config";
import type { ConfigParam } from "@/types/params";
import type { ScopedResource } from "@/types/query/scopes";
import type { Storefront } from "@/types/resources/other/storefront";

export class OpfelMusigClient {
  http: HttpClient;
  catalog: CatalogClient;
  library: LibraryClient;
  storefront: StorefrontClient;
  me: MeClient;
  social: SocialClient;
  playback: PlaybackClient;

  private readonly apiVersion = "v1";

  async test(opts: ConfigParam = {}) {
    await this.http.request(`${this.apiVersion}/test`, {
      config: opts.config,
    });
  }

  /**
   * Use the logged-in user's default `storefront` and `language`.
   */
  async useUserDefault(opts: ConfigParam = {}): Promise<ScopedResource<Storefront>> {
    const storefront = await this.me.getStorefront({
      config: opts.config,
    });

    const userDefaultStorefront = storefront.data[0];

    if (!userDefaultStorefront) throw new Error("Apple Music API returned no user storefront");

    this.edit({
      storefront: userDefaultStorefront.id,
    });

    const language = userDefaultStorefront.attributes?.defaultLanguageTag;
    if (language) {
      this.edit({
        language: {
          default: language,
          lyrics: language,
          script: lyricScriptFromLanguage(language),
        },
      });
    }

    return userDefaultStorefront;
  }

  /**
   * Set the language using a language tag such as `de-CH`.
   */
  setLanguageFromTag(language?: string) {
    if (language) {
      this.edit({
        language: {
          default: language,
          lyrics: language,
          script: lyricScriptFromLanguage(language),
        },
      });
    }
  }

  /**
   * For each key:
   * - `T`: use the new value
   * - `undefined`: use the old value
   * - `null`: delete the value
   */
  edit: typeof this.http.edit;

  get config() {
    return this.http.conf;
  }

  constructor(config: OpfelMusigConfig = {}) {
    this.http = new HttpClient(config);
    this.edit = this.http.edit;

    this.catalog = new CatalogClient(this.http, `${this.apiVersion}/catalog/{{storefront}}`);
    this.library = new LibraryClient(this.http, `${this.apiVersion}/me/library`);
    this.me = new MeClient(this.http, `${this.apiVersion}/me`);
    this.storefront = new StorefrontClient(this.http, this.apiVersion);
    this.social = new SocialClient(this.http, `${this.apiVersion}/social/{{storefront}}`);
    this.playback = new PlaybackClient(this.http);
  }
}
