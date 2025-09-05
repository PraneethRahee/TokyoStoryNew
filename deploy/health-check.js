// Health Check Script for Tokyo Story
// This script monitors the health of your application

const https = require('https');
const http = require('http');

const config = {
  backend: {
    url: process.env.BACKEND_URL || 'https://tokyostorynew.onrender.com',
    endpoints: ['/api/health', '/api/auth/me']
  },
  frontend: {
    url: process.env.FRONTEND_URL || 'https://tokyo-story-new.vercel.app',
    endpoints: ['/', '/stories', '/login']
  },
  timeout: 10000, // 10 seconds
  retries: 3
};

// Function to make HTTP request
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith('https://');
    const client = isHttps ? https : http;
    
    const requestOptions = {
      timeout: config.timeout,
      ...options
    };

    const req = client.request(url, requestOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: data
        });
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

// Function to check endpoint health
async function checkEndpoint(baseUrl, endpoint) {
  const url = `${baseUrl}${endpoint}`;
  
  for (let attempt = 1; attempt <= config.retries; attempt++) {
    try {
      console.log(`🔍 Checking ${url} (attempt ${attempt}/${config.retries})`);
      
      const response = await makeRequest(url);
      
      if (response.status >= 200 && response.status < 400) {
        console.log(`✅ ${url} - Status: ${response.status}`);
        return { success: true, status: response.status, url };
      } else {
        console.log(`⚠️  ${url} - Status: ${response.status}`);
        if (attempt === config.retries) {
          return { success: false, status: response.status, url };
        }
      }
    } catch (error) {
      console.log(`❌ ${url} - Error: ${error.message}`);
      if (attempt === config.retries) {
        return { success: false, error: error.message, url };
      }
    }
    
    // Wait before retry
    if (attempt < config.retries) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
}

// Function to check all endpoints
async function checkAllEndpoints() {
  console.log('🏥 Tokyo Story Health Check');
  console.log('============================');
  console.log(`Backend: ${config.backend.url}`);
  console.log(`Frontend: ${config.frontend.url}`);
  console.log('');

  const results = {
    backend: [],
    frontend: [],
    overall: true
  };

  // Check backend endpoints
  console.log('🔧 Backend Health Check:');
  for (const endpoint of config.backend.endpoints) {
    const result = await checkEndpoint(config.backend.url, endpoint);
    results.backend.push(result);
    if (!result.success) {
      results.overall = false;
    }
  }

  console.log('');

  // Check frontend endpoints
  console.log('🌐 Frontend Health Check:');
  for (const endpoint of config.frontend.endpoints) {
    const result = await checkEndpoint(config.frontend.url, endpoint);
    results.frontend.push(result);
    if (!result.success) {
      results.overall = false;
    }
  }

  console.log('');
  console.log('📊 Health Check Summary:');
  console.log('========================');

  const backendHealthy = results.backend.every(r => r.success);
  const frontendHealthy = results.frontend.every(r => r.success);

  console.log(`Backend: ${backendHealthy ? '✅ Healthy' : '❌ Issues detected'}`);
  console.log(`Frontend: ${frontendHealthy ? '✅ Healthy' : '❌ Issues detected'}`);
  console.log(`Overall: ${results.overall ? '✅ All systems operational' : '❌ Issues detected'}`);

  // Exit with appropriate code
  process.exit(results.overall ? 0 : 1);
}

// Function to run continuous monitoring
async function continuousMonitoring(intervalMinutes = 5) {
  console.log(`🔄 Starting continuous monitoring (every ${intervalMinutes} minutes)`);
  
  while (true) {
    await checkAllEndpoints();
    console.log(`\n⏰ Waiting ${intervalMinutes} minutes until next check...\n`);
    await new Promise(resolve => setTimeout(resolve, intervalMinutes * 60 * 1000));
  }
}

// Main execution
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--continuous') || args.includes('-c')) {
    const interval = parseInt(args.find(arg => arg.startsWith('--interval='))?.split('=')[1]) || 5;
    continuousMonitoring(interval);
  } else {
    checkAllEndpoints();
  }
}

module.exports = { checkAllEndpoints, checkEndpoint, continuousMonitoring };
