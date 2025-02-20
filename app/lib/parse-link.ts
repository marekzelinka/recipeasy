import urlMetadata from "url-metadata";

type LinkMetadata = urlMetadata.Result;

interface ParsedLink {
  title: string;
  author: string;
  image: string;
  favicon: string;
}

type ParseLinkResponse<Data, Error> =
  | {
      ok: true;
      data: Data;
    }
  | {
      ok: false;
      error: Error;
    };

export type ParseLinkData = ParseLinkResponse<ParsedLink, string>;

export async function parseLink({
  link,
}: {
  link: string;
}): Promise<ParseLinkData> {
  try {
    const metadata = await urlMetadata(link);

    const title = getLinkTitle(metadata);
    const author = getLinkAuthor(metadata);
    const image = getLinkImage(metadata);
    const linkOrigin = new URL(link).origin;
    const favicon = getLinkFavicon(linkOrigin, metadata);

    return { ok: true, data: { title, author, image, favicon } };
  } catch (error) {
    return { ok: false, error: "Invalid link" };
  }
}

function getLinkTitle(metadata: LinkMetadata) {
  return String(metadata.title || metadata["og:title"]);
}

function getLinkAuthor(metadata: LinkMetadata) {
  return String(
    metadata.author || metadata["og:site_name"] || metadata["twitter:site"],
  );
}

function getLinkImage(metadata: LinkMetadata) {
  return String(metadata.image || metadata["og:image"]);
}

function getLinkFavicon(orign: string, metadata: LinkMetadata) {
  const defaultFaviconUrl = `${orign}/favicon.ico`;

  type FaviconItem = {
    rel: string;
    href: string;
  };
  const metadataFavicons = metadata.favicons as FaviconItem[];

  const foundIcon = metadataFavicons.find((favicon) => favicon.rel === "icon");
  if (foundIcon) {
    return orign + foundIcon.href;
  }

  return defaultFaviconUrl;
}
