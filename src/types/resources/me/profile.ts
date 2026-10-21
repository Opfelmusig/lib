import type { Resource } from "@/types/query/resource";
import type { CatalogPlaylist } from "@/types/resources/catalog/playlist";
import type { Artwork } from "@/types/shared";

interface SocialProfileAttributes {
  artwork: Artwork;
  handle: string;
  isPrivate: boolean;
  isVerified: boolean;
  name: string;
  url: string;
}

interface SocialProfileExtend {
  followState: string;
}

export type SocialProfile = Resource<
  "social-profiles",
  SocialProfileAttributes,
  SocialProfileExtend,
  {
    "shared-playlists": CatalogPlaylist;
  }
>;

interface PersonalSocialProfileAttributes extends SocialProfileAttributes {
  acceptedTerms: readonly string[];
  collaborationAllowed: boolean;
  isContactCheckAllowed: boolean;
  isDiscoverableByContact: boolean;
  isOnboarded: boolean;
}

interface PersonalSocialProfileExtend {
  pendingFollowersCount: number;
}

export type PersonalSocialProfile = Resource<
  "personal-social-profiles",
  PersonalSocialProfileAttributes,
  PersonalSocialProfileExtend,
  {
    "shared-playlists": CatalogPlaylist;
    "social-profile": SocialProfile;
  }
>;
