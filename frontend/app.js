let lastRequestBody = null;
let lastRejectionSummary = null;
let recoveryAttempt = 0;

function buildRequestBodyFromForm() {
  const dob = document.getElementById('dob').value;
  const pob = document.getElementById('pob').value;
  const tz = parseFloat(document.getElementById('tz').value);
  const mode = document.getElementById('tob-mode').value;
  const center = document.getElementById('tob-center').value;
  const windowHours = parseFloat(document.getElementById('tob-window').value) || 3.0;
  const overrideStart = document.getElementById('override-start').value;
  const overrideEnd = document.getElementById('override-end').value;

  const height = document.getElementById('height').value;
  const build = document.getElementById('build').value;
  const complexion = document.getElementById('complexion').value;
  const optionalTraits = {};
  if (height) optionalTraits.height = height;
  if (build) optionalTraits.build = build;
  if (complexion) optionalTraits.complexion = complexion;

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

  return reqBody;
}

function setLoading(isLoading, message) {
  const loadingEl = document.getElementById('loading');
  const detailEl = document.querySelector('.loading-detail');
  if (loadingEl) loadingEl.style.display = isLoading ? 'block' : 'none';
  if (detailEl && message) {
    detailEl.textContent = message;
  } else if (detailEl && !message) {
    detailEl.textContent = 'This may take a few moments';
  }
}

function showError(message) {
  const errorEl = document.getElementById('error-message');
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.style.display = 'block';
  }
}

function hideError() {
  const errorEl = document.getElementById('error-message');
  if (errorEl) {
    errorEl.style.display = 'none';
    errorEl.textContent = '';
  }
}

function resetResults() {
  const resultContainer = document.getElementById('result-container');
  if (resultContainer) resultContainer.style.display = 'none';
}

function normalizeErrorDetail(detail) {
  if (!detail) {
    return { message: 'Unknown error', rejectionSummary: null };
  }
  if (typeof detail === 'string') {
    return { message: detail, rejectionSummary: null };
  }
  if (typeof detail === 'object') {
    return {
      message: detail.message || detail.detail || detail.error || JSON.stringify(detail),
      rejectionSummary: detail.rejection_summary || detail.rejectionSummary || null
    };
  }
  return { message: String(detail), rejectionSummary: null };
}

async function runBtrRequest(reqBody, { fromRecovery = false } = {}) {
  lastRequestBody = reqBody;
  hideError();
  if (!fromRecovery) {
    resetResults();
    resetRecoveryFlow(true);
  }
  setLoading(true, fromRecovery ? 'Retrying BPHS scan with added detail…' : 'Calculating BTR using BPHS methods…');

  try {
    const resp = await fetch('/api/btr', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reqBody)
    });

    setLoading(false);

    if (!resp.ok) {
      let errorDetail = 'Unknown error';
      try {
        const error = await resp.json();
        errorDetail = error.detail || error.message || errorDetail;
      } catch (_e) {
        errorDetail = await resp.text();
      }
      const normalized = normalizeErrorDetail(errorDetail);
      lastRejectionSummary = normalized.rejectionSummary;
      handleErrorResponse(resp.status, normalized.message, reqBody, normalized.rejectionSummary);
      return;
    }

    const data = await resp.json();
    displayResults(data);
    resetRecoveryFlow(true);
  } catch (err) {
    setLoading(false);
    lastRejectionSummary = null;
    showError('Request failed: ' + err.message);
  }
}

function handleErrorResponse(status, detail, reqBody, rejectionSummary = null) {
  showError('Error: ' + detail);
  const isNoCandidate = typeof detail === 'string' && detail.toLowerCase().includes('no valid birth time candidates');
  if (status === 404 && isNoCandidate) {
    startRecoveryFlow(reqBody, detail, rejectionSummary || lastRejectionSummary);
  }
}

function deriveWindowFromRequest(reqBody) {
  if (reqBody && reqBody.time_range_override && reqBody.time_range_override.start && reqBody.time_range_override.end) {
    return { start: reqBody.time_range_override.start, end: reqBody.time_range_override.end };
  }
  const approx = reqBody ? reqBody.approx_tob : null;
  if (approx && approx.mode === 'approx' && approx.center) {
    const [h, m] = approx.center.split(':').map(Number);
    const centerMinutes = h * 60 + m;
    const windowMinutes = Math.round((approx.window_hours || 3) * 60);
    const startMinutes = ((centerMinutes - windowMinutes) % 1440 + 1440) % 1440;
    const endMinutes = (centerMinutes + windowMinutes) % 1440;
    return { start: minutesToTime(startMinutes), end: minutesToTime(endMinutes) };
  }
  return { start: '00:00', end: '23:59' };
}

function minutesToTime(totalMinutes) {
  const minutes = totalMinutes % 60;
  const hours = Math.floor(totalMinutes / 60) % 24;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

function startRecoveryFlow(reqBody, detail, rejectionSummary = null) {
  const panel = document.getElementById('recovery-panel');
  if (!panel) return;
  recoveryAttempt = recoveryAttempt ? recoveryAttempt + 1 : 1;
  const statusEl = document.getElementById('recovery-status');
  if (statusEl) {
    const topReason = rejectionSummary && rejectionSummary.reason_counts
      ? Object.entries(rejectionSummary.reason_counts).sort((a, b) => b[1] - a[1])[0]?.[0]
      : null;
    statusEl.textContent = topReason
      ? `Attempt ${recoveryAttempt}: ${detail} · Top rejection: ${topReason}`
      : `Attempt ${recoveryAttempt}: ${detail}`;
  }

  prefillRecoveryInputs(reqBody);
  if (!panel.querySelector('.recovery-event-row')) {
    addRecoveryEventRow();
    addRecoveryEventRow();
  }

  panel.style.display = 'block';
  panel.scrollIntoView({ behavior: 'smooth' });
}

function prefillRecoveryInputs(reqBody) {
  const summaryDob = document.getElementById('recovery-dob');
  const summaryLocation = document.getElementById('recovery-location');
  const summaryTz = document.getElementById('recovery-tz');
  const summaryWindow = document.getElementById('recovery-window-used');
  if (summaryDob) summaryDob.textContent = reqBody?.dob || '—';
  if (summaryLocation) summaryLocation.textContent = reqBody?.pob_text || '—';
  if (summaryTz) summaryTz.textContent = (reqBody?.tz_offset_hours ?? '—') + 'h';
  const window = deriveWindowFromRequest(reqBody || {});
  if (summaryWindow) summaryWindow.textContent = `${window.start} – ${window.end}`;

  const startInput = document.getElementById('recovery-start');
  const endInput = document.getElementById('recovery-end');
  if (startInput) startInput.value = window.start;
  if (endInput) endInput.value = window.end;
}

function resetRecoveryFlow(hidePanel = true) {
  const panel = document.getElementById('recovery-panel');
  const status = document.getElementById('recovery-status');
  const eventsList = document.getElementById('recovery-events-list');
  if (status) status.textContent = 'Awaiting input';
  if (eventsList) eventsList.innerHTML = '';
  recoveryAttempt = 0;
  if (hidePanel && panel) {
    panel.style.display = 'none';
  }
}

function addRecoveryEventRow(title = '', date = '') {
  const list = document.getElementById('recovery-events-list');
  if (!list) return;
  const row = document.createElement('div');
  row.className = 'recovery-event-row';
  row.innerHTML = `
    <input type="text" class="recovery-event-title" placeholder="Event (marriage, child, move...)" value="${title}">
    <input type="date" class="recovery-event-date" value="${date}">
  `;
  list.appendChild(row);
}

function collectRecoveryEvents() {
  const rows = Array.from(document.querySelectorAll('.recovery-event-row'));
  return rows
    .map(row => {
      const title = row.querySelector('.recovery-event-title')?.value.trim();
      const date = row.querySelector('.recovery-event-date')?.value;
      if (title && date) {
        return { title, date };
      }
      return null;
    })
    .filter(Boolean);
}

function collectRecoveryWindow() {
  const startInput = document.getElementById('recovery-start');
  const endInput = document.getElementById('recovery-end');
  return {
    start: startInput?.value || null,
    end: endInput?.value || null
  };
}

function buildRecoveryRequest() {
  if (!lastRequestBody) return null;
  const base = JSON.parse(JSON.stringify(lastRequestBody));

  const window = collectRecoveryWindow();
  if (window.start && window.end) {
    base.time_range_override = { start: window.start, end: window.end };
  }

  const recoveryEvents = collectRecoveryEvents();
  const optionalEvents = { ...(base.optional_events || {}) };
  if (recoveryEvents.length > 0) {
    optionalEvents.major = recoveryEvents;
  }

  const optionalTraits = { ...(base.optional_traits || {}) };
  const height = document.getElementById('recovery-height')?.value;
  const build = document.getElementById('recovery-build')?.value;
  const complexion = document.getElementById('recovery-complexion')?.value;
  const notes = document.getElementById('recovery-notes')?.value.trim();
  if (height) optionalTraits.height = height;
  if (build) optionalTraits.build = build;
  if (complexion) optionalTraits.complexion = complexion;
  if (notes) optionalTraits.notes = notes;

  base.optional_events = Object.keys(optionalEvents).length > 0 ? optionalEvents : null;
  base.optional_traits = Object.keys(optionalTraits).length > 0 ? optionalTraits : null;

  return base;
}

function attachRecoveryHandlers() {
  const daypart = document.getElementById('recovery-daypart');
  if (daypart) {
    daypart.addEventListener('click', (event) => {
      if (event.target.tagName === 'BUTTON') {
        const buttons = daypart.querySelectorAll('button');
        buttons.forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
        const start = event.target.getAttribute('data-start');
        const end = event.target.getAttribute('data-end');
        const startInput = document.getElementById('recovery-start');
        const endInput = document.getElementById('recovery-end');
        if (startInput) startInput.value = start;
        if (endInput) endInput.value = end;
      }
    });
  }

  const addEventButton = document.getElementById('add-recovery-event');
  if (addEventButton) {
    addEventButton.addEventListener('click', () => addRecoveryEventRow());
  }

  const retryButton = document.getElementById('retry-btr-btn');
  if (retryButton) {
    retryButton.addEventListener('click', async () => {
      const status = document.getElementById('recovery-status');
      const enrichedRequest = buildRecoveryRequest();
      if (!enrichedRequest) {
        showError('Please submit the main form once before retrying.');
        return;
      }
      if (status) {
        status.textContent = `Attempt ${recoveryAttempt + 1}: retrying with your added detail…`;
      }
      await runBtrRequest(enrichedRequest, { fromRecovery: true });
    });
  }
}

document.getElementById('btr-form').addEventListener('submit', async function (event) {
  event.preventDefault();
  const reqBody = buildRequestBodyFromForm();
  await runBtrRequest(reqBody);
});

function displayResults(data) {
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

  const bestCandidate = document.getElementById('best-candidate');
  if (data.best_candidate) {
    bestCandidate.innerHTML = formatCandidate(data.best_candidate, true);
  } else {
    bestCandidate.innerHTML = '<p>No candidate found.</p>';
  }

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

  document.getElementById('result-container').style.display = 'block';
  window.btrResults = data;
  document.getElementById('result-container').scrollIntoView({ behavior: 'smooth' });
}

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

  attachRecoveryHandlers();
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
