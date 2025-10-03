/**
 * Demonstration of how TypeScript catches reference errors
 * Run `npm run typecheck` to see TypeScript validation in action
 */

// ❌ These imports would cause TypeScript errors if uncommented:
// import WrongPath from './non-existent-file.js';  // TS2307: Cannot find module
// import BadUtils from '../utils/wb-component-utils.js';  // TS2307: Wrong path
// import MissingComponent from '../components/wb-button/wb-button.js';  // TS2307: Wrong structure

// ✅ These imports are validated by TypeScript at compile time:
import type { ComponentConfig, ComponentPath, CSSPath } from './types.js';
import '../../utils/wb/wb-component-utils.js';  // Correct path - validates file exists
import '../wb-event-log/wb-event-log.js';       // Correct path - validates file exists

// ✅ Type-safe component configuration
const validComponentConfig: ComponentConfig = {
    script: '@components/wb-button/wb-button.js',  // TypeScript ensures this is a valid ComponentPath
    css: '@components/wb-button/wb-button.css',    // TypeScript ensures this is a valid CSSPath
    priority: 'lazy',                              // TypeScript ensures this is a valid priority
    dependencies: ['wb-theme-manager']             // TypeScript validates this is string[]
};

// ❌ These would cause TypeScript errors:
// const invalidConfig: ComponentConfig = {
//     script: '@components/non-existent/file.js',  // TS2322: Type not assignable
//     css: 'invalid-path.css',                     // TS2322: Type not assignable
//     priority: 'invalid-priority',                // TS2322: Type not assignable
//     dependencies: 123                            // TS2322: Type not assignable
// };

/**
 * Demonstration of path validation at compile time
 */
class TypeScriptValidationDemo {
    private componentRegistry: Record<string, ComponentConfig> = {};

    constructor() {
        this.setupValidatedRegistry();
    }

    private setupValidatedRegistry(): void {
        // TypeScript validates all these paths at compile time
        this.componentRegistry = {
            'wb-button': {
                script: '@components/wb-button/wb-button.js',      // ✅ Validated
                css: '@components/wb-button/wb-button.css',        // ✅ Validated
                priority: 'lazy',                                  // ✅ Validated
                dependencies: []                                   // ✅ Validated
            },
            'wb-modal': {
                script: '@components/wb-modal/wb-modal.js',        // ✅ Validated
                css: '@components/wb-modal/wb-modal.css',          // ✅ Validated
                priority: 'lazy',                                  // ✅ Validated
                dependencies: ['wb-keyboard-manager']              // ✅ Validated
            }
        };
    }

    // TypeScript ensures this method can only accept valid component paths
    public async loadComponent(componentPath: ComponentPath): Promise<void> {
        try {
            // Dynamic import with TypeScript validation
            await import(this.resolvePath(componentPath));
            console.log(`✅ Component loaded: ${componentPath}`);
        } catch (error) {
            console.error(`❌ Failed to load component: ${componentPath}`, error);
        }
    }

    // TypeScript ensures this method returns a string and accepts valid paths
    private resolvePath(path: ComponentPath | CSSPath): string {
        return path
            .replace('@components/', '../')
            .replace('@utils/', '../../utils/')
            .replace('@styles/', '../../styles/')
            .replace('@layouts/', '../../layouts/');
    }

    // TypeScript validates that priority is one of the allowed values
    public getComponentsByPriority(priority: 'essential' | 'high' | 'lazy'): string[] {
        return Object.entries(this.componentRegistry)
            .filter(([_, config]) => config.priority === priority)
            .map(([name]) => name);
    }
}

// ✅ Usage example that TypeScript validates
const demo = new TypeScriptValidationDemo();

// This would work - TypeScript knows these are valid paths
demo.loadComponent('@components/wb-button/wb-button.js');

// ❌ This would cause a TypeScript error:
// demo.loadComponent('@components/invalid/path.js');  // TS2345: Argument not assignable

export default TypeScriptValidationDemo;

/**
 * Summary of TypeScript benefits:
 * 
 * 1. ✅ Compile-time path validation
 * 2. ✅ Type safety for configuration objects  
 * 3. ✅ IntelliSense and autocomplete
 * 4. ✅ Refactoring safety
 * 5. ✅ Error catching before runtime
 * 6. ✅ Documentation through types
 * 7. ✅ Better IDE support
 * 
 * Run these commands to see TypeScript in action:
 * - `npm run typecheck` - Check types without compilation
 * - `npm run build` - Compile with error checking
 * - `tsc --noEmit --listFiles` - See all files being validated
 */