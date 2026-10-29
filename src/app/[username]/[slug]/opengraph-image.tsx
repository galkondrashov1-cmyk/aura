import { getPublicPage } from "@/lib/public-page";
import { ogImage, OG_SIZE } from "@/lib/og";

export const alt = "Page preview";
export const size = OG_SIZE;
export const contentType = "image/png";
export const revalidate = 3600;

export default async function Image({ params }: { params: Promise<{ username: string; slug: string }> }) {
  const { username, slug } = await params;
  return ogImage(await getPublicPage(username, slug), `/${username.toLowerCase()}/${slug.toLowerCase()}`);
}
