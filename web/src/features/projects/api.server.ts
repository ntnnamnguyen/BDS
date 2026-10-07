import "server-only";

import { cache } from "react";

import {
  parseCreateProjectInput,
  parseProjectListQuery,
  projectDetailPayloadSchema,
  projectListResponseSchema,
  type CreateProjectInput,
  type ProjectDetail,
  type ProjectListQuery,
  type ProjectListResponse,
} from "@/features/projects/schemas";
import { apiRequest } from "@/lib/api/client.server";
import { decodeApiResponse } from "@/lib/api/decode";
import { ApiError } from "@/lib/api/errors";
import { isApiMockFallbackEnabled } from "@/lib/env.server";
import {
  MOCK_PROJECTS,
  MOCK_PUBLIC_PROJECTS,
} from "@/lib/mocks/projects";

const PUBLIC_PROJECT_REVALIDATE_SECONDS = 60;

function getMockProjects(
  source: readonly ProjectDetail[],
  query: ProjectListQuery,
): ProjectListResponse {
  let projects = [...source];

  if (query.featured !== undefined) {
    projects = projects.filter((project) => project.featured === query.featured);
  }

  if (query.salesStatus) {
    projects = projects.filter(
      (project) => project.salesStatus === query.salesStatus,
    );
  }

  if (query.search) {
    const search = query.search.toLocaleLowerCase("vi");
    projects = projects.filter((project) =>
      [project.name, project.location, project.description]
        .filter((value): value is string => typeof value === "string")
        .some((value) => value.toLocaleLowerCase("vi").includes(search)),
    );
  }

  const page = query.page ?? 1;
  const limit = query.limit ?? 20;
  const start = (page - 1) * limit;
  const data = projects.slice(start, start + limit);

  return {
    data,
    meta: {
      page,
      limit,
      total: projects.length,
      totalPages: Math.ceil(projects.length / limit),
    },
  };
}

function buildProjectQuery(query: ProjectListQuery): string {
  const params = new URLSearchParams();
  if (query.page !== undefined) params.set("page", String(query.page));
  if (query.limit !== undefined) params.set("limit", String(query.limit));
  if (query.search) params.set("search", query.search);
  if (query.featured !== undefined) {
    params.set("featured", String(query.featured));
  }
  if (query.salesStatus) params.set("salesStatus", query.salesStatus);

  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
}

function decodeProjectList(payload: unknown): ProjectListResponse {
  return decodeApiResponse(
    projectListResponseSchema,
    payload,
    "danh sách dự án",
  );
}

function decodeProjectDetail(payload: unknown): ProjectDetail {
  return decodeApiResponse(projectDetailPayloadSchema, payload, "dự án");
}

export async function getProjects(
  query: ProjectListQuery = {},
): Promise<ProjectListResponse> {
  const parsedQuery = parseProjectListQuery(query);

  if (isApiMockFallbackEnabled()) {
    return getMockProjects(MOCK_PUBLIC_PROJECTS, parsedQuery);
  }

  const payload = await apiRequest(
    `/projects${buildProjectQuery(parsedQuery)}`,
    {
      next: {
        revalidate: PUBLIC_PROJECT_REVALIDATE_SECONDS,
        tags: ["projects"],
      },
    },
  );
  return decodeProjectList(payload);
}

export const getProjectBySlug = cache(
  async (slug: string): Promise<ProjectDetail> => {
    if (isApiMockFallbackEnabled()) {
      const project = MOCK_PUBLIC_PROJECTS.find(
        (candidate) => candidate.slug === slug,
      );
      if (project) return project;

      throw new ApiError("Không tìm thấy dự án mock.", {
        status: 404,
        code: "MOCK_PROJECT_NOT_FOUND",
      });
    }

    const payload = await apiRequest(`/projects/${encodeURIComponent(slug)}`, {
      next: {
        revalidate: PUBLIC_PROJECT_REVALIDATE_SECONDS,
        tags: ["projects", `project:${slug}`],
      },
    });
    return decodeProjectDetail(payload);
  },
);

export async function getAdminProjects(
  query: Pick<ProjectListQuery, "page" | "limit" | "search"> = {},
): Promise<ProjectListResponse> {
  const parsedQuery = parseProjectListQuery(query);

  if (isApiMockFallbackEnabled()) {
    return getMockProjects(MOCK_PROJECTS, parsedQuery);
  }

  const payload = await apiRequest(
    `/admin/projects${buildProjectQuery(parsedQuery)}`,
    { admin: true, cache: "no-store" },
  );
  return decodeProjectList(payload);
}

export async function getAdminProject(id: string): Promise<ProjectDetail> {
  if (isApiMockFallbackEnabled()) {
    const project = MOCK_PROJECTS.find((candidate) => candidate.id === id);
    if (project) return project;

    throw new ApiError("Không tìm thấy dự án mock trong trang quản trị.", {
      status: 404,
      code: "MOCK_ADMIN_PROJECT_NOT_FOUND",
    });
  }

  const payload = await apiRequest(
    `/admin/projects/${encodeURIComponent(id)}`,
    {
      admin: true,
      cache: "no-store",
    },
  );
  return decodeProjectDetail(payload);
}

export async function createAdminProject(
  input: CreateProjectInput,
): Promise<ProjectDetail> {
  const payload = await apiRequest("/admin/projects", {
    method: "POST",
    admin: true,
    cache: "no-store",
    body: parseCreateProjectInput(input),
  });
  return decodeProjectDetail(payload);
}

export async function archiveAdminProject(id: string): Promise<void> {
  await apiRequest(
    `/admin/projects/${encodeURIComponent(id)}/archive`,
    {
      method: "POST",
      admin: true,
      cache: "no-store",
    },
  );
}
