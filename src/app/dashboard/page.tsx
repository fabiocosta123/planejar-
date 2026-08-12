import { auth } from "../../lib/auth";
import { Dashboard } from "../../components/dashboard/dashboard";

export default async function DashboardPage() {
  const session = await auth();

  return (
    <Dashboard
      userName={session?.user?.name}
    />
  );
}

