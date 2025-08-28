"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const serve_static_1 = __importDefault(require("serve-static"));
const helmet_1 = __importDefault(require("helmet"));
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
const mcp_integration_1 = __importDefault(require("./mcp-integration"));
const app = (0, express_1.default)();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 8000;
// Initialize MCP integration with existing app
const mcpIntegration = new mcp_integration_1.default(app);
// Security middleware
app.use((0, helmet_1.default)({
    contentSecurityPolicy: false, // Allow inline styles for theme components
}));
// Enable CORS for development
app.use((0, cors_1.default)());
// Serve static files from the project root
app.use((0, serve_static_1.default)(path_1.default.join(__dirname), {
    index: false,
    dotfiles: "ignore",
}));
// Route for components
app.use("/components", express_1.default.static(path_1.default.join(__dirname, "components")));
// Route for themes
app.use("/themes", express_1.default.static(path_1.default.join(__dirname, "themes")));
// Route for CSS
app.use("/css", express_1.default.static(path_1.default.join(__dirname, "css")));
// Route for docs with directory index
app.use("/docs", express_1.default.static(path_1.default.join(__dirname, "docs"), {
    index: "index.html",
    extensions: ["html", "htm"],
}));
// Route for pages
app.use("/pages", express_1.default.static(path_1.default.join(__dirname, "pages")));
// Route for html
app.use("/html", express_1.default.static(path_1.default.join(__dirname, "html")));
// Route for wb directory
app.use("/wb", express_1.default.static(path_1.default.join(__dirname, "wb")));
// Legacy routes for backward compatibility
app.get("/wb.html", (req, res) => {
    res.redirect("/wb/wb.html");
});
app.get("/website-builder.html", (req, res) => {
    res.redirect("/wb/wb.html");
});
app.get("/website_template_generator.html", (req, res) => {
    res.redirect("/html/pages/website_template_generator.html");
});
app.get("/test-dynamic-pages.html", (req, res) => {
    res.redirect("/html/pages/test-dynamic-pages.html");
});
// Theme component redirects
app.get("/themes/generator/component/:file", (req, res) => {
    res.redirect(`/themes/components/${req.params.file}`);
});
// Default route to serve wb.html directly
app.get("/", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "wb", "wb.html"));
});
// API endpoint to list available components
app.get("/api/components", async (req, res) => {
    try {
        const componentsDir = path_1.default.join(__dirname, "components");
        const components = await fs_1.promises.readdir(componentsDir, { withFileTypes: true });
        const componentNames = components
            .filter((dirent) => dirent.isDirectory())
            .map((dirent) => dirent.name);
        res.json({
            components: componentNames,
            success: true,
        });
    }
    catch (error) {
        res.status(500).json({
            error: "Could not read components directory",
            success: false,
            details: error.message,
        });
    }
});
// API endpoint to list available themes
app.get("/api/themes", async (req, res) => {
    try {
        const themesDir = path_1.default.join(__dirname, "themes");
        const files = await fs_1.promises.readdir(themesDir);
        const themes = files
            .filter((file) => file.endsWith(".html"))
            .map((file) => file.replace(".html", ""));
        res.json({
            themes: themes,
            success: true,
        });
    }
    catch (error) {
        res.status(500).json({
            error: "Could not read themes directory",
            success: false,
            details: error.message,
        });
    }
});
// Error handling middleware
app.use((err, req, res, next) => {
    console.error("Server error:", err);
    res.status(500).json({
        error: "Internal server error",
        success: false,
        details: err.message,
    });
});
// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: `File not found: ${req.url}`,
        success: false,
        availableRoutes: [
            "/",
            "/components/table/table-theme.html",
            "/themes/theme-generator.html",
            "/api/components",
            "/api/themes",
            "/mcp/generate",
            "/mcp/capabilities",
            "/mcp/health",
            "/mcp/validate",
            "/mcp/metrics",
        ],
    });
});
// Start server
app.listen(PORT, () => {
    console.log(`🚀 Claude AI Web Builder Server running on http://localhost:${PORT}`);
    console.log(`📁 Serving files from: ${__dirname}`);
    console.log(`🎨 Table Theme Demo: http://localhost:${PORT}/components/table/table-theme.html`);
    console.log(`🔧 Theme Generator: http://localhost:${PORT}/themes/theme-generator.html`);
    console.log(`\n📊 API Endpoints:`);
    console.log(`   - http://localhost:${PORT}/api/components`);
    console.log(`   - http://localhost:${PORT}/api/themes`);
    console.log(`\n🔌 MCP Server Endpoints:`);
    console.log(`   - POST http://localhost:${PORT}/mcp/generate`);
    console.log(`   - GET  http://localhost:${PORT}/mcp/capabilities`);
    console.log(`   - GET  http://localhost:${PORT}/mcp/health`);
    console.log(`   - POST http://localhost:${PORT}/mcp/validate`);
    console.log(`   - GET  http://localhost:${PORT}/mcp/metrics`);
    console.log(`\n🌐 MCP Integration: Ready for external MCP server connections`);
});
exports.default = app;
//# sourceMappingURL=server.js.map