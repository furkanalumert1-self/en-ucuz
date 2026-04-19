"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { login } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function loginAction(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const valid = await login(username, password);
  if (!valid) redirect("/admin/login?error=1");
  const cookieStore = await cookies();
  cookieStore.set("admin_session", process.env.SESSION_SECRET!, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24,
  });
  redirect("/admin/fiyatlar");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  redirect("/admin/login");
}

export async function approveReport(id: number) {
  await prisma.priceReport.update({ where: { id }, data: { status: "approved" } });
}

export async function rejectReport(id: number) {
  await prisma.priceReport.update({ where: { id }, data: { status: "rejected" } });
}
