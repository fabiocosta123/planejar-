export interface ProCheckoutConfig {
  amount: number;
  apiBase: string;
  cnpj: string;
  integratorKey: string;
  webhookToken: string;
  sandbox: boolean;
  configured: boolean;
}

const DEFAULT_AMOUNT = 9.9;
const DEFAULT_API_BASE = "https://sandboxapi.mycredit.com.br";

export function readProCheckoutConfig(
  env: NodeJS.ProcessEnv = process.env
): ProCheckoutConfig {
  const parsedAmount = Number(env.PRO_PLAN_AMOUNT ?? DEFAULT_AMOUNT);
  const amount = Number.isFinite(parsedAmount) ? parsedAmount : DEFAULT_AMOUNT;
  const apiBase = (env.MYCREDIT_API_BASE ?? DEFAULT_API_BASE).replace(
    /\/$/,
    ""
  );
  const cnpj = (env.MYCREDIT_CNPJ ?? "").replace(/\D/g, "");
  const integratorKey = env.MYCREDIT_INTEGRATOR_KEY ?? "";
  const webhookToken = env.MYCREDIT_WEBHOOK_TOKEN ?? "";
  const sandbox = apiBase.includes("sandboxapi.mycredit.com.br");
  const configured =
    cnpj.length === 14 &&
    integratorKey.length > 0 &&
    amount >= 0.01;

  return {
    amount,
    apiBase,
    cnpj,
    integratorKey,
    webhookToken,
    sandbox,
    configured,
  };
}
