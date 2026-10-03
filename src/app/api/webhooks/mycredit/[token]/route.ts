import { readProCheckoutConfig } from "../../../../../integrations/mycredit/config";
import { parseMyCreditWebhook } from "../../../../../integrations/mycredit/pix";
import { tokensMatch } from "../../../../../integrations/mycredit/tokens";
import { proCheckoutService } from "../../../../../services/pro-checkout.service";

export async function POST(
  request: Request,
  context: { params: Promise<{ token: string }> }
) {
  const { token } = await context.params;
  const config = readProCheckoutConfig();

  if (!tokensMatch(config.webhookToken, token)) {
    return new Response(null, { status: 404 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return new Response(null, { status: 400 });
  }

  const event = parseMyCreditWebhook(body);

  if (!event) {
    return new Response(null, { status: 400 });
  }

  try {
    await proCheckoutService.applyWebhook(event);
  } catch {
    return new Response(null, { status: 500 });
  }

  return new Response(null, { status: 200 });
}
