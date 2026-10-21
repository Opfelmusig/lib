import type { Resource } from "@/types/query/resource";
import type { EditorialArtwork, EditorialNote, EditorialVideo } from "@/types/shared";

interface EditorialCard {
  display: {
    decorations: readonly string[];
  };
  editorialArtwork: EditorialArtwork;
  editorialVideo: EditorialVideo;
  kind: "musicSuperHero";
  plainEditorialNotes: EditorialNote;
}

interface CatalogEditorialItemAttributes {
  editorialArtwork: EditorialArtwork;
  editorialVideo: EditorialVideo;
  link: {
    feature: string;
    target: string;
    url: string;
  };
  plainEditorialCard?: Record<string, EditorialCard>;
  plainEditorialNotes: EditorialNote;
  url: string;
}

export type CatalogEditorialItem = Resource<"editorial-items", CatalogEditorialItemAttributes>;
