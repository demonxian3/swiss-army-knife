import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import less from "less"
import { resolve } from "path"
import WindiCSS from "vite-plugin-windicss"
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        WindiCSS(),
        {
            name: "less",
            async transform(code, id) {
                if (id.endsWith(".less")) {
                    const { css } = await less.render(code)
                    return {
                        code: css,
                        map: null,
                    }
                }
            },
        },
    ],
    resolve: {
        alias: {
            "@": resolve(__dirname, "src"),
        },
    },
    server: {
        port: 8080,
        proxy: {
            "/apiv1/pantry": "https://getpantry.cloud",
        },
    },
})
