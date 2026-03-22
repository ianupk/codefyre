export const dynamic = "force-dynamic";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import AuthForm from "./AuthForm";

export default async function RootPage() {
    const session = await auth.api.getSession({ headers: await headers() });
    if (session) redirect("/editor");
    return <AuthForm />;
}
