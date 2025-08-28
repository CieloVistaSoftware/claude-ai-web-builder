/**
 * Website Builder Wizard Container
 * Main component that orchestrates the step-by-step website creation process
 *
 * @example
 * ```html
 * <website-builder-wizard></website-builder-wizard>
 * ```
 */
declare class WebsiteBuilderWizard extends HTMLElement {
    private currentStep;
    private totalSteps;
    private websiteData;
    constructor();
    connectedCallback(): void;
    private render;
    private getStepTitle;
    private renderCurrentStep;
    private renderWebsiteTypeStep;
    private renderTemplateStep;
    private renderContentStep;
    private renderStyleStep;
    private renderPreviewStep;
    private setupEventListeners;
    private nextStep;
    private previousStep;
    private createWebsite;
}
