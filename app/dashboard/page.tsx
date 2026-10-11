import { auth } from "@clerk/nextjs/server"

export default async function DashboardPage() {
  await auth.protect()

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-3 px-6 py-16">
      <h1 className="text-3xl font-semibold">Your dashboard</h1>
      <p className="text-muted-foreground">
        You are signed in. This page is only available to authenticated users.
      </p>
    </main>
  )
}
