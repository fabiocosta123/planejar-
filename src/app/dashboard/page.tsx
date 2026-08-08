import { auth } from "../../lib/auth";


export default async function DashboardPage() {

  const session =
    await auth();


  return (
    <main>

      <h1>
        Dashboard
      </h1>

      <p>
        Usuário:
        {" "}
        {session?.user?.name ?? "Não identificado"}
      </p>

    </main>
  );

}