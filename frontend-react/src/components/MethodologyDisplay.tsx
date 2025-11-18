import './MethodologyDisplay.css';

export function MethodologyDisplay() {
  return (
    <div className="methodology-display">
      <h2>How Your Birth Time Is Verified (BPHS Adhyāya 4)</h2>
      <div className="methodology-content">
        <div className="methodology-section">
          <h3>Source</h3>
          <p>
            <strong>Brihat Parashara Hora Shastra (बृहत्पाराशरहोराशास्त्र)</strong> — Chapter 4: लग्नाध्याय (Lagna Adhyaya)
          </p>
          <p className="note">
            Every checkpoint comes straight from this chapter. Verse cues let you open <em>docs/पराशरहोराशास्त्र Brihat Parashar Hora Shastra _djvu.txt</em> and read the Sanskrit yourself.
          </p>
        </div>

        <div className="methodology-section">
          <h3>What happens (plain language with verses)</h3>
          <div className="verse-list">
            <div className="verse-item">
              <h4>1) Mark Gulika (Adhyāya 4, Verses 1-3)</h4>
              <p className="sanskrit">दिवसानष्टधा कृत्वा वारेशाद्मणयेत््रमात्...</p>
              <p>
                Parāśara says: split the day/night into 8 parts; Saturn’s part is Gulika. We place that exact point to use as a purifier.
              </p>
            </div>

            <div className="verse-item">
              <h4>2) Build Prāṇapada two ways (Verses 5 &amp; 7)</h4>
              <p className="sanskrit">घटी चतुर्गुणा कार्यां तिथ्याप्तैश्च पलैर्युताः...</p>
              <p>
                Verse 5 (madhya) uses ghāṭīs/palās; Verse 7 (sphuṭa) uses full palās tied to the Sun’s sign nature. Your lagna must satisfy both.
              </p>
            </div>

            <div className="verse-item">
              <h4>3) Human-only band (Verse 10)</h4>
              <p className="sanskrit">प्राणपदं को राशि से त्रिकोण राशि मे...</p>
              <p>
                Only 1st/5th/9th from Prāṇapada counts for humans. Others are animal/bird/other per the verse, so we drop them.
              </p>
            </div>

            <div className="verse-item">
              <h4>4) Degree equality (Verse 6)</h4>
              <p className="sanskrit">लग्नांशप्राणांशपदैक्यता स्यात्</p>
              <p>
                Lagna and Prāṇapada must be equal at palā precision. We surface the exact gap in degrees for transparency.
              </p>
            </div>

            <div className="verse-item">
              <h4>5) Purification fallback (Verse 8)</h4>
              <p className="sanskrit">विना प्राणपदाच्छुद्धो गुलिकाद्वा निशाकराद्</p>
              <p>
                Order matters: first Prāṇapada; if not, Moon; if still not, Gulika/its 7th. We follow that sequence and show which anchor passed.
              </p>
            </div>

            <div className="verse-item">
              <h4>6) Supporting lagnas (Verses 18-28)</h4>
              <ul>
                <li><strong>Bhava:</strong> every 5 ghāṭīs = 1 sign (V.18)</li>
                <li><strong>Hora:</strong> every 2.5 ghāṭīs = 1 sign (V.20-21)</li>
                <li><strong>Ghati:</strong> 1 ghāṭī = 1 sign, 1 palā = 2° (V.22-24)</li>
                <li><strong>Varnada:</strong> built from Janma + Hora lagnas (V.26-28)</li>
              </ul>
            </div>

            <div className="verse-item">
              <h4>7) Conception link (Verses 12-16)</h4>
              <p className="sanskrit">यस्मिन् भावे स्थितो कोणस्तस्य मान्देर्यदन्तरम्...</p>
              <p>
                Shows the conception lagna and gestation window (about 9 lunar months) per the same verses.
              </p>
            </div>
          </div>
        </div>

        <div className="methodology-section">
          <h3>Checkpoints you will see</h3>
          <ol className="pipeline-steps">
            <li><strong>Checkpoint 1:</strong> Convert your clock time to ghāṭī/palā from local sunrise (V.1-3)</li>
            <li><strong>Checkpoint 2:</strong> Place Gulika from weekday + day/night split (V.1-3)</li>
            <li><strong>Checkpoint 3:</strong> Build Prāṇapada (madhya &amp; sphuṭa) (V.5 &amp; 7)</li>
            <li><strong>Checkpoint 4:</strong> Apply BPHS gates:
              <ul>
                <li>Human-only trine (V.10)</li>
                <li>Degree equality (V.6)</li>
                <li>Purify via Prāṇapada → Moon → Gulika (V.8)</li>
              </ul>
            </li>
            <li><strong>Checkpoint 5:</strong> Show Bhava/Hora/Ghati/Varnada lagnas (V.18-28)</li>
            <li><strong>Checkpoint 6:</strong> Show Nisheka (conception) lagna (V.12-16)</li>
            <li><strong>Checkpoint 7:</strong> Optional trait/event notes (do not change BPHS pass/fail)</li>
            <li><strong>Checkpoint 8:</strong> Rank by BPHS-first score; heuristics only displayed</li>
          </ol>
        </div>

        <div className="methodology-section">
          <h3>Important Notes</h3>
          <ul className="notes-list">
            <li>Sidereal zodiac with Lahiri ayanamsa</li>
            <li>Swiss Ephemeris plugs your data into the verse formulas</li>
            <li>Only BPHS Chapter 4 verses are applied — no added rules/commentaries</li>
            <li>Trine rule (V.10) and degree equality (V.6) are mandatory for human birth</li>
            <li>Verse references point back to the Sanskrit file so you can verify</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
