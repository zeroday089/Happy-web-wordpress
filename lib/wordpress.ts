const BLOGGER_BASE_URL = "https://happyhooblog.blogspot.com";
const BLOGGER_FEED_PATH = "/feeds/posts/default";

export interface WordPressRenderedField {
  rendered: string;
}

export interface WordPressPost {
  id: number;
  date: string;
  modified: string;
  slug: string;
  link: string;
  title: WordPressRenderedField;
  content: WordPressRenderedField;
  excerpt: WordPressRenderedField;
  yoast_head_json?: {
    og_image?: Array<{ url: string }>;
  };
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url?: string;
      media_details?: {
        sizes?: {
          large?: { source_url?: string };
          medium_large?: { source_url?: string };
          medium?: { source_url?: string };
          thumbnail?: { source_url?: string };
        };
      };
    }>;
  };
  featuredImage?: string | null;
}

interface BloggerLink {
  rel: string;
  href: string;
}

interface BloggerEntry {
  id?: { $t?: string };
  published?: { $t?: string };
  updated?: { $t?: string };
  title?: { $t?: string };
  content?: { $t?: string };
  summary?: { $t?: string };
  link?: BloggerLink[];
  "media$thumbnail"?: { url?: string };
}

interface BloggerFeedResponse {
  feed?: {
    entry?: BloggerEntry[];
  };
}

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://happyho.in";

function decodeNumericEntities(value: string): string {
  return value
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
    .replace(/&#x([\da-fA-F]+);/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)));
}

function decodeHtmlEntities(value: string): string {
  return decodeNumericEntities(value)
    .replace(/&#038;/g, "&")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
}

export function sanitizeWordPressHtml(value: string): string {
  return decodeNumericEntities(
    value
      .replace(/\[(.*?)\]/g, "")
      .replace(/&#[xX]?[0-9a-fA-F]+;/g, "")
      .trim(),
  );
}

export function stripHtml(value: string): string {
  const withoutTags = sanitizeWordPressHtml(value).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return decodeHtmlEntities(withoutTags);
}

function normalizeImageUrl(value?: string): string | null {
  if (!value) {
    return null;
  }

  const cleaned = decodeHtmlEntities(value).replace(/\\/g, "").trim();

  if (!cleaned) {
    return null;
  }

  if (cleaned.startsWith("//")) {
    return `https:${cleaned}`;
  }

  if (cleaned.startsWith("http://") || cleaned.startsWith("https://")) {
    return cleaned;
  }

  return null;
}

function extractFirstImageFromHtml(content: string): string | null {
  const match = content.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i);
  return normalizeImageUrl(match?.[1]);
}

function upscaleBloggerImageUrl(value: string): string {
  return value.replace(/\/s\d+(?:-[a-z])?(?=\/|$)/i, "/s1600");
}

function canonicalizeBloggerImageUrl(value: string): string {
  const normalized = normalizeImageUrl(value);
  if (!normalized) return value;
  return normalized
    .replace(/\/s\d+(?:-[a-z])?(?=\/|$)/gi, "/s0")
    .replace(/=w\d+-h\d+(?:-[a-z0-9-]+)?$/i, "")
    .replace(/\?.*$/, "")
    .replace(/#.*$/, "");
}

function deriveSlugFromLink(value: string): string {
  try {
    const pathname = new URL(value).pathname;
    const tail = pathname.split("/").filter(Boolean).pop() ?? "";
    return tail.replace(/\.html$/, "");
  } catch {
    return value;
  }
}

function parseBloggerId(value?: string): number {
  if (!value) return Date.now();
  const match = value.match(/post-(\d+)/);
  if (match) return Number(match[1]);
  const digits = value.replace(/\D/g, "");
  return digits ? Number(digits.slice(-12)) : Date.now();
}

function mapEntryToPost(entry: BloggerEntry): WordPressPost | null {
  const alternateLink = entry.link?.find((item) => item.rel === "alternate")?.href;
  if (!alternateLink) return null;

  const content = entry.content?.$t ?? "";
  const summary = entry.summary?.$t ?? content;

  const thumbnailUrl = normalizeImageUrl(entry["media$thumbnail"]?.url);
  const contentImageUrl = extractFirstImageFromHtml(content);
  const preferredImage = contentImageUrl ?? thumbnailUrl;

  return {
    id: parseBloggerId(entry.id?.$t),
    date: entry.published?.$t ?? new Date().toISOString(),
    modified: entry.updated?.$t ?? entry.published?.$t ?? new Date().toISOString(),
    slug: deriveSlugFromLink(alternateLink),
    link: alternateLink,
    title: { rendered: entry.title?.$t ?? "Untitled" },
    content: { rendered: content },
    excerpt: { rendered: summary },
    featuredImage: preferredImage ? upscaleBloggerImageUrl(preferredImage) : null,
  };
}

export function resolvePostImage(post: WordPressPost): string {
  const media = post._embedded?.["wp:featuredmedia"]?.[0];

  const featuredMediaUrl =
    media?.media_details?.sizes?.large?.source_url ??
    media?.media_details?.sizes?.medium_large?.source_url ??
    media?.media_details?.sizes?.medium?.source_url ??
    media?.source_url ??
    media?.media_details?.sizes?.thumbnail?.source_url;

  return (
    normalizeImageUrl(post.featuredImage ?? undefined) ??
    normalizeImageUrl(featuredMediaUrl) ??
    normalizeImageUrl(post.yoast_head_json?.og_image?.[0]?.url) ??
    "/67.png"
  );
}

export function removeDuplicateFeaturedImageFromContent(contentHtml: string, featuredImageUrl: string): string {
  const sanitizedContent = sanitizeWordPressHtml(contentHtml);
  const normalizedFeatured = normalizeImageUrl(featuredImageUrl);

  if (!normalizedFeatured) {
    return sanitizedContent;
  }

  const leadingImageMatch = sanitizedContent.match(
    /^\s*(?:<p[^>]*>\s*)?(?:<a[^>]*>\s*)?<img[^>]*src=["']([^"']+)["'][^>]*>(?:\s*<\/a>)?(?:\s*<\/p>)?\s*/i,
  );

  if (!leadingImageMatch?.[1]) {
    return sanitizedContent;
  }

  const firstImageUrl = normalizeImageUrl(leadingImageMatch[1]);
  if (!firstImageUrl) {
    return sanitizedContent;
  }

  const isDuplicate =
    canonicalizeBloggerImageUrl(firstImageUrl) === canonicalizeBloggerImageUrl(normalizedFeatured);

  if (!isDuplicate) {
    return sanitizedContent;
  }

  return sanitizedContent.replace(
    /^\s*(?:<p[^>]*>\s*)?(?:<a[^>]*>\s*)?<img[^>]*>(?:\s*<\/a>)?(?:\s*<\/p>)?\s*/i,
    "",
  );
}

async function fetchFromBlogger(pathWithQuery: string): Promise<BloggerFeedResponse> {
  const response = await fetch(`${BLOGGER_BASE_URL}${BLOGGER_FEED_PATH}${pathWithQuery}`, {
    next: { revalidate: 300 },
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return (await response.json()) as BloggerFeedResponse;
}

export async function fetchWordPressPosts(search?: string, page = 1, perPage = 10): Promise<WordPressPost[]> {
  const startIndex = (Math.max(page, 1) - 1) * perPage + 1;
  const params = new URLSearchParams({
    alt: "json",
    "max-results": String(perPage),
    "start-index": String(startIndex),
  });

  if (search && search.trim().length > 0) {
    params.set("q", search.trim());
  }

  const data = await fetchFromBlogger(`?${params.toString()}`);
  const entries = data.feed?.entry ?? [];
  return entries.map(mapEntryToPost).filter((post): post is WordPressPost => post !== null);
}

export async function fetchWordPressPostBySlug(slug: string): Promise<WordPressPost | null> {
  const params = new URLSearchParams({ alt: "json", "max-results": "150" });
  const data = await fetchFromBlogger(`?${params.toString()}`);
  const entries = data.feed?.entry ?? [];

  for (const entry of entries) {
    const mapped = mapEntryToPost(entry);
    if (mapped?.slug === slug) {
      return mapped;
    }
  }

  return null;
}

export async function fetchAllWordPressPostSlugs(): Promise<Array<Pick<WordPressPost, "slug" | "modified">>> {
  const params = new URLSearchParams({ alt: "json", "max-results": "150" });
  const data = await fetchFromBlogger(`?${params.toString()}`);
  const entries = data.feed?.entry ?? [];

  return entries
    .map(mapEntryToPost)
    .filter((post): post is WordPressPost => post !== null)
    .map((post) => ({ slug: post.slug, modified: post.modified }));
}
