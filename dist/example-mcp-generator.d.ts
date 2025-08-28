declare class MCPWebsiteGenerator {
    private app;
    constructor();
    private setupMiddleware;
    private setupRoutes;
    private generateWebsite;
    private validateInput;
    private createFiles;
    private generateHTML;
    private generateContentByType;
    private generateCSS;
    private generateReactComponent;
    private generatePackageJson;
    private buildStructure;
    start(port?: number): void;
}
export default MCPWebsiteGenerator;
