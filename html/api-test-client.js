// API Test Client
// Simple utility for testing API endpoints

/**
 * Makes a fetch request and logs the response
 * @param {string} url - The API endpoint URL
 * @param {RequestInit} [options] - Fetch options
 * @returns {Promise<any>}
 */
async function testApiCall(url, options = {}) {
    try {
        console.log('🔄 Making API call to:', url);
        const response = await fetch(url, options);
        const data = await response.json();
        console.log('✅ Response:', data);
        return data;
    } catch (error) {
        console.error('❌ API Error:', error);
        throw error;
    }
}

// Export for use in other modules
export { testApiCall };
