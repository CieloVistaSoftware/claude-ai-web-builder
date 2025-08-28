// Test script for MCP integration
const axios = require('axios').default;

const BASE_URL = 'http://localhost:8000';

class MCPTester {
  constructor() {
    this.testResults = [];
  }

  async runAllTests() {
    console.log('🧪 Starting MCP Integration Tests...\n');
    
    await this.testHealthEndpoint();
    await this.testCapabilitiesEndpoint();
    await this.testValidateEndpoint();
    await this.testGenerateEndpoint();
    await this.testMetricsEndpoint();
    
    this.printResults();
  }

  async testHealthEndpoint() {
    try {
      console.log('Testing /mcp/health endpoint...');
      const response = await axios.get(`${BASE_URL}/mcp/health`);
      
      if (response.status === 200 && response.data.status === 'healthy') {
        this.testResults.push({ name: 'Health Check', status: '✅ PASS', details: 'Server is healthy' });
      } else {
        this.testResults.push({ name: 'Health Check', status: '❌ FAIL', details: 'Unexpected response' });
      }
    } catch (error) {
      this.testResults.push({ name: 'Health Check', status: '❌ FAIL', details: error.message });
    }
  }

  async testCapabilitiesEndpoint() {
    try {
      console.log('Testing /mcp/capabilities endpoint...');
      const response = await axios.get(`${BASE_URL}/mcp/capabilities`);
      
      const required = ['name', 'version', 'capabilities'];
      const hasRequired = required.every(field => response.data[field]);
      
      if (response.status === 200 && hasRequired) {
        this.testResults.push({ 
          name: 'Capabilities', 
          status: '✅ PASS', 
          details: `Found ${response.data.capabilities.websiteTypes.length} website types`
        });
      } else {
        this.testResults.push({ name: 'Capabilities', status: '❌ FAIL', details: 'Missing required fields' });
      }
    } catch (error) {
      this.testResults.push({ name: 'Capabilities', status: '❌ FAIL', details: error.message });
    }
  }

  async testValidateEndpoint() {
    try {
      console.log('Testing /mcp/validate endpoint...');
      
      // Test valid input
      const validInput = {
        website: { type: 'portfolio' },
        content: { title: 'Test Site' },
        output: { format: 'files' }
      };
      
      const response = await axios.post(`${BASE_URL}/mcp/validate`, validInput);
      
      if (response.status === 200 && response.data.valid === true) {
        this.testResults.push({ name: 'Validation', status: '✅ PASS', details: 'Valid input accepted' });
      } else {
        this.testResults.push({ name: 'Validation', status: '❌ FAIL', details: 'Valid input rejected' });
      }
    } catch (error) {
      this.testResults.push({ name: 'Validation', status: '❌ FAIL', details: error.message });
    }
  }

  async testGenerateEndpoint() {
    try {
      console.log('Testing /mcp/generate endpoint...');
      
      const generateInput = {
        toolName: 'claude-ai-website-builder',
        website: {
          type: 'portfolio',
          framework: 'vanilla',
          features: ['responsive-design', 'table-theme']
        },
        content: {
          title: 'Test Portfolio',
          description: 'A test portfolio generated via MCP'
        },
        output: {
          format: 'files'
        },
        customization: {
          primaryColor: '#007acc',
          secondaryColor: '#f8f9fa',
          accentColor: '#17a2b8'
        }
      };
      
      const response = await axios.post(`${BASE_URL}/mcp/generate`, generateInput);
      
      if (response.status === 200 && response.data.success && response.data.files.length > 0) {
        this.testResults.push({ 
          name: 'Generation', 
          status: '✅ PASS', 
          details: `Generated ${response.data.files.length} files`
        });
        
        // Log generated files for verification
        console.log('Generated files:');
        response.data.files.forEach(file => {
          console.log(`  - ${file.path} (${file.content.length} bytes)`);
        });
      } else {
        this.testResults.push({ name: 'Generation', status: '❌ FAIL', details: 'No files generated' });
      }
    } catch (error) {
      this.testResults.push({ name: 'Generation', status: '❌ FAIL', details: error.message });
    }
  }

  async testMetricsEndpoint() {
    try {
      console.log('Testing /mcp/metrics endpoint...');
      const response = await axios.get(`${BASE_URL}/mcp/metrics`);
      
      const required = ['requests', 'resources', 'generation'];
      const hasRequired = required.every(field => response.data[field]);
      
      if (response.status === 200 && hasRequired) {
        this.testResults.push({ name: 'Metrics', status: '✅ PASS', details: 'All metrics available' });
      } else {
        this.testResults.push({ name: 'Metrics', status: '❌ FAIL', details: 'Missing metric fields' });
      }
    } catch (error) {
      this.testResults.push({ name: 'Metrics', status: '❌ FAIL', details: error.message });
    }
  }

  printResults() {
    console.log('\n📋 Test Results Summary:');
    console.log('=' .repeat(50));
    
    this.testResults.forEach(result => {
      console.log(`${result.status} ${result.name}: ${result.details}`);
    });
    
    const passed = this.testResults.filter(r => r.status.includes('✅')).length;
    const total = this.testResults.length;
    
    console.log('=' .repeat(50));
    console.log(`📊 Total: ${passed}/${total} tests passed`);
    
    if (passed === total) {
      console.log('🎉 All tests passed! MCP integration is ready.');
    } else {
      console.log('⚠️  Some tests failed. Check server and try again.');
    }
  }
}

// Run tests if called directly
if (require.main === module) {
  const tester = new MCPTester();
  
  // Check if server is running first
  axios.get(`${BASE_URL}/mcp/health`)
    .then(() => {
      console.log('✅ Server is running, starting tests...\n');
      tester.runAllTests();
    })
    .catch(() => {
      console.log('❌ Server is not running. Please start the server first:');
      console.log('   npm start');
      console.log('   or');
      console.log('   node server.js');
    });
}

module.exports = MCPTester;
