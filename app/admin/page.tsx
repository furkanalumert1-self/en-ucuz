import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export default async function AdminPage() {
  const isAdmin = await getSession();
  redirect(isAdmin ? "/admin/fiyatlar" : "/admin/login");
}
