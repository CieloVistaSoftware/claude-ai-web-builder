import { test, expect } from '@playwright/test';

// Helper to capture errors
async function captureAndLogError(testName, error) {
  const errorText = `TEST: ${testName}\nERROR: ${error?.message || error}\nSTACK: ${error?.stack || 'N/A'}`;
  console.error(errorText);
  throw error;
}

test.describe('WBBaseComponent', () => {

  test('component can be registered via script tag', async ({ page }) => {
    try {
      await page.goto('http://localhost:3000/');
      page.on('console', msg => console.log(`[PAGE]`, msg.text()));
      
      await page.setContent(`
        <script type="module">
          (async () => {
            console.log('Importing WBBaseComponent...');
            try {
              const mod = await import('http://localhost:3000/wb-base/wb-base.js');
              const WBBaseComponent = mod.default;
              console.log('Import successful');
              
              class TestBasic extends WBBaseComponent {
                connectedCallback() {
                  super.connectedCallback();
                }
              }
              
              customElements.define('test-basic', TestBasic);
              window.testDefined = true;
              console.log('testDefined = true');
            } catch (err) {
              console.error('Import failed:', err.message);
              window.scriptError = err.message;
            }
          })();
        </script>
        <test-basic></test-basic>
      `);
      
      await page.waitForTimeout(1000);
      const scriptError = await page.evaluate(() => window.scriptError);
      if (scriptError) throw new Error(`Import failed: ${scriptError}`);
      
      const defined = await page.evaluate(() => window.testDefined);
      expect(defined).toBe(true);
    } catch (error) {
      await captureAndLogError('component can be registered via script tag', error);
    }
  });

  test('Light DOM is default (no Shadow DOM)', async ({ page }) => {
    try {
      await page.goto('http://localhost:3000/');
      
      await page.setContent(`
        <script type="module">
          (async () => {
            try {
              const mod = await import('http://localhost:3000/wb-base/wb-base.js');
              const WBBaseComponent = mod.default;
              
              class TestLight extends WBBaseComponent {
                connectedCallback() {
                  super.connectedCallback();
                }
              }
              
              customElements.define('test-light', TestLight);
              window.lightDOMTest = true;
            } catch (err) {
              window.scriptError = err.message;
            }
          })();
        </script>
        <test-light></test-light>
      `);
      
      await page.waitForTimeout(1000);
      const scriptError = await page.evaluate(() => window.scriptError);
      if (scriptError) throw new Error(`Script error: ${scriptError}`);
      
      const hasShadow = await page.evaluate(() => {
        const el = document.querySelector('test-light');
        return el.shadowRoot !== null;
      });
      expect(hasShadow).toBe(false);
    } catch (error) {
      await captureAndLogError('Light DOM is default (no Shadow DOM)', error);
    }
  });

  test('Shadow DOM is intentionally disabled (Light DOM only)', async ({ page }) => {
    try {
      await page.goto('http://localhost:3000/');
      
      await page.setContent(`
        <script type="module">
          (async () => {
            try {
              const mod = await import('http://localhost:3000/wb-base/wb-base.js');
              const WBBaseComponent = mod.default;
              
              class TestShadow extends WBBaseComponent {
                connectedCallback() {
                  super.connectedCallback();
                }
              }
              
              customElements.define('test-shadow', TestShadow);
              window.shadowTest = true;
            } catch (err) {
              window.scriptError = err.message;
            }
          })();
        </script>
        <test-shadow></test-shadow>
      `);
      
      await page.waitForTimeout(1000);
      const scriptError = await page.evaluate(() => window.scriptError);
      if (scriptError) throw new Error(`Script error: ${scriptError}`);
      
      const hasShadow = await page.evaluate(() => {
        const el = document.querySelector('test-shadow');
        return el.shadowRoot !== null;
      });
      expect(hasShadow).toBe(false);
    } catch (error) {
      await captureAndLogError('Shadow DOM is intentionally disabled (Light DOM only)', error);
    }
  });

  test('fireEvent dispatches custom events', async ({ page }) => {
    try {
      await page.goto('http://localhost:3000/');
      
      await page.setContent(`
        <script type="module">
          (async () => {
            try {
              const mod = await import('http://localhost:3000/wb-base/wb-base.js');
              const WBBaseComponent = mod.default;
              
              // Set up listener BEFORE component class (important!)
              window.eventFired = false;
              window.eventValue = null;
              document.addEventListener('test-event', (e) => {
                window.eventFired = true;
                window.eventValue = e.detail?.value;
                console.log('Event listener fired, value:', e.detail?.value);
              }, true);
              
              class TestEvent extends WBBaseComponent {
                connectedCallback() {
                  super.connectedCallback();
                  console.log('Firing test-event from component');
                  this.fireEvent('test-event', { value: 42 });
                }
              }
              
              customElements.define('test-event', TestEvent);
            } catch (err) {
              console.error('Script error:', err.message);
              window.scriptError = err.message;
            }
          })();
        </script>
        <test-event></test-event>
      `);
      
      await page.waitForTimeout(1500);
      const scriptError = await page.evaluate(() => window.scriptError);
      if (scriptError) throw new Error(`Script error: ${scriptError}`);
      
      const eventFired = await page.evaluate(() => window.eventFired);
      const value = await page.evaluate(() => window.eventValue);
      
      if (!eventFired) {
        throw new Error(`Event never fired (value was ${value})`);
      }
      
      expect(value).toBe(42);
    } catch (error) {
      await captureAndLogError('fireEvent dispatches custom events', error);
    }
  });

  test('logInfo records in event log', async ({ page }) => {
    try {
      await page.goto('http://localhost:3000/');
      
      await page.setContent(`
        <script type="module">
          (async () => {
            try {
              const mod = await import('http://localhost:3000/wb-base/wb-base.js');
              const WBBaseComponent = mod.default;
              
              class TestLog extends WBBaseComponent {
                connectedCallback() {
                  super.connectedCallback();
                  this.logInfo('Test log message');
                }
              }
              
              customElements.define('test-log', TestLog);
              window.logTested = true;
            } catch (err) {
              window.scriptError = err.message;
            }
          })();
        </script>
        <test-log></test-log>
      `);
      
      await page.waitForTimeout(1000);
      const scriptError = await page.evaluate(() => window.scriptError);
      if (scriptError) throw new Error(`Script error: ${scriptError}`);
      
      const hasLog = await page.evaluate(() => {
        const logs = window.WBBaseComponent?.getEventLog?.() || [];
        return logs.some(log => log.message === 'Test log message');
      });
      expect(hasLog).toBe(true);
    } catch (error) {
      await captureAndLogError('logInfo records in event log', error);
    }
  });

  test('logError records error type in log', async ({ page }) => {
    try {
      await page.goto('http://localhost:3000/');
      
      await page.setContent(`
        <script type="module">
          (async () => {
            try {
              const mod = await import('http://localhost:3000/wb-base/wb-base.js');
              const WBBaseComponent = mod.default;
              
              class TestError extends WBBaseComponent {
                connectedCallback() {
                  super.connectedCallback();
                  this.logError('Error message');
                }
              }
              
              customElements.define('test-error-log', TestError);
              window.errorTested = true;
            } catch (err) {
              window.scriptError = err.message;
            }
          })();
        </script>
        <test-error-log></test-error-log>
      `);
      
      await page.waitForTimeout(1000);
      const scriptError = await page.evaluate(() => window.scriptError);
      if (scriptError) throw new Error(`Script error: ${scriptError}`);
      
      const hasError = await page.evaluate(() => {
        const logs = window.WBBaseComponent?.getEventLog?.() || [];
        return logs.some(log => log.type === 'error');
      });
      expect(hasError).toBe(true);
    } catch (error) {
      await captureAndLogError('logError records error type in log', error);
    }
  });

  test('event log limited to 50 entries', async ({ page }) => {
    try {
      await page.goto('http://localhost:3000/');
      
      await page.setContent(`
        <script type="module">
          (async () => {
            try {
              const mod = await import('http://localhost:3000/wb-base/wb-base.js');
              const WBBaseComponent = mod.default;
              
              for (let i = 0; i < 60; i++) {
                WBBaseComponent.logEvent(\`Message \${i}\`, 'info');
              }
              
              window.logCount = WBBaseComponent.getEventLog().length;
            } catch (err) {
              window.scriptError = err.message;
            }
          })();
        </script>
      `);
      
      await page.waitForTimeout(1000);
      const scriptError = await page.evaluate(() => window.scriptError);
      if (scriptError) throw new Error(`Script error: ${scriptError}`);
      
      const count = await page.evaluate(() => window.logCount);
      expect(count).toBeLessThanOrEqual(50);
    } catch (error) {
      await captureAndLogError('event log limited to 50 entries', error);
    }
  });

  test('sets data-mode to dark on mount', async ({ page }) => {
    try {
      await page.goto('http://localhost:3000/');
      
      await page.setContent(`
        <script type="module">
          (async () => {
            try {
              const mod = await import('http://localhost:3000/wb-base/wb-base.js');
              const WBBaseComponent = mod.default;
              
              class TestMode extends WBBaseComponent {
                connectedCallback() {
                  super.connectedCallback();
                }
              }
              
              customElements.define('test-mode', TestMode);
              window.modeTested = true;
            } catch (err) {
              window.scriptError = err.message;
            }
          })();
        </script>
        <test-mode></test-mode>
      `);
      
      await page.waitForTimeout(1000);
      const scriptError = await page.evaluate(() => window.scriptError);
      if (scriptError) throw new Error(`Script error: ${scriptError}`);
      
      const mode = await page.evaluate(() => document.documentElement.getAttribute('data-mode'));
      expect(mode).toBe('dark');
    } catch (error) {
      await captureAndLogError('sets data-mode to dark on mount', error);
    }
  });

  test('getCurrentTheme returns theme value', async ({ page }) => {
    try {
      await page.goto('http://localhost:3000/');
      
      await page.setContent(`
        <script type="module">
          (async () => {
            try {
              const mod = await import('http://localhost:3000/wb-base/wb-base.js');
              const WBBaseComponent = mod.default;
              
              class TestTheme extends WBBaseComponent {
                connectedCallback() {
                  super.connectedCallback();
                  window.currentTheme = this.getCurrentTheme();
                }
              }
              
              customElements.define('test-theme', TestTheme);
            } catch (err) {
              window.scriptError = err.message;
            }
          })();
        </script>
        <test-theme></test-theme>
      `);
      
      await page.waitForTimeout(1000);
      const scriptError = await page.evaluate(() => window.scriptError);
      if (scriptError) throw new Error(`Script error: ${scriptError}`);
      
      const theme = await page.evaluate(() => window.currentTheme);
      expect(theme).toBeTruthy();
    } catch (error) {
      await captureAndLogError('getCurrentTheme returns theme value', error);
    }
  });

  test('register() method defines custom elements', async ({ page }) => {
    try {
      await page.goto('http://localhost:3000/');
      
      await page.setContent(`
        <script type="module">
          (async () => {
            try {
              const mod = await import('http://localhost:3000/wb-base/wb-base.js');
              const WBBaseComponent = mod.default;
              
              class TestRegister extends WBBaseComponent {}
              TestRegister.register('test-register');
              
              window.registered = !!customElements.get('test-register');
            } catch (err) {
              window.scriptError = err.message;
            }
          })();
        </script>
      `);
      
      await page.waitForTimeout(1000);
      const scriptError = await page.evaluate(() => window.scriptError);
      if (scriptError) throw new Error(`Script error: ${scriptError}`);
      
      const registered = await page.evaluate(() => window.registered);
      expect(registered).toBe(true);
    } catch (error) {
      await captureAndLogError('register() method defines custom elements', error);
    }
  });

  test('reportError fires wb:error event', async ({ page }) => {
    try {
      await page.goto('http://localhost:3000/');
      
      await page.setContent(`
        <script type="module">
          (async () => {
            try {
              const mod = await import('http://localhost:3000/wb-base/wb-base.js');
              const WBBaseComponent = mod.default;
              
              // SET UP LISTENER FIRST - before component is defined!
              window.errorEventFired = false;
              document.addEventListener('wb:error', () => {
                console.log('wb:error event caught!');
                window.errorEventFired = true;
              }, true);
              
              class TestReportError extends WBBaseComponent {
                connectedCallback() {
                  super.connectedCallback();
                  console.log('About to call reportError');
                  this.reportError(new Error('Test'), { context: 'test' });
                }
              }
              customElements.define('test-report', TestReportError);
            } catch (err) {
              console.error('Script error:', err);
              window.scriptError = err.message;
            }
          })();
        </script>
        <test-report></test-report>
      `);
      
      await page.waitForTimeout(1500);
      const scriptError = await page.evaluate(() => window.scriptError);
      if (scriptError) throw new Error(`Script error: ${scriptError}`);
      
      const fired = await page.evaluate(() => window.errorEventFired);
      expect(fired).toBe(true);
    } catch (error) {
      await captureAndLogError('reportError fires wb:error event', error);
    }
  });

  test('connectedCallback is called', async ({ page }) => {
    try {
      await page.goto('http://localhost:3000/');
      
      await page.setContent(`
        <script type="module">
          (async () => {
            try {
              const mod = await import('http://localhost:3000/wb-base/wb-base.js');
              const WBBaseComponent = mod.default;
              
              class TestConnected extends WBBaseComponent {
                connectedCallback() {
                  super.connectedCallback();
                  window.connectedCalled = true;
                }
              }
              
              customElements.define('test-connected', TestConnected);
            } catch (err) {
              window.scriptError = err.message;
            }
          })();
        </script>
        <test-connected></test-connected>
      `);
      
      await page.waitForTimeout(1000);
      const scriptError = await page.evaluate(() => window.scriptError);
      if (scriptError) throw new Error(`Script error: ${scriptError}`);
      
      const called = await page.evaluate(() => window.connectedCalled);
      expect(called).toBe(true);
    } catch (error) {
      await captureAndLogError('connectedCallback is called', error);
    }
  });

  test('attributeChangedCallback is called', async ({ page }) => {
    try {
      await page.goto('http://localhost:3000/');
      
      await page.setContent(`
        <script type="module">
          (async () => {
            try {
              const mod = await import('http://localhost:3000/wb-base/wb-base.js');
              const WBBaseComponent = mod.default;
              
              class TestAttrChange extends WBBaseComponent {
                static get observedAttributes() {
                  return ['data-test'];
                }
                
                attributeChangedCallback(name, oldVal, newVal) {
                  if (name === 'data-test') {
                    window.attrChanged = true;
                  }
                }
              }
              
              customElements.define('test-attr-change', TestAttrChange);
              window.attrTested = true;
            } catch (err) {
              window.scriptError = err.message;
            }
          })();
        </script>
        <test-attr-change></test-attr-change>
      `);
      
      await page.waitForTimeout(1000);
      const scriptError = await page.evaluate(() => window.scriptError);
      if (scriptError) throw new Error(`Script error: ${scriptError}`);
      
      await page.evaluate(() => {
        document.querySelector('test-attr-change').setAttribute('data-test', 'value');
      });
      
      await page.waitForTimeout(200);
      
      const changed = await page.evaluate(() => window.attrChanged);
      expect(changed).toBe(true);
    } catch (error) {
      await captureAndLogError('attributeChangedCallback is called', error);
    }
  });

});

test.describe('Phase 2 Architecture - Light DOM Validation', () => {

  test('wb-button uses Light DOM only', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    const isLight = await page.evaluate(async () => {
      try {
        const mod = await import('http://localhost:3000/wb-button/wb-button.js');
        return !mod.default.toString().includes('attachShadow');
      } catch { return false; }
    });
    expect(isLight).toBe(true);
  });

  test('wb-input uses Light DOM only', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    const isLight = await page.evaluate(async () => {
      try {
        const mod = await import('http://localhost:3000/wb-input/wb-input.js');
        return !mod.default.toString().includes('attachShadow');
      } catch { return false; }
    });
    expect(isLight).toBe(true);
  });

  test('wb-modal uses Light DOM only', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    const isLight = await page.evaluate(async () => {
      try {
        const mod = await import('http://localhost:3000/wb-modal/wb-modal.js');
        return !mod.default.toString().includes('attachShadow');
      } catch { return false; }
    });
    expect(isLight).toBe(true);
  });

});

  test('wb-1rem uses Light DOM only', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    const isLight = await page.evaluate(async () => {
      try {
        const mod = await import('http://localhost:3000/wb-1rem/wb-1rem.js');
        return !mod.default.toString().includes('attachShadow');
      } catch { return false; }
    });
    expect(isLight).toBe(true);
  });

  test('wb-color-bars uses Light DOM only', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    const isLight = await page.evaluate(async () => {
      try {
        const mod = await import('http://localhost:3000/wb-color-bars/wb-color-bars.js');
        return !mod.default.toString().includes('attachShadow');
      } catch { return false; }
    });
    expect(isLight).toBe(true);
  });

  test('wb-dev-toolbox uses Light DOM only', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    const isLight = await page.evaluate(async () => {
      try {
        const mod = await import('http://localhost:3000/wb-dev-toolbox/wb-dev-toolbox.js');
        return !mod.default.toString().includes('attachShadow');
      } catch { return false; }
    });
    expect(isLight).toBe(true);
  });

  test('wb-log-error uses Light DOM only', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    const isLight = await page.evaluate(async () => {
      try {
        const mod = await import('http://localhost:3000/wb-log-error/wb-log-error.js');
        return !mod.default.toString().includes('attachShadow');
      } catch { return false; }
    });
    expect(isLight).toBe(true);
  });

  test('wb-rag uses Light DOM only', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    const isLight = await page.evaluate(async () => {
      try {
        const mod = await import('http://localhost:3000/wb-rag/wb-rag.js');
        return !mod.default.toString().includes('attachShadow');
      } catch { return false; }
    });
    expect(isLight).toBe(true);
  });

  test('wb-resize-both uses Light DOM only', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    const isLight = await page.evaluate(async () => {
      try {
        const mod = await import('http://localhost:3000/wb-resize-both/wb-resize-both.js');
        return !mod.default.toString().includes('attachShadow');
      } catch { return false; }
    });
    expect(isLight).toBe(true);
  });

  test('wb-resize-eastwest uses Light DOM only', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    const isLight = await page.evaluate(async () => {
      try {
        const mod = await import('http://localhost:3000/wb-resize-eastwest/wb-resize-eastwest.js');
        return !mod.default.toString().includes('attachShadow');
      } catch { return false; }
    });
    expect(isLight).toBe(true);
  });

  test('wb-resize-updown uses Light DOM only', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    const isLight = await page.evaluate(async () => {
      try {
        const mod = await import('http://localhost:3000/wb-resize-updown/wb-resize-updown.js');
        return !mod.default.toString().includes('attachShadow');
      } catch { return false; }
    });
    expect(isLight).toBe(true);
  });

