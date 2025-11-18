#!/usr/bin/env node

// Debug the error response structure
const http = require('http');

function makeRequest(data) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    
    const options = {
      hostname: 'localhost',
      port: 8000,
      path: '/api/btr',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(responseData);
          resolve({
            status: res.statusCode,
            data: parsedData,
            raw: responseData
          });
        } catch (err) {
          resolve({
            status: res.statusCode,
            data: responseData,
            raw: responseData
          });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.write(postData);
    req.end();
  });
}

async function debugErrorResponse() {
  console.log('=== Debugging Error Response Structure ===');
  
  const requestData = {
    dob: "2025-12-31",
    pob_text: "Nowhere, Antarctica", 
    tz_offset_hours: 5.5,
    approx_tob: {
      mode: "unknown",
      center: null,
      window_hours: null
    }
  };

  try {
    const response = await makeRequest(requestData);
    console.log('Status:', response.status);
    console.log('Raw response:', response.raw);
    console.log('Parsed data type:', typeof response.data);
    console.log('Is array?', Array.isArray(response.data));
    
    if (Array.isArray(response.data)) {
      console.log('Error is an array - likely validation errors');
      console.log('Sample errors:', response.data.slice(0, 3));
    }
    
  } catch (error) {
    console.log('Request failed:', error.message);
  }
}

debugErrorResponse();
