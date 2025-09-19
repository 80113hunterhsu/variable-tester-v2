import { ipcMain, dialog } from "electron";

export function initExportCommands(fs: any) {
    const commands = {
        csv: async (_: any, filename: string, data: Record<string, any>) => {
            const { canceled, filePath } = await dialog.showSaveDialog({
                defaultPath: filename,
                filters: [{ name: "CSV Files", extensions: ["csv"] }],
            });
            if (canceled || !filePath) {
                console.log('export to csv aborted: ', {canceled: canceled, filePath: filePath});
                return { success: false };
            }
            const separator = ",";
            const csvData: string[] = [];
            const dataList = Object.values(data);
            const keys = Object.keys(dataList[0]);
            const keysMap: Record<string, string> = {
                time: "time(s)",
                timeMS: "time(m/s)",
                score: "score",
            };
            csvData.push(keys.map((key) => keysMap[key]).join(separator));
            dataList.forEach((row: any) => {
                csvData.push(keys.map((k) => {
                    let returnValue = row[k];
                    const type = typeof returnValue;
                    if (type === "string") {
                        returnValue = returnValue.replace(" ", "");
                    }
                    return returnValue;
                }).join(separator));
            });
            const csv = csvData.join("\n");

            fs.writeFileSync(filePath, csv);
            return { success: true, path: filePath };
        },
        image: async (
            _: any,
            filename: string,
            dataUrl: string,
            format: string
        ) => {
            const { canceled, filePath } = await dialog.showSaveDialog({
                defaultPath: filename,
                filters: [
                    { name: `${format.toUpperCase()} Image`, extensions: [format] },
                ],
            });
            if (canceled || !filePath) {
                console.log('export to image aborted: ', {canceled: canceled, filePath: filePath});
                return { success: false };
            }

            // strip base64 prefix (e.g. "data:image/png;base64,...")
            const base64Data = dataUrl.split(",")[1];
            const buffer = Buffer.from(base64Data, "base64");
            fs.writeFileSync(filePath, buffer);

            return { success: true, path: filePath };
        },
    };

    // 註冊 IPC 處理器
    const handlers: Record<string, string> = {};
    Object.entries(commands).forEach(([name, callback]) => {
        const commandName = `export:${name}`;
        ipcMain.handle(commandName, callback);
        handlers[name] = commandName;
    });

    // 將 handlers 清單提供給 Renderer process 使用
    ipcMain.handle("export:getHandlers", () => handlers);
}

export async function exposeExportHandlers(
    ipcRenderer: Electron.IpcRenderer,
    contextBridge: Electron.ContextBridge
) {
    const handlerList = await ipcRenderer.invoke("export:getHandlers");
    const handlers: Record<string, any> = {};
    Object.entries(handlerList as Record<string, string>).forEach(
        ([name, commandName]: [string, string]) => {
            handlers[name] = (...args: any[]) =>
                ipcRenderer.invoke(commandName, ...args);
        }
    );
    contextBridge.exposeInMainWorld("export", handlers);
}
