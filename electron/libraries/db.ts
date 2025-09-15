import { app, ipcMain } from "electron";

export function initDatabase(path: any, Database: any) {
    const dbPath = path.join(app.getPath("userData"), "variable-tester.sqlite");
    const db = new Database(dbPath);
    // Create tables if they do not exist
    db.exec(`
        CREATE TABLE IF NOT EXISTS experiments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            subject_name TEXT NOT NULL,
            variable_name TEXT NOT NULL,
            video_name TEXT NOT NULL,
            video_path TEXT NOT NULL,
            settings TEXT NOT NULL,
            record TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS settings (
            key TEXT PRIMARY KEY,
            value TEXT NOT NULL
        );
    `);
    return db;
}

export function initCommands(db: any) {
    const typeMaps: Record<string, Record<string, string>> = {
        experiments: {
            id: "number",
            subject_name: "string",
            variable_name: "string",
            video_name: "string",
            video_path: "string",
            settings: "json",
            record: "json",
        },
        settings: {
            updateInterval: "number",
            useNotifySound: "boolean",
            notifySoundVolume: "number",
            resetUnit: "number",
            resetTimeout: "number",
            resetInterval: "number",
            isBidirectional: "boolean",
            maxScore: "number",
        },
    };
    const getTypedValue = (type: string, key: string, value: any) => {
        if (!typeMaps[type][key] || value === undefined || value === null) {
            return value;
        }
        switch (typeMaps[type][key]) {
            case "number":
                return Number(value);
            case "boolean":
                return value === "1";
            case "json":
                return JSON.parse(value);
            default:
                return value;
        }
    };
    const toString = (type: string, key: string, value: any) => {
        if (!typeMaps[type][key] || value === undefined || value === null) {
            return "";
        }
        switch (typeMaps.settings[key]) {
            case "number":
                return String(value);
            case "boolean":
                return value ? "1" : "0";
            default:
                return String(value);
        }
    };
    const commands = {
        experiments: {
            // 取得所有測試資料
            list: () => {
                const results = db.prepare("SELECT * FROM experiments").all();
                return results.reduce((data: Record<string, any>, result: any) => {
                    data[result.id] = Object.entries(result).reduce(
                        (newResult: any, [key, value]: [string, any]) => {
                            newResult[key] = getTypedValue("experiments", key, value);
                            return newResult;
                        },
                        {}
                    );
                    return data;
                }, {});
            },
            // 取得一筆測試資料
            get: (_: any, id: number) => {
                const result = db
                    .prepare("SELECT * FROM experiments WHERE id = ?")
                    .get(id);
                return Object.entries(result).reduce(
                    (newResult: any, [key, value]: [string, any]) => {
                        newResult[key] = getTypedValue("experiments", key, value);
                        return newResult;
                    },
                    {}
                );
            },
            // 新增或更新一筆測試資料
            set: (
                _: any,
                experiment: {
                    id?: number | null;
                    subject_name: string;
                    variable_name: string;
                    video_name: string;
                    video_path: string;
                    settings: string;
                    record: string;
                }
            ) => {
                const stmt = db.prepare(`
                    INSERT INTO experiments (id, subject_name, variable_name, video_name, video_path, settings, record)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                    ON CONFLICT(id) DO UPDATE SET
                        subject_name = excluded.subject_name,
                        variable_name = excluded.variable_name,
                        video_name   = excluded.video_name,
                        video_path   = excluded.video_path,
                        settings     = excluded.settings,
                        record       = excluded.record
                `);

                const info = stmt.run(
                    experiment.id ?? null, // null → autoincrement if insert
                    experiment.subject_name,
                    experiment.variable_name,
                    experiment.video_name,
                    experiment.video_path,
                    JSON.stringify(experiment.settings),
                    JSON.stringify(experiment.record)
                );

                // If it was an insert, return the new id
                if (!experiment.id) {
                    return { success: true, id: info.lastInsertRowid };
                }
                return { success: true };
            },
            // 刪除一筆測試資料
            delete: (_: any, id: number) => {
                db.prepare("DELETE FROM experiments WHERE id = ?").run(id);
                return { success: true };
            },
        },
        settings: {
            // 取得所有設定
            list: () => {
                const results = db.prepare("SELECT * FROM settings").all();
                return results.reduce(
                    (
                        data: Record<string, string | number | boolean | any>,
                        row: { key: string; value: string }
                    ) => {
                        data[row.key] = getTypedValue("settings", row.key, row.value);
                        return data;
                    },
                    {}
                );
            },
            // 取得一筆設定
            get: (_: any, key: string) => {
                const result = db
                    .prepare("SELECT * FROM settings WHERE key = ?")
                    .get(key);
                return getTypedValue("settings", key, result?.value);
            },
            // 設定或更新一筆設定
            set: (_: any, setting: { key: string; value: any }) => {
                const transformedValue = toString(
                    "settings",
                    setting.key,
                    setting.value
                );
                const stmt = db.prepare(`
                    INSERT INTO settings (key, value)
                    VALUES (?, ?)
                    ON CONFLICT(key) DO UPDATE SET value = excluded.value
                `);
                stmt.run(setting.key, transformedValue);
                return { success: true };
            },
            // 刪除一筆設定
            delete: (_: any, key: string) => {
                db.prepare("DELETE FROM settings WHERE key = ?").run(key);
                return { success: true };
            },
        },
    };

    // 註冊 IPC 處理器
    const handlers: Record<string, Record<string, string>> = {};
    Object.entries(commands).forEach(([namespace, methods]: [string, object]) => {
        if (!handlers[namespace]) {
            handlers[namespace] = {};
        }
        Object.entries(methods).forEach(([name, callback]) => {
            const commandName = `db:${namespace}:${name}`;
            ipcMain.handle(commandName, callback);
            handlers[namespace][name] = commandName;
        });
    });

    // 將 handlers 清單提供給 Renderer process 使用
    ipcMain.handle("db:getHandlers", () => handlers);
}

export async function exposeHandlers(
    ipcRenderer: Electron.IpcRenderer,
    contextBridge: Electron.ContextBridge
) {
    const handlerList = await ipcRenderer.invoke("db:getHandlers");
    const handlers: Record<string, Record<string, any>> = {};
    Object.entries(handlerList).forEach(
        ([namespace, methods]: [string, unknown]) => {
            if (!handlers[namespace]) {
                handlers[namespace] = {};
            }
            Object.entries(methods as Record<string, string>).forEach(
                ([name, commandName]: [string, string]) => {
                    handlers[namespace][name] = (...args: any[]) =>
                        ipcRenderer.invoke(commandName, ...args);
                }
            );
        }
    );
    contextBridge.exposeInMainWorld("db", handlers);
}
