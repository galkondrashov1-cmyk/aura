import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PageRenderer } from "@/components/renderer/page-renderer";
import { getPublicPage, publicMetadata } from "@/lib/public-page";
import { buildHrefMap } from "@/lib/links-server";

type Params = { params: Promise<{ username: string }> };

// Public pages are static (ISR): rendered on first visit, then served from the
// CDN until the owner publishes again (revalidateUser) or an hour passes —
// no database round-trip for visitors.
export const revalidate = 3600;
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { username } = await params;
  return publicMetadata(await getPublicPage(username), `/${username.toLowerCase()}`);
}

export default async function UserPage({ params }: Params) {
  const { username } = await params;
  const data = await getPublicPage(username);
  if (!data) notFound();

  return (
    <PageRenderer
      content={data.content}
      trackPageId={data.pageId}
      renderedAt={data.renderedAt}
      hrefs={buildHrefMap(data.content, data.pageId)}
      hideBadge={data.caps.removeBadge}
    />
  );
}
