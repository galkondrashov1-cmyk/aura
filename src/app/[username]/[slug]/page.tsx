import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PageRenderer } from "@/components/renderer/page-renderer";
import { getPublicPage, publicMetadata } from "@/lib/public-page";
import { buildHrefMap } from "@/lib/links-server";

type Params = { params: Promise<{ username: string; slug: string }> };

// A user's additional pages: useaura.me/<username>/<slug>. Same ISR setup as
// the main profile route.
export const revalidate = 3600;
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { username, slug } = await params;
  return publicMetadata(await getPublicPage(username, slug), `/${username.toLowerCase()}/${slug.toLowerCase()}`);
}

export default async function UserSubPage({ params }: Params) {
  const { username, slug } = await params;
  const data = await getPublicPage(username, slug);
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
