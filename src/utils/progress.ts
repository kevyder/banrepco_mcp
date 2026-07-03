import type { RequestHandlerExtra } from "@modelcontextprotocol/sdk/shared/protocol.js";
import type { ServerRequest, ServerNotification } from "@modelcontextprotocol/sdk/types.js";

export async function sendProgress(
    extra: RequestHandlerExtra<ServerRequest, ServerNotification>,
    progress: number,
    total?: number,
    message?: string,
): Promise<void> {
    const token = extra._meta?.progressToken;
    if (token === undefined) return;
    await extra.sendNotification({
        method: "notifications/progress",
        params: { progressToken: token, progress, total, message },
    });
}
