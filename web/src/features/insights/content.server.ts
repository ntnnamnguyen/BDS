import "server-only";

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

import {
  postMetadataSchema,
  type PostSummary,
} from '@/features/insights/schemas';

const contentDirectory = path.join(process.cwd(), 'content');

export function getAllPosts(): PostSummary[] {
  if (!fs.existsSync(contentDirectory)) return [];

  const fileNames = fs.readdirSync(contentDirectory);
  
  return fileNames
    .filter((fn) => fn.endsWith('.mdx'))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx$/, '');
      const fullPath = path.join(contentDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);
      const metadata = postMetadataSchema.parse(data);

      return {
        slug,
        ...metadata,
      };
    })
    .sort((a, b) => (new Date(b.date).getTime() - new Date(a.date).getTime()));
}

export async function getPostBySlug(slug: string) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return null;

  try {
    const fullPath = path.join(contentDirectory, `${slug}.mdx`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      metadata: postMetadataSchema.parse(data),
      content,
    };
  } catch (error: unknown) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return null;
    throw error;
  }
}
