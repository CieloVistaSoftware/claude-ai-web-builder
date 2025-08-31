"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vite_1 = require("vite");
const path_1 = require("path");
const vite_plugin_md_1 = __importDefault(require("vite-plugin-md"));
// https://vitejs.dev/config/
exports.default = (0, vite_1.defineConfig)({
    plugins: [
        (0, vite_plugin_md_1.default)({
            // Options for the Markdown plugin
            markdownItOptions: {
                html: true,
                linkify: true,
                typographer: true
            }
        }),
    ],
    server: {
        port: 5173
    },
    build: {
        rollupOptions: {
            input: {
                main: (0, path_1.resolve)(__dirname, 'index.html'),
                template: (0, path_1.resolve)(__dirname, 'website_template_generator.html')
            }
        }
    }
});
//# sourceMappingURL=vite.config.js.map