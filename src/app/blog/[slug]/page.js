import { getBlogPostByIdAction } from "@/actions/blog";
import BlogDetails from "@/components/blog/BlogDetails";
import { notFound } from "next/navigation";
import { Suspense } from "react";

function Fallback() {
  return (
    <div className="flex h-[80vh] flex-col items-center justify-center space-y-4 text-gray-700">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-indigo-600"></div>
      <p className="text-lg font-medium">Loading blog post...</p>
    </div>
  );
}

export default async function BlogDetailsPage({ params }) {
  const { slug } = await params;
  const data = await getBlogPostByIdAction(slug);

  if (data.error) {
    notFound();
  }

  const { post } = data;

  return (
    <Suspense fallback={<Fallback />}>
      <BlogDetails post={JSON.parse(post)} />
    </Suspense>
  );
}
