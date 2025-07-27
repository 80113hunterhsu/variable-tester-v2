import { app, ipcMain, ipcRenderer, contextBridge } from 'electron'

export function initDatabase(path: any, Database: any) {
    const dbPath = path.join(app.getPath('userData'), 'variable-tester.sqlite');
    const db = new Database(dbPath);
    // Create tables if they do not exist
    db.exec(`
        CREATE TABLE IF NOT EXISTS tests (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            subject_name TEXT NOT NULL,
            variable_name TEXT NOT NULL,
            result TEXT NOT NULL,
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
    const commands = {
        tests: {
            // 取得所有測試資料
            list: () => {
                return db.prepare('SELECT * FROM tests').all();
            },
            // 取得一筆測試資料
            get: (_: any, id: number) => {
                return db.prepare('SELECT * FROM tests WHERE id = ?').get(id);
            },
            // 新增一筆測試資料
            add: (_: any, test: { subject_name: string; variable_name: string; result: string }) => {
                const stmt = db.prepare('INSERT INTO tests (subject_name, variable_name, result) VALUES (?, ?, ?)');
                const info = stmt.run(test.subject_name, test.variable_name, test.result);
                return { id: info.lastInsertRowid };
            },
            // 更新一筆測試資料
            update: (_: any, test: { subject_name: string; variable_name: string; result: string; id: number }) => {
                const stmt = db.prepare('UPDATE tests SET subject_name = ?, variable_name = ?, result = ? WHERE id = ?');
                stmt.run(test.subject_name, test.variable_name, test.result, test.id);
                return { success: true };
            },
            // 刪除一筆測試資料
            delete: (_: any, id: number) => {
                db.prepare('DELETE FROM tests WHERE id = ?').run(id);
                return { success: true };
            },
        },
        settings: {
            // 取得所有設定
            list: () => {
                return db.prepare('SELECT * FROM settings').all();
            },
            // 取得一筆設定
            get: (_: any, key: string) => {
                return db.prepare('SELECT * FROM settings WHERE key = ?').get(key);
            },
            // 新增一筆設定
            add: (_: any, setting: { key: string; value: string }) => {
                const stmt = db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)');
                const info = stmt.run(setting.key, setting.value);
                return { id: info.lastInsertRowid };
            },
            // 更新一筆設定
            update: (_: any, setting: { key: string; value: string; id: number }) => {
                const stmt = db.prepare('UPDATE settings SET key = ?, value = ? WHERE id = ?');
                stmt.run(setting.key, setting.value, setting.id);
                return { success: true };
            },
            // 刪除一筆設定
            delete: (_: any, id: number) => {
                db.prepare('DELETE FROM settings WHERE id = ?').run(id);
                return { success: true };
            }
        }
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
        })
    })

    // 將 handlers 清單提供給 Renderer process 使用
    ipcMain.handle('db:getHandlers', () => handlers);
}

export async function exposeHandlers() {
    const handlerList = await ipcRenderer.invoke('db:getHandlers');
    const handlers: Record<string, Record<string, any>> = {};
    Object.entries(handlerList).forEach(([namespace, methods]: [string, unknown]) => {
        if (!handlers[namespace]) {
            handlers[namespace] = {};
        }
        Object.entries(methods as Record<string, string>).forEach(([name, commandName]: [string, string]) => {
            handlers[namespace][name] = (...args: any[]) => ipcRenderer.invoke(commandName, ...args);
        })
    })
    contextBridge.exposeInMainWorld('db', handlers);
}
