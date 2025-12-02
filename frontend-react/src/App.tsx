import { useState } from 'react';
import type { BTRRequest, BTRResponse, RejectionSummary, SuggestedQuestion } from './types';
import { MultiStepForm } from './components/MultiStepForm';
import { ResultsDisplay } from './components/ResultsDisplay';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorDisplay } from './components/ErrorDisplay';
import { RecoveryPanel } from './components/RecoveryPanel';
import { calculateBTR } from './services/api';
import { logClientEvent } from './utils/clientLogger';
import './App.css';

type BtrApiError = Error & {
  code?: string;
  rejectionSummary?: RejectionSummary | null;
  searchWindow?: { start?: string; end?: string };
  suggestedQuestions?: SuggestedQuestion[] | null;
  status?: number;
};

function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<BTRResponse | null>(null);
  const [lastRequest, setLastRequest] = useState<BTRRequest | null>(null);
  const [recoveryDetail, setRecoveryDetail] = useState<string | null>(null);
  const [recoveryAttempts, setRecoveryAttempts] = useState(0);
  const [rejectionSummary, setRejectionSummary] = useState<RejectionSummary | null>(null);
  const [suggestedQuestions, setSuggestedQuestions] = useState<SuggestedQuestion[] | null>(null);

  const runBtr = async (request: BTRRequest, { fromRecovery = false } = {}) => {
    setLoading(true);
    setError(null);
    setResults(null);
    setLastRequest(request);
    if (!fromRecovery) {
      setRecoveryDetail(null);
      setRecoveryAttempts(0);
      setRejectionSummary(null);
      setSuggestedQuestions(null);
    }
    logClientEvent('info', 'User submitted BTR form', {
      dob: request.dob,
      pob_text: request.pob_text,
      approx_mode: request.approx_tob.mode,
      has_traits: Boolean(request.optional_traits),
      has_events: Boolean(request.optional_events),
    });

    try {
      const response = await calculateBTR(request);
      logClientEvent('info', 'BTR response received', {
        candidates: response.candidates?.length ?? 0,
        best: response.best_candidate?.time_local,
      });
      setResults(response);
      setRecoveryDetail(null);
      setRecoveryAttempts(0);
      setRejectionSummary(null);
      setSuggestedQuestions(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred';
      const apiErr = err as BtrApiError;
      logClientEvent('error', 'BTR submission failed', { message, code: apiErr.code, status: apiErr.status });
      setError(message);
      const isNoCandidate =
        message.toLowerCase().includes('no valid birth time candidates') ||
        apiErr.code === 'NO_CANDIDATES';
      if (isNoCandidate) {
        setRecoveryDetail(message);
        setRejectionSummary(apiErr.rejectionSummary || null);
        setSuggestedQuestions(apiErr.suggestedQuestions || null);
        setRecoveryAttempts((prev) => prev + 1 || 1);
      } else {
        setRecoveryDetail(null);
        setRecoveryAttempts(0);
        setRejectionSummary(null);
        setSuggestedQuestions(null);
      }
    } finally {
      setLoading(false);
      logClientEvent('info', 'BTR request completed');
    }
  };

  const handleSubmit = async (request: BTRRequest) => {
    await runBtr(request);
  };

  const handleRecoveryRetry = async (payload: {
    windowOverride: BTRRequest['time_range_override'] | null;
    traits: Partial<BTRRequest['optional_traits']>;
    events: Partial<BTRRequest['optional_events']>;
  }) => {
    if (!lastRequest) return;
    const mergedTraits = {
      ...(lastRequest.optional_traits || {}),
      ...(payload.traits || {}),
    };
    const mergedEvents = {
      ...(lastRequest.optional_events || {}),
      ...(payload.events || {}),
    };
    const updatedRequest: BTRRequest = {
      ...lastRequest,
      time_range_override: payload.windowOverride || lastRequest.time_range_override || undefined,
      optional_traits: Object.keys(mergedTraits).length ? mergedTraits : null,
      optional_events: Object.keys(mergedEvents).length ? mergedEvents : null,
    };
    await runBtr(updatedRequest, { fromRecovery: true });
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Birth Time Rectification (BPHS Prototype)</h1>
        <p className="subtitle">Based on Brihat Parashara Hora Shastra - Chapter 4 (लग्नाध्याय)</p>
      </header>
      
      {!results && !loading && <MultiStepForm onSubmit={handleSubmit} />}
      
      {loading && <LoadingSpinner />}
      {error && (
        <>
          <ErrorDisplay message={`Error: ${error}`} />
          {recoveryDetail && lastRequest && (
            <RecoveryPanel
              request={lastRequest}
              attempts={recoveryAttempts}
              detail={recoveryDetail}
              rejectionSummary={rejectionSummary}
              suggestedQuestions={suggestedQuestions}
              onRetry={handleRecoveryRetry}
            />
          )}
          {!recoveryDetail && (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button 
                onClick={() => {
                  setError(null);
                  setResults(null);
                }}
                className="btn-primary"
              >
                Try Again
              </button>
            </div>
          )}
        </>
      )}
      {results && (
        <ResultsDisplay 
          data={results} 
          onNewCalculation={() => {
            setResults(null);
            setError(null);
          }}
        />
      )}
    </div>
  );
}

export default App;
