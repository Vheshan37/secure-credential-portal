import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminClient from "@/components/admin/AdminClient";

export default async function AdminPage() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value;

  const user = token ? verifyToken(token) : null;

  if (!user) {
    redirect("/login");
  }

  return <AdminClient />;
}
