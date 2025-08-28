/**
 * MCP API Client Example
 * 
 * This script demonstrates how to interact with the MCP API endpoints
 * provided by the Claude AI Website Builder.
 */

const fetch = require('node-fetch');

// Configuration
const API_BASE_URL = 'http://localhost:8000/mcp';
const ENDPOINTS = {
  generate: `${API_BASE_URL}/generate`,
  capabilities: `${API_BASE_URL}/capabilities`,
  health: `${API_BASE_URL}/health`,
  validate: `${API_BASE_URL}/validate`,
  metrics: `${API_BASE_URL}/metrics`
};

/**
 * Generate a website using the MCP API
 * @param {Object} params - Website generation parameters
 * @returns {Promise<Object>} - The generated website data
 */
async function generateWebsite(params) {
  try {
    const response = await fetch(ENDPOINTS.generate, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ input: params })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error generating website:', error);
    throw error;
  }
}

/**
 * Get MCP API capabilities
 * @returns {Promise<Object>} - The capabilities data
 */
async function getCapabilities() {
  try {
    const response = await fetch(ENDPOINTS.capabilities);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting capabilities:', error);
    throw error;
  }
}

/**
 * Check MCP API health
 * @returns {Promise<Object>} - The health status data
 */
async function checkHealth() {
  try {
    const response = await fetch(ENDPOINTS.health);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error checking health:', error);
    throw error;
  }
}

/**
 * Validate website parameters using the MCP API
 * @param {Object} params - The parameters to validate
 * @returns {Promise<Object>} - The validation results
 */
async function validateParams(params) {
  try {
    const response = await fetch(ENDPOINTS.validate, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ input: params })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error validating parameters:', error);
    throw error;
  }
}

/**
 * Example usage
 */
async function runExample() {
  console.log('Checking MCP API health...');
  const healthStatus = await checkHealth();
  console.log('Health status:', healthStatus);
  
  console.log('\nGetting API capabilities...');
  const capabilities = await getCapabilities();
  console.log('Capabilities:', JSON.stringify(capabilities, null, 2));
  
  console.log('\nValidating website parameters...');
  const validationParams = {
    websiteType: 'portfolio',
    title: 'My Photography Portfolio',
    industry: 'photography',
    colorScheme: 'dark',
    features: ['gallery', 'contact', 'about'],
    branding: {
      name: 'Alex Photography',
      slogan: 'Capturing moments that last forever'
    }
  };
  
  const validationResults = await validateParams(validationParams);
  console.log('Validation results:', validationResults);
  
  if (validationResults.valid) {
    console.log('\nGenerating website...');
    const generatedWebsite = await generateWebsite(validationParams);
    
    console.log('\nWebsite generated successfully!');
    console.log(`Number of files: ${generatedWebsite.files.length}`);
    
    // Print file paths
    console.log('\nGenerated files:');
    generatedWebsite.files.forEach(file => {
      console.log(` - ${file.path} (${file.content.length} bytes)`);
    });
    
    // Save a sample file (if any HTML files were generated)
    const htmlFile = generatedWebsite.files.find(file => file.path.endsWith('.html'));
    if (htmlFile) {
      const fs = require('fs');
      const sampleFilePath = './mcp-generated-sample.html';
      
      fs.writeFileSync(sampleFilePath, htmlFile.content);
      console.log(`\nSample HTML file saved to ${sampleFilePath}`);
    }
  } else {
    console.log('Invalid parameters, cannot generate website');
  }
}

// Run the example if this file is executed directly
if (require.main === module) {
  runExample().catch(error => {
    console.error('Example failed:', error);
  });
}

module.exports = {
  generateWebsite,
  getCapabilities,
  checkHealth,
  validateParams
};
