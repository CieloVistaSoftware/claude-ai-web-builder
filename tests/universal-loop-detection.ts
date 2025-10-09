/**
 * Universal Loop Detection Utilities for WB Component Testing
 * 
 * CRITICAL REQUIREMENT: ALL tests (unit, integration, system) MUST use these
 * utilities to prevent infinite loops from hanging tests or browsers.
 * 
 * Usage:
 * - Unit Tests: Wrap mocked methods with call counters
 * - Integration Tests: Monitor DOM mutations and event propagation  
 * - System Tests: Set timeouts and monitor console errors
 */

/**
 * Creates a loop-detecting wrapper for any method
 * Throws error if method is called more than maxCalls times
 */
export function createLoopDetector(methodName: string, maxCalls: number = 5) {
  let callCount = 0;
  let callStack: Array<{ method: string; timestamp: number; args?: any[] }> = [];
  
  return function loopDetectingWrapper<T extends (...args: any[]) => any>(originalMethod: T): T {
    return function(this: any, ...args: any[]) {
      callCount++;
      callStack.push({ 
        method: methodName, 
        timestamp: Date.now(),
        args: args.length > 0 ? args : undefined 
      });
      
      if (callCount > maxCalls) {
        const recentCalls = callStack.slice(-5).map(call => 
          `${call.method}(${call.args ? call.args.join(', ') : ''}) at ${call.timestamp}`
        ).join('\n  ');
        
        throw new Error(
          `Infinite loop detected in ${methodName}.\n` +
          `Call count: ${callCount} (max: ${maxCalls})\n` +
          `Recent calls:\n  ${recentCalls}`
        );
      }
      
      const result = originalMethod.apply(this, args);
      
      // Reset counter after successful execution (with delay to catch immediate recursion)
      setTimeout(() => { 
        callCount = 0; 
        callStack = []; 
      }, 100);
      
      return result;
    } as T;
  };
}

/**
 * Creates a DOM mutation observer that detects infinite DOM update loops
 * Throws error if DOM mutations exceed threshold within time window
 */
export function createDOMLoopDetector(element: Element, maxMutations: number = 20, timeWindow: number = 1000) {
  let mutationCount = 0;
  let startTime = Date.now();
  let mutations: MutationRecord[] = [];
  
  const observer = new MutationObserver((mutationsList) => {
    const currentTime = Date.now();
    
    // Reset counter if time window has passed
    if (currentTime - startTime > timeWindow) {
      mutationCount = 0;
      startTime = currentTime;
      mutations = [];
    }
    
    mutationCount += mutationsList.length;
    mutations.push(...mutationsList);
    
    if (mutationCount > maxMutations) {
      const recentMutations = mutations.slice(-5).map(mutation => 
        `${mutation.type} on ${mutation.target.nodeName}${
          (mutation.target as Element).className ? '.' + (mutation.target as Element).className : ''
        }`
      ).join('\n  ');
      
      observer.disconnect();
      throw new Error(
        `Infinite DOM update loop detected.\n` +
        `Mutations: ${mutationCount} in ${currentTime - startTime}ms (max: ${maxMutations} in ${timeWindow}ms)\n` +
        `Recent mutations:\n  ${recentMutations}`
      );
    }
  });
  
  observer.observe(element, { 
    attributes: true, 
    childList: true, 
    subtree: true,
    attributeOldValue: true,
    characterDataOldValue: true
  });
  
  return {
    observer,
    disconnect: () => observer.disconnect(),
    getStats: () => ({ mutationCount, timeElapsed: Date.now() - startTime })
  };
}

/**
 * Creates an event loop detector that monitors event dispatching
 * Prevents infinite event propagation cascades
 */
export function createEventLoopDetector(target: EventTarget, eventType: string, maxEvents: number = 10) {
  let eventCount = 0;
  let startTime = Date.now();
  let events: Array<{ timestamp: number; detail?: any }> = [];
  
  const originalDispatch = target.dispatchEvent.bind(target);
  
  target.dispatchEvent = function(event: Event): boolean {
    if (event.type === eventType) {
      const currentTime = Date.now();
      
      // Reset if more than 1 second has passed
      if (currentTime - startTime > 1000) {
        eventCount = 0;
        startTime = currentTime;
        events = [];
      }
      
      eventCount++;
      events.push({ 
        timestamp: currentTime, 
        detail: (event as CustomEvent).detail 
      });
      
      if (eventCount > maxEvents) {
        const recentEvents = events.slice(-3).map(evt => 
          `${eventType} at ${evt.timestamp}${evt.detail ? ` (${JSON.stringify(evt.detail)})` : ''}`
        ).join('\n  ');
        
        throw new Error(
          `Infinite event loop detected for ${eventType}.\n` +
          `Events: ${eventCount} in ${currentTime - startTime}ms (max: ${maxEvents})\n` +
          `Recent events:\n  ${recentEvents}`
        );
      }
    }
    
    return originalDispatch(event);
  };
  
  return {
    reset: () => {
      eventCount = 0;
      startTime = Date.now();
      events = [];
    },
    getStats: () => ({ eventCount, timeElapsed: Date.now() - startTime }),
    restore: () => {
      target.dispatchEvent = originalDispatch;
    }
  };
}

/**
 * Creates a timeout-based loop detector for system tests
 * Fails test if operation takes longer than expected
 */
export function createTimeoutLoopDetector<T>(
  operation: () => Promise<T> | T,
  timeoutMs: number = 5000,
  operationName: string = 'operation'
): Promise<T> {
  return Promise.race([
    Promise.resolve(operation()),
    new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error(
          `${operationName} timed out after ${timeoutMs}ms. ` +
          `This may indicate an infinite loop or hanging operation.`
        ));
      }, timeoutMs);
    })
  ]);
}

/**
 * Uncaught exception handler for tests
 * Captures ALL uncaught exceptions with full stack traces and context
 */
export function createUncaughtExceptionHandler(testName?: string) {
  const exceptions: Array<{
    error: Error;
    timestamp: number;
    testName?: string;
    stack: string;
    message: string;
    source?: string;
    lineno?: number;
    colno?: number;
  }> = [];
  
  // Store original handlers
  const originalOnError = window.onerror;
  const originalOnUnhandledRejection = window.onunhandledrejection;
  
  // Capture JavaScript errors
  window.onerror = function(message, source, lineno, colno, error) {
    const exceptionInfo = {
      error: error || new Error(String(message)),
      timestamp: Date.now(),
      testName,
      stack: error?.stack || new Error().stack || 'No stack trace available',
      message: String(message),
      source,
      lineno,
      colno
    };
    
    exceptions.push(exceptionInfo);
    
    console.error(`🚨 UNCAUGHT EXCEPTION in test "${testName || 'unknown'}":`, {
      message,
      source,
      line: lineno,
      column: colno,
      stack: error?.stack,
      timestamp: new Date(exceptionInfo.timestamp).toISOString()
    });
    
    // Call original handler if it exists
    if (originalOnError) {
      return originalOnError.call(this, message, source, lineno, colno, error);
    }
    
    return false; // Don't prevent default browser error handling
  };
  
  // Capture unhandled promise rejections
  window.onunhandledrejection = function(event) {
    const error = event.reason instanceof Error ? event.reason : new Error(String(event.reason));
    
    const exceptionInfo = {
      error,
      timestamp: Date.now(),
      testName,
      stack: error.stack || new Error().stack || 'No stack trace available',
      message: `Unhandled Promise Rejection: ${error.message || event.reason}`,
      source: 'Promise rejection'
    };
    
    exceptions.push(exceptionInfo);
    
    console.error(`🚨 UNHANDLED PROMISE REJECTION in test "${testName || 'unknown'}":`, {
      reason: event.reason,
      promise: event.promise,
      stack: error.stack,
      timestamp: new Date(exceptionInfo.timestamp).toISOString()
    });
    
    // Call original handler if it exists
    if (originalOnUnhandledRejection) {
      originalOnUnhandledRejection.call(window, event);
    }
  };
  
  return {
    getExceptions: () => [...exceptions],
    hasExceptions: () => exceptions.length > 0,
    getLastException: () => exceptions[exceptions.length - 1],
    getDetailedReport: () => {
      if (exceptions.length === 0) return 'No uncaught exceptions';
      
      return exceptions.map((exc, index) => 
        `Exception ${index + 1}:\n` +
        `  Test: ${exc.testName || 'unknown'}\n` +
        `  Time: ${new Date(exc.timestamp).toISOString()}\n` +
        `  Message: ${exc.message}\n` +
        `  Source: ${exc.source || 'unknown'}:${exc.lineno || '?'}:${exc.colno || '?'}\n` +
        `  Stack:\n${exc.stack.split('\n').map(line => `    ${line}`).join('\n')}`
      ).join('\n\n');
    },
    reset: () => { exceptions.length = 0; },
    restore: () => {
      window.onerror = originalOnError;
      window.onunhandledrejection = originalOnUnhandledRejection;
    },
    // Throw if any exceptions were caught (for failing tests)
    throwIfExceptions: () => {
      if (exceptions.length > 0) {
        const report = exceptions.map(exc => 
          `${exc.message} at ${exc.source || 'unknown'}:${exc.lineno || '?'}\n${exc.stack}`
        ).join('\n\n');
        
        throw new Error(
          `Test failed due to ${exceptions.length} uncaught exception(s):\n\n${report}`
        );
      }
    }
  };
}

/**
 * Console error monitor for system tests
 * Detects loop-related errors and ALL console errors in browser console
 */
export function createConsoleLoopDetector() {
  const loopKeywords = ['infinite', 'loop', 'recursion', 'stack overflow', 'too much recursion'];
  const errors: string[] = [];
  const allErrors: Array<{ type: 'error' | 'warn'; message: string; timestamp: number }> = [];
  
  const originalError = console.error;
  const originalWarn = console.warn;
  
  console.error = (...args: any[]) => {
    const message = args.join(' ');
    const timestamp = Date.now();
    
    allErrors.push({ type: 'error', message, timestamp });
    
    if (loopKeywords.some(keyword => message.toLowerCase().includes(keyword))) {
      errors.push(`ERROR: ${message}`);
    }
    
    originalError.apply(console, args);
  };
  
  console.warn = (...args: any[]) => {
    const message = args.join(' ');
    const timestamp = Date.now();
    
    allErrors.push({ type: 'warn', message, timestamp });
    
    if (loopKeywords.some(keyword => message.toLowerCase().includes(keyword))) {
      errors.push(`WARN: ${message}`);
    }
    
    originalWarn.apply(console, args);
  };
  
  return {
    getErrors: () => [...errors],
    getAllErrors: () => [...allErrors],
    hasLoopErrors: () => errors.length > 0,
    hasAnyErrors: () => allErrors.length > 0,
    getErrorReport: () => {
      if (allErrors.length === 0) return 'No console errors';
      
      return allErrors.map(err => 
        `[${new Date(err.timestamp).toISOString()}] ${err.type.toUpperCase()}: ${err.message}`
      ).join('\n');
    },
    reset: () => { 
      errors.length = 0;
      allErrors.length = 0;
    },
    restore: () => {
      console.error = originalError;
      console.warn = originalWarn;
    }
  };
}

/**
 * State change loop detector for components that manage state
 * Monitors property/attribute changes for recursive updates
 */
export function createStateLoopDetector(obj: any, propertyName: string, maxChanges: number = 10) {
  let changeCount = 0;
  let startTime = Date.now();
  let changes: Array<{ timestamp: number; oldValue: any; newValue: any }> = [];
  
  const descriptor = Object.getOwnPropertyDescriptor(obj, propertyName) || 
                    { value: obj[propertyName], writable: true, enumerable: true, configurable: true };
  
  let currentValue = descriptor.value;
  
  Object.defineProperty(obj, propertyName, {
    get: () => currentValue,
    set: (newValue: any) => {
      const currentTime = Date.now();
      
      // Reset if more than 1 second has passed
      if (currentTime - startTime > 1000) {
        changeCount = 0;
        startTime = currentTime;
        changes = [];
      }
      
      const oldValue = currentValue;
      changeCount++;
      changes.push({ timestamp: currentTime, oldValue, newValue });
      
      if (changeCount > maxChanges) {
        const recentChanges = changes.slice(-3).map(change => 
          `${change.oldValue} → ${change.newValue} at ${change.timestamp}`
        ).join('\n  ');
        
        throw new Error(
          `Infinite state change loop detected for ${propertyName}.\n` +
          `Changes: ${changeCount} in ${currentTime - startTime}ms (max: ${maxChanges})\n` +
          `Recent changes:\n  ${recentChanges}`
        );
      }
      
      currentValue = newValue;
    },
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable
  });
  
  return {
    reset: () => {
      changeCount = 0;
      startTime = Date.now();
      changes = [];
    },
    getStats: () => ({ changeCount, timeElapsed: Date.now() - startTime })
  };
}

/**
 * Lightweight exception handler for simple tests
 * Use when you only need exception handling without full loop detection
 */
export function setupExceptionHandling(testName?: string) {
  const exceptionHandler = createUncaughtExceptionHandler(testName);
  
  return {
    getExceptions: () => exceptionHandler.getExceptions(),
    hasExceptions: () => exceptionHandler.hasExceptions(),
    getExceptionReport: () => exceptionHandler.getDetailedReport(),
    cleanup: () => exceptionHandler.restore(),
    throwIfExceptions: () => exceptionHandler.throwIfExceptions()
  };
}

/**
 * Comprehensive loop detection setup for component testing
 * Applies multiple loop detectors to catch all types of infinite loops AND uncaught exceptions
 */
export function setupUniversalLoopDetection(component: any, options: {
  maxMethodCalls?: number;
  maxDOMMutations?: number;
  maxEvents?: number;
  maxStateChanges?: number;
  timeout?: number;
  testName?: string;
} = {}) {
  const {
    maxMethodCalls = 5,
    maxDOMMutations = 20,
    maxEvents = 10,
    maxStateChanges = 10,
    timeout = 5000,
    testName
  } = options;
  
  const detectors: Array<{ name: string; cleanup: () => void }> = [];
  
  // UNCAUGHT EXCEPTION DETECTION (CRITICAL)
  const exceptionHandler = createUncaughtExceptionHandler(testName);
  detectors.push({
    name: 'uncaught-exceptions',
    cleanup: () => exceptionHandler.restore()
  });
  
  // Method call detection
  const protectedMethods = ['render', 'update', 'refresh', 'draw', 'paint', 'invalidate'];
  protectedMethods.forEach(methodName => {
    if (typeof component[methodName] === 'function') {
      const detector = createLoopDetector(methodName, maxMethodCalls);
      component[methodName] = detector(component[methodName].bind(component));
      detectors.push({ 
        name: `method-${methodName}`, 
        cleanup: () => { /* method wrapper can't be easily restored */ }
      });
    }
  });
  
  // DOM mutation detection (if component is in DOM)
  let domDetector: ReturnType<typeof createDOMLoopDetector> | null = null;
  if (component.shadowRoot || (component.nodeType && component.nodeType === Node.ELEMENT_NODE)) {
    const element = component.shadowRoot || component;
    domDetector = createDOMLoopDetector(element, maxDOMMutations);
    detectors.push({
      name: 'dom-mutations',
      cleanup: () => domDetector?.disconnect()
    });
  }
  
  // Console error detection
  const consoleDetector = createConsoleLoopDetector();
  detectors.push({
    name: 'console-errors',
    cleanup: () => consoleDetector.restore()
  });
  
  return {
    detectors,
    cleanup: () => {
      detectors.forEach(detector => detector.cleanup());
    },
    runWithTimeout: <T>(operation: () => Promise<T> | T, operationName = 'test operation') => {
      return createTimeoutLoopDetector(operation, timeout, operationName);
    },
    // Loop detection methods
    getConsoleErrors: () => consoleDetector.getErrors(),
    getAllConsoleErrors: () => consoleDetector.getAllErrors(),
    hasLoopErrors: () => consoleDetector.hasLoopErrors(),
    hasAnyConsoleErrors: () => consoleDetector.hasAnyErrors(),
    getConsoleErrorReport: () => consoleDetector.getErrorReport(),
    
    // Exception handling methods
    getExceptions: () => exceptionHandler.getExceptions(),
    hasExceptions: () => exceptionHandler.hasExceptions(),
    getLastException: () => exceptionHandler.getLastException(),
    getExceptionReport: () => exceptionHandler.getDetailedReport(),
    
    // Combined validation - throws if ANY issues found
    validateNoIssues: () => {
      // Check for uncaught exceptions first (most critical)
      exceptionHandler.throwIfExceptions();
      
      // Check for loop errors
      if (consoleDetector.hasLoopErrors()) {
        throw new Error(`Test failed due to loop errors:\n${consoleDetector.getErrors().join('\n')}`);
      }
      
      // Check for any console errors (warnings might be acceptable)
      const errors = consoleDetector.getAllErrors().filter(err => err.type === 'error');
      if (errors.length > 0) {
        throw new Error(`Test failed due to console errors:\n${errors.map(err => err.message).join('\n')}`);
      }
    }
  };
}