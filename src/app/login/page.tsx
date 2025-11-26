import LoginForm from "@/components/LoginForm";
import Link from "next/link";

export default async function LoginPage(props: { searchParams: Promise<{ next?: string }> }) {
    const { next } = await props.searchParams;
    const nextPath = typeof next === "string" && next ? next : "/admin";
    return (
        <div className="max-w-md mx-auto grid gap-4">
            <div className="card p-6 grid gap-3">
                <h1 className="text-2xl font-semibold">Sign in</h1>
                <LoginForm nextPath={nextPath} />
            </div>
            <div className="text-center">
                <Link href="/" className="text-accent">Back to home</Link>
            </div>
        </div>
    );
}
