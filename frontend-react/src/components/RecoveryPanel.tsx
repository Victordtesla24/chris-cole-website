import { useEffect, useMemo, useState } from 'react';
import type { BTRRequest, LifeEvents, PhysicalTraits, RejectionSummary, SuggestedQuestion, TimeRangeOverride } from '../types';
import './RecoveryPanel.css';

type MajorEventInput = { title: string; date: string; description?: string };

interface RecoveryPanelProps {
  request: BTRRequest;
  attempts: number;
  detail: string | null;
  rejectionSummary?: RejectionSummary | null;
  suggestedQuestions?: SuggestedQuestion[] | null;
  onRetry: (payload: {
    windowOverride: TimeRangeOverride | null;
    traits: Partial<PhysicalTraits>;
    events: Partial<LifeEvents>;
  }) => void;
}

function deriveWindow(request: BTRRequest, override?: { start?: string; end?: string }): { start: string; end: string } {
  if (override?.start && override?.end) {
    return { start: override.start, end: override.end };
  }
  if (request.time_range_override?.start && request.time_range_override?.end) {
    return {
      start: request.time_range_override.start,
      end: request.time_range_override.end,
    };
  }
  if (request.approx_tob?.mode === 'approx' && request.approx_tob.center) {
    const [h, m] = request.approx_tob.center.split(':').map(Number);
    const centerMinutes = h * 60 + m;
    const windowMinutes = Math.round((request.approx_tob.window_hours ?? 3) * 60);
    const startMinutes = ((centerMinutes - windowMinutes) % 1440 + 1440) % 1440;
    const endMinutes = (centerMinutes + windowMinutes) % 1440;
    return {
      start: minutesToTime(startMinutes),
      end: minutesToTime(endMinutes),
    };
  }
  return { start: '00:00', end: '23:59' };
}

function minutesToTime(totalMinutes: number): string {
  const minutes = totalMinutes % 60;
  const hours = Math.floor(totalMinutes / 60) % 24;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

export function RecoveryPanel({ request, attempts, detail, rejectionSummary, suggestedQuestions, onRetry }: RecoveryPanelProps) {
  const initialWindow = useMemo(
    () => deriveWindow(request, rejectionSummary?.window),
    [request, rejectionSummary?.window?.start, rejectionSummary?.window?.end]
  );
  const [start, setStart] = useState(initialWindow.start);
  const [end, setEnd] = useState(initialWindow.end);
  const [events, setEvents] = useState<MajorEventInput[]>([
    { title: '', date: '', description: '' },
    { title: '', date: '', description: '' },
  ]);
  const [heightBand, setHeightBand] = useState('');
  const [buildBand, setBuildBand] = useState('');
  const [complexion, setComplexion] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    setStart(initialWindow.start);
    setEnd(initialWindow.end);
    setEvents([
      { title: '', date: '', description: '' },
      { title: '', date: '', description: '' },
    ]);
    setHeightBand('');
    setBuildBand('');
    setComplexion('');
    setNotes('');
  }, [initialWindow.start, initialWindow.end, request.dob, request.pob_text]);

  const summaryWindow = `${start || '—'} – ${end || '—'}`;
  const reasonEntries = useMemo(
    () => Object.entries(rejectionSummary?.reason_counts || {}).sort((a, b) => b[1] - a[1]).slice(0, 3),
    [rejectionSummary?.reason_counts]
  );
  // Dynamic suggested questions from backend analysis
  const dynamicSuggestions = useMemo(() => {
    if (!suggestedQuestions || !suggestedQuestions.length) {
      return [];
    }
    return suggestedQuestions.sort((a, b) => a.priority - b.priority);
  }, [suggestedQuestions]);

  const suggestions = rejectionSummary?.suggestions && rejectionSummary.suggestions.length
    ? rejectionSummary.suggestions
    : [
        'Add at least 2 dated life events (marriage/child/career) to help ranking.',
        'Narrow the search window to a 4–6 hour span if you can.',
        'Double-check the birth location spelling; we now auto-use the geocoded time zone.'
      ];

  const addEventRow = () => {
    setEvents((rows) => [...rows, { title: '', date: '', description: '' }]);
  };

  const updateEvent = (idx: number, field: keyof MajorEventInput, value: string) => {
    setEvents((rows) => rows.map((row, i) => (i === idx ? { ...row, [field]: value } : row)));
  };

  const handleRetry = () => {
    const windowOverride =
      start && end ? ({ start, end } as TimeRangeOverride) : null;

    const major = events
      .map((e) => ({
        title: e.title.trim(),
        date: e.date,
        description: e.description?.trim() || undefined,
      }))
      .filter((e) => e.title && e.date);

    const traits: Partial<PhysicalTraits> = {};
    if (heightBand) traits.height_band = heightBand as PhysicalTraits['height_band'];
    if (buildBand) traits.build_band = buildBand as PhysicalTraits['build_band'];
    if (complexion) traits.complexion_tone = complexion as PhysicalTraits['complexion_tone'];
    if (notes.trim()) traits.notes = notes.trim();

    const eventsPayload: Partial<LifeEvents> = {};
    if (major.length) {
      eventsPayload.major = major;
    }

    onRetry({ windowOverride, traits, events: eventsPayload });
  };

  return (
    <div className="recovery-panel">
      <div className="recovery-header">
        <div>
          <h3>We need more detail to satisfy BPHS</h3>
          <p className="recovery-subtitle">
            No candidates passed the trine rule. Share more granular inputs and we will retry with strict BPHS filters intact.
          </p>
          {detail && <p className="recovery-detail">{detail}</p>}
          {reasonEntries.length > 0 && (
            <div className="recovery-detail">
              <strong>Top rejection reasons</strong>
              <ul>
                {reasonEntries.map(([label, count]) => (
                  <li key={label}>
                    {label} — {count}×
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="recovery-status" data-testid="recovery-status">
          Attempt {attempts || 1}: awaiting input
        </div>
      </div>

      <div className="recovery-summary">
        <div className="summary-chip">
          <span>DOB</span>
          <strong>{request.dob || '—'}</strong>
        </div>
        <div className="summary-chip">
          <span>Location</span>
          <strong>{request.pob_text || '—'}</strong>
        </div>
        <div className="summary-chip">
          <span>Time Zone</span>
          <strong>{request.tz_offset_hours}h</strong>
        </div>
        <div className="summary-chip">
          <span>Current Window</span>
          <strong>{summaryWindow}</strong>
        </div>
      </div>

      <div className="recovery-step">
        <div className="recovery-step-header">
          <h4>1) Lock in the most likely part of the day</h4>
          <span className="hint">Narrows the BPHS search window without relaxing rules</span>
        </div>
        <div className="pill-group">
          <button type="button" onClick={() => { setStart('04:00'); setEnd('10:00'); }}>Dawn · 04:00–10:00</button>
          <button type="button" onClick={() => { setStart('10:00'); setEnd('14:00'); }}>Midday · 10:00–14:00</button>
          <button type="button" onClick={() => { setStart('14:00'); setEnd('19:00'); }}>Evening · 14:00–19:00</button>
          <button type="button" onClick={() => { setStart('19:00'); setEnd('23:59'); }}>Late Night · 19:00–23:59</button>
        </div>
        <div className="compact-grid">
          <label htmlFor="recovery-start">Custom start</label>
          <input id="recovery-start" type="time" value={start} onChange={(e) => setStart(e.target.value)} />
          <label htmlFor="recovery-end">Custom end</label>
          <input id="recovery-end" type="time" value={end} onChange={(e) => setEnd(e.target.value)} />
        </div>
      </div>

      <div className="recovery-step">
        <div className="recovery-step-header">
          <h4>2) Add high-certainty life events (BPHS verification)</h4>
          <span className="hint">Include at least 2 key events if possible</span>
        </div>
        <div className="recovery-events">
          {events.map((event, idx) => (
            <div className="recovery-event-row" key={`${idx}-${event.title}-${event.date}`}>
              <input
                type="text"
                placeholder={`Event ${idx + 1} (marriage, child, move…)`}
                value={event.title}
                onChange={(e) => updateEvent(idx, 'title', e.target.value)}
                data-testid={`event-title-${idx}`}
              />
              <input
                type="date"
                value={event.date}
                onChange={(e) => updateEvent(idx, 'date', e.target.value)}
                data-testid={`event-date-${idx}`}
              />
            </div>
          ))}
        </div>
        <button type="button" className="secondary-btn" onClick={addEventRow}>
          + Add life event
        </button>
      </div>

      <div className="recovery-step">
        <div className="recovery-step-header">
          <h4>3) Share physical traits (more granular)</h4>
          <span className="hint">Used strictly for ranking — BPHS filters stay strict</span>
        </div>
        <div className="compact-grid">
          <label htmlFor="recovery-height">Height</label>
          <select id="recovery-height" value={heightBand} onChange={(e) => setHeightBand(e.target.value)}>
            <option value="">Choose</option>
            <option value="SHORT">Short</option>
            <option value="MEDIUM">Medium</option>
            <option value="TALL">Tall</option>
          </select>
          <label htmlFor="recovery-build">Build</label>
          <select id="recovery-build" value={buildBand} onChange={(e) => setBuildBand(e.target.value)}>
            <option value="">Choose</option>
            <option value="SLIM">Slim</option>
            <option value="ATHLETIC">Athletic</option>
            <option value="HEAVY">Heavy</option>
          </select>
          <label htmlFor="recovery-complexion">Complexion</label>
          <select id="recovery-complexion" value={complexion} onChange={(e) => setComplexion(e.target.value)}>
            <option value="">Choose</option>
            <option value="FAIR">Fair</option>
            <option value="WHEATISH">Wheatish</option>
            <option value="DARK">Dark</option>
          </select>
        </div>
        <label htmlFor="recovery-notes">Specific marks, frame, complexion tone</label>
        <textarea
          id="recovery-notes"
          rows={3}
          placeholder="Share precise descriptors for better scoring"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <div className="recovery-actions">
        <button type="button" className="btn-primary" onClick={handleRetry} data-testid="retry-btr-btn">
          Retry BPHS search with these details
        </button>
        <p className="recovery-helper">We will keep asking for specifics and re-running BPHS until candidates appear.</p>
        
        {/* Dynamic suggested questions from backend */}
        {dynamicSuggestions.length > 0 && (
          <div className="recovery-helper">
            <strong>Recommended improvements (based on your input)</strong>
            <ul>
              {dynamicSuggestions.map((question) => (
                <li key={question.field} className="dynamic-suggestion">
                  <div className="suggestion-message">{question.message}</div>
                  {question.hint && <div className="suggestion-hint">{question.hint}</div>}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="recovery-helper">
          <strong>General suggestions</strong>
          <ul>
            {suggestions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
