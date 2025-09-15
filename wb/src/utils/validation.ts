import { Component, ValidationResult, ValidationError, ValidationWarning } from '@/types';

/**
 * Validation engine for website builder components
 */
export class ValidationEngine {
  private rules: Map<string, ValidationRule> = new Map();

  constructor() {
    this.setupDefaultRules();
  }

  /**
   * Validate a single component
   */
  public validateComponent(component: Component): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Basic structure validation
    if (!component.id) {
      errors.push({
        code: 'MISSING_ID',
        message: 'Component must have an ID',
        component,
        severity: 'error'
      });
    }

    if (!component.type) {
      errors.push({
        code: 'MISSING_TYPE',
        message: 'Component must have a type',
        component,
        severity: 'error'
      });
    }

    if (!component.metadata) {
      errors.push({
        code: 'MISSING_METADATA',
        message: 'Component must have metadata',
        component,
        severity: 'error'
      });
    }

    // Apply type-specific validation rules
    const rule = this.rules.get(component.type);
    if (rule) {
      const ruleResult = rule.validate(component);
      errors.push(...ruleResult.errors);
      warnings.push(...ruleResult.warnings);
    }

    // Validate children recursively
    if (component.children) {
      for (const child of component.children) {
        const childResult = this.validateComponent(child);
        errors.push(...childResult.errors);
        warnings.push(...childResult.warnings);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Validate multiple components
   */
  public validateComponents(components: Component[]): ValidationResult {
    const allErrors: ValidationError[] = [];
    const allWarnings: ValidationWarning[] = [];

    for (const component of components) {
      const result = this.validateComponent(component);
      allErrors.push(...result.errors);
      allWarnings.push(...result.warnings);
    }

    // Check for duplicate IDs
    const ids = new Set<string>();
    for (const component of components) {
      if (ids.has(component.id)) {
        allErrors.push({
          code: 'DUPLICATE_ID',
          message: `Duplicate component ID: ${component.id}`,
          component,
          severity: 'error'
        });
      }
      ids.add(component.id);
    }

    return {
      valid: allErrors.length === 0,
      errors: allErrors,
      warnings: allWarnings
    };
  }

  /**
   * Register custom validation rule
   */
  public registerRule(type: string, rule: ValidationRule): void {
    this.rules.set(type, rule);
  }

  /**
   * Remove validation rule
   */
  public removeRule(type: string): void {
    this.rules.delete(type);
  }

  /**
   * Get all registered rules
   */
  public getRules(): string[] {
    return Array.from(this.rules.keys());
  }

  private setupDefaultRules(): void {
    // Text component validation
    this.registerRule('text', {
      validate: (component: Component) => {
        const errors: ValidationError[] = [];
        const warnings: ValidationWarning[] = [];

        if (!component.props.content) {
          warnings.push({
            code: 'EMPTY_TEXT',
            message: 'Text component has no content',
            component,
            severity: 'warning',
            suggestion: 'Add text content to make the component visible'
          });
        }

        return { valid: errors.length === 0, errors, warnings };
      }
    });

    // Image component validation
    this.registerRule('image', {
      validate: (component: Component) => {
        const errors: ValidationError[] = [];
        const warnings: ValidationWarning[] = [];

        if (!component.props.src) {
          errors.push({
            code: 'MISSING_IMAGE_SRC',
            message: 'Image component must have a src attribute',
            component,
            severity: 'error'
          });
        }

        if (!component.props.alt) {
          warnings.push({
            code: 'MISSING_ALT_TEXT',
            message: 'Image should have alt text for accessibility',
            component,
            severity: 'warning',
            suggestion: 'Add descriptive alt text for screen readers'
          });
        }

        return { valid: errors.length === 0, errors, warnings };
      }
    });

    // Button component validation
    this.registerRule('button', {
      validate: (component: Component) => {
        const errors: ValidationError[] = [];
        const warnings: ValidationWarning[] = [];

        if (!component.props.text && !component.props.children) {
          warnings.push({
            code: 'EMPTY_BUTTON',
            message: 'Button has no text or content',
            component,
            severity: 'warning',
            suggestion: 'Add button text or child elements'
          });
        }

        return { valid: errors.length === 0, errors, warnings };
      }
    });

    // Form validation
    this.registerRule('form', {
      validate: (component: Component) => {
        const errors: ValidationError[] = [];
        const warnings: ValidationWarning[] = [];

        if (!component.children || component.children.length === 0) {
          warnings.push({
            code: 'EMPTY_FORM',
            message: 'Form has no input fields',
            component,
            severity: 'warning',
            suggestion: 'Add form inputs or other form elements'
          });
        }

        return { valid: errors.length === 0, errors, warnings };
      }
    });
  }
}

interface ValidationRule {
  validate: (component: Component) => {
    valid: boolean;
    errors: ValidationError[];
    warnings: ValidationWarning[];
  };
}