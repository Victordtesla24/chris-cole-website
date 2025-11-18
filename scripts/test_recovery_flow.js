#!/usr/bin/env node

const http = require('http');

// Helper function to make HTTP requests
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
            data: parsedData
          });
        } catch (err) {
          resolve({
            status: res.statusCode,
            data: responseData
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

// Test Case 2.ii.a: DOB/POB + Career events only, no time range
async function testCase2_ii_a() {
  console.log('\n=== Test Case 2.ii.a: DOB/POB + Career events only, no time range ===');
  
  const requestData = {
    dob: "1985-10-24",
    pob_text: "Pune, India",
    tz_offset_hours: 5.5,
    approx_tob: {
      mode: "unknown",
      center: null,
      window_hours: null
    },
    optional_events: {
      career: [
        { date: "2010-06-15", role: "Software Engineer" },
        { date: "2015-03-20", role: "Senior Developer" }
      ]
    }
  };

  try {
    const response = await makeRequest(requestData);
    console.log('Status:', response.status);
    
    if (response.status === 404) {
      const errorData = response.data;
      console.log('✓ No candidates found (expected)');
      if (errorData.detail && errorData.detail.rejection_summary) {
        console.log('✓ Rejection summary found');
        if (errorData.detail.rejection_summary.suggested_questions) {
          console.log('✓ Dynamic suggested questions found:');
          errorData.detail.rejection_summary.suggested_questions.forEach((q, i) => {
            console.log(`  ${i + 1}. [P${q.priority}] ${q.message} (${q.field})`);
            if (q.hint) console.log(`     Hint: ${q.hint}`);
          });
          return { success: true, hasDynamicQuestions: true, questionCount: errorData.detail.rejection_summary.suggested_questions.length };
        } else {
          console.log('✗ No dynamic suggested questions found');
          return { success: false, hasDynamicQuestions: false };
        }
      }
    } else if (response.status === 200) {
      console.log('✓ Candidates found');
      return { success: true, foundCandidates: true, candidateCount: response.data.candidates.length };
    } else {
      console.log('✗ Unexpected status:', response.status);
      return { success: false, status: response.status };
    }
  } catch (error) {
    console.log('✗ Request failed:', error.message);
    return { success: false, error: error.message };
  }
}

// Test Case 2.ii.b: DOB/POB + Time range override + Career events only, no traits
async function testCase2_ii_b() {
  console.log('\n=== Test Case 2.ii.b: DOB/POB + Time range override + Career events only ===');
  
  const requestData = {
    dob: "1985-10-24",
    pob_text: "Pune, India", 
    tz_offset_hours: 5.5,
    approx_tob: {
      mode: "unknown",
      center: null,
      window_hours: null
    },
    time_range_override: {
      start: "11:00",
      end: "15:00"
    },
    optional_events: {
      career: [
        { date: "2010-06-15", role: "Software Engineer" },
        { date: "2015-03-20", role: "Senior Developer" }
      ]
    }
  };

  try {
    const response = await makeRequest(requestData);
    console.log('Status:', response.status);
    
    if (response.status === 404) {
      const errorData = response.data;
      console.log('✓ No candidates found (expected)');
      if (errorData.detail && errorData.detail.rejection_summary) {
        console.log('✓ Rejection summary found');
        if (errorData.detail.rejection_summary.suggested_questions) {
          console.log('✓ Dynamic suggested questions found:');
          errorData.detail.rejection_summary.suggested_questions.forEach((q, i) => {
            console.log(`  ${i + 1}. [P${q.priority}] ${q.message} (${q.field})`);
            if (q.hint) console.log(`     Hint: ${q.hint}`);
          });
          return { success: true, hasDynamicQuestions: true, questionCount: errorData.detail.rejection_summary.suggested_questions.length };
        } else {
          console.log('✗ No dynamic suggested questions found');
          return { success: false, hasDynamicQuestions: false };
        }
      }
    } else if (response.status === 200) {
      console.log('✓ Candidates found');
      return { success: true, foundCandidates: true, candidateCount: response.data.candidates.length };
    } else {
      console.log('✗ Unexpected status:', response.status);
      return { success: false, status: response.status };
    }
  } catch (error) {
    console.log('✗ Request failed:', error.message);
    return { success: false, error: error.message };
  }
}

// Test Case 2.i: Minimal request (DOB/POB only)
async function testCase2_i() {
  console.log('\n=== Test Case 2.i: Minimal request (DOB/POB only) ===');
  
  const requestData = {
    dob: "1985-10-24",
    pob_text: "Pune, India",
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
    
    if (response.status === 404) {
      const errorData = response.data;
      console.log('✓ No candidates found (expected)');
      if (errorData.detail && errorData.detail.rejection_summary) {
        console.log('✓ Rejection summary found');
        if (errorData.detail.rejection_summary.suggested_questions) {
          console.log('✓ Dynamic suggested questions found:');
          errorData.detail.rejection_summary.suggested_questions.forEach((q, i) => {
            console.log(`  ${i + 1}. [P${q.priority}] ${q.message} (${q.field})`);
            if (q.hint) console.log(`     Hint: ${q.hint}`);
          });
          return { success: true, hasDynamicQuestions: true, questionCount: errorData.detail.rejection_summary.suggested_questions.length };
        } else {
          console.log('✗ No dynamic suggested questions found');
          return { success: false, hasDynamicQuestions: false };
        }
      }
    } else if (response.status === 200) {
      console.log('✓ Candidates found');
      return { success: true, foundCandidates: true, candidateCount: response.data.candidates.length };
    } else {
      console.log('✗ Unexpected status:', response.status);
      return { success: false, status: response.status };
    }
  } catch (error) {
    console.log('✗ Request failed:', error.message);
    return { success: false, error: error.message };
  }
}

// Main test runner
async function runTests() {
  console.log('BTR Zero Candidate Fix - Implementation Tests');
  console.log('==========================================');
  
  // Wait a moment for server to start
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const results = {
    '2.ii.a': await testCase2_ii_a(),
    '2.ii.b': await testCase2_ii_b(),
    '2.i': await testCase2_i()
  };
  
  console.log('\n=== Test Summary Report (TSR) ===');
  console.table(results);
  
  // Determine overall success
  const allPassed = Object.values(results).every(result => 
    result.success && (result.hasDynamicQuestions || result.foundCandidates)
  );
  
  if (allPassed) {
    console.log('\n🎉 All tests PASSED! Implementation is working correctly.');
  } else {
    console.log('\n❌ Some tests FAILED. Check the results above.');
  }
  
  process.exit(allPassed ? 0 : 1);
}

if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { testCase2_ii_a, testCase2_ii_b, testCase2_i };
