'use server'

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";

import {
  archiveAdminProject,
  createAdminProject,
} from "@/features/projects/api.server";

export async function createProject(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  if (name.length < 2) {
    throw new Error("Tên dự án phải có ít nhất 2 ký tự.");
  }

  const project = await createAdminProject({ name });

  updateTag("admin-projects");
  revalidatePath("/admin/projects");
  redirect(`/admin/projects/${project.id}/edit`);
}

export async function deleteProject(id: string) {
  if (!id.trim()) throw new Error("Thiếu mã dự án cần lưu trữ.");

  await archiveAdminProject(id);
  updateTag("admin-projects");
  updateTag("projects");
  revalidatePath("/admin/projects");
}
