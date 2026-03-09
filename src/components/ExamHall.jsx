import React, { useState } from 'react';

const ExamHall = ({ mockPaper, setMockPaper, isEngineReady }) => {
  const [subjectType, setSubjectType] = useState(null); // 'major' or 'minor'
const generatePaper = () => {
    const units = [
      { title: "Unit 1: Banking", topics: ["RBI Functions", "Monetary Policy", "Commercial Banks"] },
      { title: "Unit 2: Digital Banking", topics: ["NEFT/RTGS/IMPS", "Cards", "Cheques"] },
      { title: "Unit 3: Taxation (PGBP)", topics: ["Sec 28-37", "Taxable Profit", "Depreciation"] },
      { title: "Unit 4: GST", topics: ["GST Council", "ITC Rules", "Supply Types"] }
    ];

    const newPaper = units.map((unit, index) => ({
      id: index + 1,
      unitTitle: unit.title,
      mainQ: `Explain ${unit.topics[0]} in detail from ${unit.title}.`,
      orOptionA: `Discuss ${unit.topics[1]}.`,
      orOptionB: `Write a note on ${unit.topics[2]}.`,
      marksMain: 10,
      marksSub: 5
    }));

    setMockPaper(newPaper);
  };
  // If no subject type is selected, show the selection menu first
  if (!subjectType) {
    return (
      <div className="exam-hall-container">
        <div className="selection-screen">
          <h2>Select Subject Type 🏛️</h2>
          <div className="type-buttons">
            <button onClick={() => setSubjectType('major')}>Major Subject (50 Marks)</button>
            <button onClick={() => setSubjectType('minor')}>Minor Subject (25 Marks)</button>
          </div>
          <p style={{color: '#888', marginTop: '20px'}}>
            This will set the GU paper pattern (Q1-Q5 for Major, Q1-Q3 for Minor).
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="exam-hall-container">
      <div className="exam-header-controls">
        <button 
  className="print-paper-btn"
  onClick={() => window.print()}
  disabled={!mockPaper}
>
  Print / Save as PDF 🖨️
</button>
        <button onClick={() => setSubjectType(null)} className="back-btn">← Change Type</button>
        <button 
          className="generate-paper-btn" 
          disabled={!isEngineReady} 
          onClick={generatePaper}
        >
          Generate {subjectType === 'major' ? '50 Mark' : '25 Mark'} Paper
        </button>
      </div>

      <div className="physical-paper">
        <div className="paper-header">
          <h1 className="uni-name">GUJARAT UNIVERSITY</h1>
          <h3 className="exam-name">B.Com. Semester-IV ({subjectType === 'major' ? 'Major' : 'Minor'})</h3>
          <div className="paper-meta">
            <span>Time: {subjectType === 'major' ? '2.5 Hours' : '1.5 Hours'}</span>
            <span>Total Marks: {subjectType === 'major' ? '50' : '25'}</span>
          </div>
          <hr className="header-line" />
        </div>
        
        {/* Step 3: Mapping the generated questions to the UI */}
        <div className="paper-body">
          {mockPaper ? (
            <>
              {/* Maps Q1-Q4 for Major, Q1-Q2 for Minor subjects */}
              {mockPaper.slice(0, subjectType === 'major' ? 4 : 2).map((q) => (
                <div key={q.id} className="gu-question-block">
                  <div className="main-q">
                    <span className="q-number">Q.{q.id}</span>
                    <div className="q-content">
                      <p>{q.mainQ}</p>
                      <span className="marks">({q.marksMain})</span>
                    </div>
                  </div>
                  <div className="or-divider">OR</div>
                  <div className="internal-option">
                    <div className="sub-q">
                      <p>(A) {q.orOptionA}</p>
                      <span className="marks">({q.marksSub})</span>
                    </div>
                    <div className="sub-q">
                      <p>(B) {q.orOptionB}</p>
                      <span className="marks">({q.marksSub})</span>
                    </div>
                  </div>
                  <hr className="q-separator" />
                </div>
              ))}

              {/* Final MCQ Section: Q5 (Major) or Q3 (Minor) */}
              <div className="gu-question-block mcq-section">
                <span className="q-number">Q.{subjectType === 'major' ? '5' : '3'}</span>
                <div className="q-content">
                  <p>Select the correct option ({subjectType === 'major' ? 'Any 10 of 12' : 'Any 5 of 8'}):</p>
                  <span className="marks">({subjectType === 'major' ? '10' : '05'})</span>
                  <div className="mcq-placeholders" style={{marginTop: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px'}}>
                    {[...Array(subjectType === 'major' ? 12 : 8)].map((_, i) => (
                      <div key={i} style={{borderBottom: '1px dotted #333', padding: '5px'}}>{i + 1}. ____________________</div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="empty-paper-msg">
              <p>Click "Generate" to create a paper for Banking, Taxation, or Statistics.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamHall;