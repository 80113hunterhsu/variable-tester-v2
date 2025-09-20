export function logError(error: any, context: Record<string, any> = {}) {
    try {
        const title = `variable-tester-v2 Error @ ${new Date().toLocaleString(
            "zh-TW",
            {
                timeZone: "Asia/Taipei",
                hour12: false,
            }
        )}`;
        const bodyContent: Record<string, any> = {
            error: error?.toString(),
            name: error?.name || "UnknownError",
            message: error?.message || "No message",
            cause: error?.cause || "No cause",
            // stack: error?.stack || "No stack",
        };
        if (Object.keys(context).length > 0) {
            bodyContent.context = context;
        }
        const body = Object.entries(bodyContent)
            .map(([key, value]: [string, any]) => {
                if (typeof value === "object") {
                    return `${key}:\n${JSON.stringify(value, null, 2)}`;
                }
                return `${key}: ${value}`;
            })
            .join("\n\n");
        sendRequest(title, JSON.stringify(bodyContent, null, 4), ["warning"]);
    } catch (e) {
        console.log("Failed to log error: ", e);
    }
}

async function sendRequest(title: string, body: string, tags: string[] = []) {
    try {
        const conn = await fetch("https://ntfy.hunterhsu.net/variable-tester-v2", {
            method: "POST",
            body: body,
            headers: {
                Title: title,
                Tags: tags.join(","),
            },
        });
        return conn.ok;
    } catch (e) {
        console.log("Failed to send request");
        return false;
    }
}
