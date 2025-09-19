interface Window {
    db: {
        experiments: {
            list: () => {
                id: number;
                subject_name: string;
                variable_name: string;
                video_name: string;
                video_path: string;
                settings: string;
                record: string;
            }[];
            get: (id: number) => {
                id: number;
                subject_name: string;
                variable_name: string;
                video_name: string;
                video_path: string;
                settings: string;
                record: string;
            };
            set: (experiment: {
                id?: number | null;
                subject_name: string;
                variable_name: string;
                video_name: string;
                video_path: string;
                settings: string;
                record: string;
            }) => any;
            delete: (id: number) => any;
        };
        settings: {
            list: () => any;
            get: (key: string) => any;
            set: (setting: { key: string; value: any }) => any;
            delete: (key: string) => any;
        };
    };
    export: {
        csv: (filename: string, data: any) => {success: boolean, path?: string};
        image: (filename: string, dataURL: string, format: string) => {success: boolean, path?: string};
    }
}
