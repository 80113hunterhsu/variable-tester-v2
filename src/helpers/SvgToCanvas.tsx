export function svgToCanvas(
    svgElement: SVGSVGElement,
    type: string,
    scale: number = 1
): Promise<HTMLCanvasElement> {
    return new Promise((resolve, reject) => {
        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svgElement);
        const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(blob);

        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = svgElement.width.baseVal.value * scale + 40;
            canvas.height = svgElement.height.baseVal.value * scale + 40;
            const ctx = canvas.getContext("2d");
            if (!ctx) return reject(new Error("Failed to get canvas context"));

            if (type === "JPG") {
                ctx.fillStyle = "#ffffff"; // set white background for JPG
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
            ctx.scale(scale, scale);
            ctx.drawImage(img, 20, 20);
            URL.revokeObjectURL(url);
            resolve(canvas);
        };
        img.onerror = (err) => {
            URL.revokeObjectURL(url);
            reject(err);
        };
        img.src = url;
    });
}

export function svgDataUrlToCanvas(
    svgDataUrl: string,
    type: string,
    scale: number = 1
): Promise<HTMLCanvasElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width * scale;
            canvas.height = img.height * scale;
            const ctx = canvas.getContext("2d");
            if (!ctx) return reject(new Error("No canvas context"));

            if (type === "JPG") {
                ctx.fillStyle = "#ffffff"; // background for JPG
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            resolve(canvas);
        };
        img.onerror = reject;
        img.src = svgDataUrl; // <-- direct from toSvg
    });
}
