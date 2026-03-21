import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import EditorLayout from "../(root)/_components/EditorLayout";

export default async function EditorPage() {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) redirect("/");
    return <EditorLayout />;
}
