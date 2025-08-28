// Example MCP Client - Shows how an external MCP server would use your website builder
// This demonstrates the integration from the MCP server's perspective

import { test, expect } from '@playwright/test';

test.describe('MCP Client Integration Example', () => {
  const baseURL = 'http://localhost:8000';

  test('should demonstrate complete MCP workflow', async ({ request }) => {
    console.log('🔄 Starting MCP Client Integration Demo...\n');

    // Step 1: Check if the website builder is available
    console.log('1️⃣ Checking website builder availability...');
    const healthResponse = await request.get(`${baseURL}/mcp/health`);
    expect(healthResponse.status()).toBe(200);
    
    const healthData = await healthResponse.json();
    console.log(`   ✅ Website builder is ${healthData.status}`);

    // Step 2: Get capabilities to understand what the tool can do
    console.log('2️⃣ Querying tool capabilities...');
    const capabilitiesResponse = await request.get(`${baseURL}/mcp/capabilities`);
    expect(capabilitiesResponse.status()).toBe(200);
    
    const capabilities = await capabilitiesResponse.json();
    console.log(`   📋 Tool: ${capabilities.name} v${capabilities.version}`);
    console.log(`   🌐 Website types: ${capabilities.capabilities.websiteTypes.join(', ')}`);
    console.log(`   🔧 Features: ${capabilities.capabilities.features.slice(0, 3).join(', ')}...`);

    // Step 3: Validate input before generation
    console.log('3️⃣ Validating generation request...');
    const generationRequest = {
      toolName: 'claude-ai-website-builder',
      website: {
        type: 'portfolio',
        framework: 'vanilla',
        features: ['responsive-design', 'table-theme', 'theme-customization']
      },
      content: {
        title: 'AI-Generated Portfolio',
        description: 'A portfolio website generated through MCP integration'
      },
      output: {
        format: 'files'
      },
      customization: {
        primaryColor: '#6366f1',
        secondaryColor: '#f8fafc',
        accentColor: '#f59e0b'
      }
    };

    const validateResponse = await request.post(`${baseURL}/mcp/validate`, {
      data: generationRequest
    });
    expect(validateResponse.status()).toBe(200);
    
    const validation = await validateResponse.json();
    expect(validation.valid).toBe(true);
    console.log('   ✅ Input validation passed');

    // Step 4: Generate the website
    console.log('4️⃣ Generating website...');
    const startTime = Date.now();
    
    const generateResponse = await request.post(`${baseURL}/mcp/generate`, {
      data: generationRequest
    });
    expect(generateResponse.status()).toBe(200);
    
    const result = await generateResponse.json();
    expect(result.success).toBe(true);
    
    const endTime = Date.now();
    console.log(`   🎉 Website generated successfully in ${endTime - startTime}ms`);
    console.log(`   📁 Generated ${result.files.length} files`);
    console.log(`   📊 Total size: ${Math.round(result.metadata.totalSize / 1024)}KB`);

    // Step 5: Verify the generated content
    console.log('5️⃣ Verifying generated content...');
      const htmlFile = result.files.find((f: any) => f.path === 'index.html');
    const cssFile = result.files.find((f: any) => f.path === 'css/styles.css');
    const jsFile = result.files.find((f: any) => f.path === 'js/main.js');
    
    expect(htmlFile).toBeDefined();
    expect(cssFile).toBeDefined();
    expect(jsFile).toBeDefined();
    
    // Verify content includes our specifications
    expect(htmlFile.content).toContain('AI-Generated Portfolio');
    expect(htmlFile.content).toContain('claude-table'); // Table component
    expect(cssFile.content).toContain('#6366f1'); // Custom primary color
    expect(jsFile.content).toContain('ClaudeThemeSystem'); // Theme system
    
    console.log('   ✅ HTML file contains expected content');
    console.log('   ✅ CSS file includes custom colors');
    console.log('   ✅ JavaScript includes theme system');

    // Step 6: Check recommendations
    console.log('6️⃣ Reviewing recommendations...');
    expect(result.recommendations).toBeDefined();
    expect(result.recommendations.length).toBeGreaterThan(0);
    
    result.recommendations.forEach((rec: any, index: number) => {
      console.log(`   💡 ${rec.type.toUpperCase()}: ${rec.message}`);
    });

    // Step 7: Verify deployment readiness
    console.log('7️⃣ Checking deployment readiness...');
    expect(result.metadata.deploymentReady).toBe(true);
    console.log('   ✅ Website is ready for deployment');
    
    console.log('\n🎯 MCP Integration Demo Complete!');
    console.log('   The website builder successfully integrated with MCP protocol');
    console.log('   and generated a complete website using existing components.');
  });

  test('should handle multiple website types through MCP', async ({ request }) => {
    const websiteTypes = ['portfolio', 'business', 'blog', 'landing'];
    
    for (const type of websiteTypes) {
      console.log(`\n🏗️ Testing ${type} website generation...`);
      
      const input = {
        toolName: 'claude-ai-website-builder',
        website: {
          type: type,
          framework: 'vanilla',
          features: ['responsive-design']
        },
        content: {
          title: `Test ${type.charAt(0).toUpperCase() + type.slice(1)}`,
          description: `A ${type} website generated via MCP`
        },
        output: {
          format: 'files'
        }
      };

      const response = await request.post(`${baseURL}/mcp/generate`, {
        data: input
      });

      expect(response.status()).toBe(200);
      
      const result = await response.json();
      expect(result.success).toBe(true);
      expect(result.files.length).toBeGreaterThan(0);
      
      console.log(`   ✅ ${type} website generated with ${result.files.length} files`);
    }
  });

  test('should demonstrate error handling in MCP workflow', async ({ request }) => {
    console.log('\n⚠️ Testing error handling...');
    
    // Test with invalid input
    const invalidInput = {
      toolName: 'claude-ai-website-builder',
      website: {
        type: 'invalid-type'
      },
      content: {
        title: 'Test Site'
      },
      output: {
        format: 'invalid-format'
      }
    };

    // Validation should catch the errors
    const validateResponse = await request.post(`${baseURL}/mcp/validate`, {
      data: invalidInput
    });
    
    const validation = await validateResponse.json();
    expect(validation.valid).toBe(false);
    expect(validation.errors.length).toBeGreaterThan(0);
    
    console.log('   ✅ Validation correctly identified errors:');
    validation.errors.forEach((error: any) => {
      console.log(`      - ${error}`);
    });

    // Generation should also handle errors gracefully
    const generateResponse = await request.post(`${baseURL}/mcp/generate`, {
      data: invalidInput
    });
    
    expect(generateResponse.status()).toBe(400);
    
    const result = await generateResponse.json();
    expect(result.success).toBe(false);
    expect(result.error).toContain('Invalid input');
    
    console.log('   ✅ Generation endpoint handled errors gracefully');
  });

  test('should demonstrate performance metrics collection', async ({ request }) => {
    console.log('\n📊 Testing performance metrics...');
    
    // Generate a few websites to create some metrics
    for (let i = 0; i < 3; i++) {
      const input = {
        toolName: 'claude-ai-website-builder',
        website: { type: 'portfolio' },
        content: { title: `Performance Test ${i + 1}` },
        output: { format: 'files' }
      };

      await request.post(`${baseURL}/mcp/generate`, { data: input });
    }

    // Check metrics
    const metricsResponse = await request.get(`${baseURL}/mcp/metrics`);
    expect(metricsResponse.status()).toBe(200);
    
    const metrics = await metricsResponse.json();
    
    console.log('   📈 Current Metrics:');
    console.log(`      - Total requests: ${metrics.requests.total}`);
    console.log(`      - Successful: ${metrics.requests.successful}`);
    console.log(`      - Failed: ${metrics.requests.failed}`);
    console.log(`      - Average response time: ${metrics.requests.averageResponseTime}ms`);
    console.log(`      - Memory usage: ${Math.round(metrics.resources.memoryUsage.heapUsed / 1024 / 1024)}MB`);
    
    expect(metrics.requests.total).toBeGreaterThan(0);
    expect(metrics.resources.memoryUsage).toBeDefined();
  });
});
