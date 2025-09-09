interface Window {
    db: {
        experiments: {
            list: () => {
                id: number;
                subject_name: string;
                variable_name: string;
                video_name: string;
                settings: string;
                result: string;
            }[];
            get: (id: number) => any;
            set: (experiment: any) => any;
            delete: (id: number) => any;
        };
        settings: {
            list: () => any;
            get: (key: string) => any;
            set: (setting: { key: string; value: any }) => any;
            delete: (key: string) => any;
        };
    };
}
