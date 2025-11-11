import {requireAuth} from "@/lib/auth-utils";
import {caller} from "@/trpc/server";
import {LogoutButton} from "@/app/logout";

const Page = async () => {
    await requireAuth()
    const data = await caller.getUsers()

  return (
      <div className="min-h-screen min-w-screen flex items-center justify-center">
          protected page {JSON.stringify(data)}
          <LogoutButton/>
      </div>
  );
}

export default Page;
