import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { redirect } from "next/navigation";
import UserClient from "@/components/guest/UserClient";

export default async function User() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value;

  const user = token ? await verifyToken(token) : null;

  if (!user || user.role !== "user") {
    redirect("/unauthorized");
  }

  return <UserClient user={user}/>;
}
