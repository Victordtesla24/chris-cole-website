document.getElementById('btr-form').addEventListener('submit', async function (event) {
    event.preventDefault();
    
    // Hide previous results and errors
    document.getElementById('result-container').style.display = 'none';
    document.getElementById('error-message').style.display = 'none';
    document.getElementById('loading').style.display = 'block';
    
    const dob = document.getElementById('dob').value;
    const pob = document.getElementById('pob').value;
    const tz = parseFloat(document.getElementById('tz').value);
    const mode = document.getElementById('tob-mode').value;
    const center = document.getElementById('tob-center').value;
    const windowHours = parseFloat(document.getElementById('tob-window').value) || 3.0;
    const overrideStart = document.getElementById('override-start').value;
    const overrideEnd = document.getElementById('override-end').value;
  
    // Collect optional physical traits
    const height = document.getElementById('height').value;
    const build = document.getElementById('build').value;
    const complexion = document.getElementById('complexion').value;
    const optionalTraits = {};
    if (height) optionalTraits.height = height;
    if (build) optionalTraits.build = build;
    if (complexion) optionalTraits.complexion = complexion;
  
    // Collect optional life events
    const marriageDate = document.getElementById('marriage-date').value;
    const childrenCount = parseInt(document.getElementById('children-count').value) || 0;
    const careerEvents = document.getElementById('career-events').value;
    const optionalEvents = {};
    if (marriageDate) optionalEvents.marriage = { date: marriageDate };
    if (childrenCount > 0) {
      const childDates = Array.from(document.querySelectorAll('.child-date'))
        .map(input => input.value)
        .filter(date => date);
      optionalEvents.children = { count: childrenCount, dates: childDates };
    }
    if (careerEvents) {
      optionalEvents.career = careerEvents.split(',').map(d => d.trim()).filter(d => d);
    }
  
    const reqBody = {
      dob: dob,
      pob_text: pob,
      tz_offset_hours: tz,
      approx_tob: {
        mode: mode,
        center: mode === 'approx' ? center : null,
        window_hours: mode === 'approx' ? windowHours : null
      },
      optional_traits: Object.keys(optionalTraits).length > 0 ? optionalTraits : null,
      optional_events: Object.keys(optionalEvents).length > 0 ? optionalEvents : null
    };
  
    if (overrideStart && overrideEnd) {
      reqBody.time_range_override = {
        start: overrideStart,
        end: overrideEnd
      };
    }
  
    try {
      const resp = await fetch('/api/btr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reqBody)
      });
      
      document.getElementById('loading').style.display = 'none';
      
      if (!resp.ok) {
        const error = await resp.json();
        const errorEl = document.getElementById('error-message');
        if (errorEl) {
          errorEl.textContent = 'Error: ' + error.detail;
          errorEl.style.display = 'block';
        }
        return;
      }
      
      const data = await resp.json();
      displayResults(data);
    } catch (err) {
      const loadingEl = document.getElementById('loading');
      const errorEl = document.getElementById('error-message');
      if (loadingEl) loadingEl.style.display = 'none';
      if (errorEl) {
        errorEl.textContent = 'Request failed: ' + err.message;
        errorEl.style.display = 'block';
      }
    }
  });

function displayResults(data) {
  // Display geocode information
  const geocodeInfo = document.getElementById('geocode-info');
  if (data.geocode) {
    geocodeInfo.innerHTML = `
      <div class="info-item">
        <strong>Location:</strong> ${data.geocode.formatted || 'N/A'}
      </div>
      <div class="info-item">
        <strong>Latitude:</strong> ${data.geocode.lat ? data.geocode.lat.toFixed(6) : 'N/A'}
      </div>
      <div class="info-item">
        <strong>Longitude:</strong> ${data.geocode.lon ? data.geocode.lon.toFixed(6) : 'N/A'}
      </div>
    `;
  }

  // Display best candidate
  const bestCandidate = document.getElementById('best-candidate');
  if (data.best_candidate) {
    bestCandidate.innerHTML = formatCandidate(data.best_candidate, true);
  } else {
    bestCandidate.innerHTML = '<p>No candidate found.</p>';
  }

  // Display all candidates
  const candidatesList = document.getElementById('candidates-list');
  if (data.candidates && data.candidates.length > 0) {
    let candidatesHTML = `<p>Found ${data.candidates.length} candidate(s):</p>`;
    candidatesHTML += '<div class="candidates-grid">';
    data.candidates.forEach((candidate, index) => {
      candidatesHTML += `
        <div class="candidate-card">
          <div class="candidate-header">
            <strong>Candidate #${index + 1}</strong>
            ${index === 0 ? '<span class="best-badge">Best</span>' : ''}
          </div>
          ${formatCandidate(candidate, false)}
        </div>
      `;
    });
    candidatesHTML += '</div>';
    candidatesList.innerHTML = candidatesHTML;
  } else {
    candidatesList.innerHTML = '<p>No candidates found.</p>';
  }

  // Display search configuration
  const searchConfig = document.getElementById('search-config');
  if (data.search_config) {
    searchConfig.innerHTML = `
      <div class="info-item">
        <strong>Step Size:</strong> ${data.search_config.step_minutes || 'N/A'} minutes
      </div>
      ${data.search_config.time_window_used ? `
        <div class="info-item">
          <strong>Time Window:</strong> ${data.search_config.time_window_used.start_local || 'N/A'} - ${data.search_config.time_window_used.end_local || 'N/A'}
        </div>
      ` : ''}
    `;
  }

  // Show results container
  document.getElementById('result-container').style.display = 'block';
  
  // Store data for export
  window.btrResults = data;
  
  // Scroll to results
  document.getElementById('result-container').scrollIntoView({ behavior: 'smooth' });
}

// Export JSON functionality
document.addEventListener('DOMContentLoaded', function() {
  const exportBtn = document.getElementById('export-json');
  if (exportBtn) {
    exportBtn.addEventListener('click', function() {
      if (window.btrResults) {
        const dataStr = JSON.stringify(window.btrResults, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `btr-results-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    });
  }
});

function formatCandidate(candidate, isBest) {
  const time = new Date(candidate.time_local);
  const timeStr = time.toLocaleString();
  
  function degToSign(deg) {
    const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
                   'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
    const signIndex = Math.floor(deg / 30) % 12;
    const degreesInSign = deg % 30;
    return `${signs[signIndex]} ${degreesInSign.toFixed(2)}°`;
  }
  
  return `
    <div class="candidate-details">
      <div class="detail-row">
        <span class="label">Time (Local):</span>
        <span class="value">${timeStr}</span>
      </div>
      <div class="detail-row">
        <span class="label">Lagna:</span>
        <span class="value">${candidate.lagna_deg ? degToSign(candidate.lagna_deg) : 'N/A'}</span>
      </div>
      <div class="detail-row">
        <span class="label">Pranapada (Sphuta):</span>
        <span class="value">${candidate.pranapada_deg ? degToSign(candidate.pranapada_deg) : 'N/A'}</span>
      </div>
      <div class="detail-row">
        <span class="label">Delta PP:</span>
        <span class="value ${candidate.delta_pp_deg <= 2 ? 'pass' : 'fail'}">${candidate.delta_pp_deg ? candidate.delta_pp_deg.toFixed(2) : 'N/A'}°</span>
      </div>
      <div class="detail-row">
        <span class="label">Passes Trine Rule (BPHS 4.10):</span>
        <span class="value ${candidate.passes_trine_rule ? 'pass' : 'fail'}">
          ${candidate.passes_trine_rule ? '✓ Yes (Human Birth)' : '✗ No (Rejected)'}
        </span>
      </div>
      ${candidate.verification_scores ? `
        <div class="scores-section">
          <h4>BPHS Verification Scores</h4>
          <div class="scores-grid">
            ${candidate.verification_scores.degree_match !== undefined ? `
              <div class="score-item">
                <span class="score-label">Degree Match (BPHS 4.6):</span>
                <span class="score-value">${candidate.verification_scores.degree_match.toFixed(1)}</span>
              </div>
            ` : ''}
            ${candidate.verification_scores.gulika_alignment !== undefined ? `
              <div class="score-item">
                <span class="score-label">Gulika Alignment:</span>
                <span class="score-value">${candidate.verification_scores.gulika_alignment.toFixed(1)}</span>
              </div>
            ` : ''}
            ${candidate.verification_scores.moon_alignment !== undefined ? `
              <div class="score-item">
                <span class="score-label">Moon Alignment:</span>
                <span class="score-value">${candidate.verification_scores.moon_alignment.toFixed(1)}</span>
              </div>
            ` : ''}
            ${candidate.verification_scores.combined_verification !== undefined ? `
              <div class="score-item highlight">
                <span class="score-label">Combined Verification (BPHS 4.8):</span>
                <span class="score-value">${candidate.verification_scores.combined_verification.toFixed(1)}</span>
              </div>
            ` : ''}
          </div>
        </div>
      ` : ''}
      ${candidate.special_lagnas ? `
        <div class="special-lagnas-section">
          <h4>Special Lagnas (BPHS 4.18-28)</h4>
          <div class="lagnas-grid">
            <div class="lagna-item">
              <span class="lagna-label">Bhava Lagna:</span>
              <span class="lagna-value">${degToSign(candidate.special_lagnas.bhava_lagna)}</span>
            </div>
            <div class="lagna-item">
              <span class="lagna-label">Hora Lagna:</span>
              <span class="lagna-value">${degToSign(candidate.special_lagnas.hora_lagna)}</span>
            </div>
            <div class="lagna-item">
              <span class="lagna-label">Ghati Lagna:</span>
              <span class="lagna-value">${degToSign(candidate.special_lagnas.ghati_lagna)}</span>
            </div>
            <div class="lagna-item">
              <span class="lagna-label">Varnada Lagna:</span>
              <span class="lagna-value">${degToSign(candidate.special_lagnas.varnada_lagna)}</span>
            </div>
          </div>
        </div>
      ` : ''}
      ${candidate.nisheka ? `
        <div class="nisheka-section">
          <h4>Nisheka Lagna (BPHS 4.12-16)</h4>
          <div class="info-item">
            <strong>Nisheka Lagna:</strong> ${degToSign(candidate.nisheka.nisheka_lagna_deg)}
          </div>
          <div class="info-item">
            <strong>Gestation Period:</strong> ${candidate.nisheka.gestation_months.toFixed(1)} months
            <span class="${candidate.nisheka.is_realistic ? 'pass' : 'fail'}">
              ${candidate.nisheka.is_realistic ? '✓ Realistic' : '⚠ Unrealistic'}
            </span>
          </div>
          <div class="info-item">
            <strong>Gestation Score:</strong> ${candidate.nisheka.gestation_score.toFixed(1)}/100
          </div>
        </div>
      ` : ''}
    </div>
  `;
}
