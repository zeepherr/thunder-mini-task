import { apiHandler, getApiAuth, requireAppKey } from "@/lib/api-utils";

export async function GET(request: Request) {
  return apiHandler(async () => {
    await requireAppKey(request);
    const { user } = await getApiAuth(request);
    return { user };
  });
}
