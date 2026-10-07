import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';

import { MockDataBadge } from '@/components/ui/mock-data-badge';
import { PostLayout } from '@/features/insights/components/PostLayout';
import { getAllPosts, getPostBySlug } from '@/features/insights/content.server';
import { mdxComponents } from '@/features/insights/mdx/components';
import { isUiMockModeEnabled } from '@/lib/mocks/config';
import { getMockInsightArticle } from '@/lib/mocks/insights';

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function findInsightPost(slug: string) {
  const post = await getPostBySlug(slug);
  if (post) return { post, isMock: false } as const;
  if (!isUiMockModeEnabled()) return null;

  const mockPost = getMockInsightArticle(slug);
  return mockPost ? ({ post: mockPost, isMock: true } as const) : null;
}

// 1. Tối ưu hóa hiệu năng: Tạo sẵn các route tĩnh khi Build (Static Site Generation)
export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// 2. SEO Metadata động: Tự động lấy dữ liệu từ Frontmatter của MDX
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const resolvedPost = await findInsightPost(slug);
  const post = resolvedPost?.post;

  if (!post) return { title: 'Không tìm thấy bài viết | Hanoi Estate' };

  return {
    title: `${post.metadata.title} | Hanoi Estate Insights`,
    description: post.metadata.excerpt,
    openGraph: {
      title: post.metadata.title,
      description: post.metadata.excerpt,
      images: [
        {
          url: post.metadata.cover,
          width: 1200,
          height: 630,
          alt: post.metadata.title,
        },
      ],
      type: 'article',
      publishedTime: post.metadata.date,
      authors: [post.metadata.author || 'Hanoi Estate'],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.metadata.title,
      description: post.metadata.excerpt,
      images: [post.metadata.cover],
    },
  };
}

// 3. Render trang chi tiết bài viết
export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const resolvedPost = await findInsightPost(slug);

  // Nếu không tìm thấy file MDX tương ứng với slug, trả về trang 404
  if (!resolvedPost) {
    notFound();
  }

  const { post, isMock } = resolvedPost;

  return (
    <>
      {isMock && (
        <div className="fixed bottom-6 right-6 z-50 rounded-sm bg-white/95 p-2 shadow-lg backdrop-blur-sm">
          <MockDataBadge />
        </div>
      )}
      <PostLayout metadata={post.metadata}>
        {/* MDXRemote/RSC giúp render trực tiếp từ Server, 
            không cần 'use client' ở file này.
        */}
        <MDXRemote 
          source={post.content} 
          components={mdxComponents} 
        />
      </PostLayout>
    </>
  );
}
