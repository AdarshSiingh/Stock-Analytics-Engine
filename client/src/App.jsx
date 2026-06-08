
import { useState } from 'react'
import { useStockData } from './hooks/useStockData'
import { SummaryCards } from './components/SummaryCards'
import { CandlestickChart } from './components/CandlestickChart'
import { IndicatorPanel } from './components/IndicatorPanel'
import { ChartGuide } from './components/ChartGuide'


const RANGES = ['1mo', '3mo', '6mo', '1y']

export default function App() {
  const [input,  setInput]  = useState('AAPL')
  const [ticker, setTicker] = useState('AAPL')
  const [range,  setRange]  = useState('6mo')

  const { data, loading, error } = useStockData(ticker, range)

  function handleSearch() {
    if (input.trim()) setTicker(input.trim().toUpperCase())
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1.5rem' }}>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ fontSize: '15px', fontWeight: '500', color: '#e5e5e5', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#1D9E75' }}></div>
          Stock analytics engine
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value.toUpperCase())}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="Ticker e.g. TSLA"
            style={{
              padding: '7px 12px',
              background: '#1a1a1a',
              border: '0.5px solid #333',
              borderRadius: '8px',
              color: '#e5e5e5',
              fontSize: '13px',
              width: '150px',
              outline: 'none',
              fontFamily: 'inherit'
            }}
          />
          <button
            onClick={handleSearch}
            style={{
              padding: '7px 14px',
              background: '#1D9E75',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '13px',
              cursor: 'pointer',
              fontFamily: 'inherit'
            }}
          >
            Analyse
          </button>

          <div style={{ display: 'flex', gap: '5px' }}>
            {RANGES.map(r => (
              <button
                key={r}
                onClick={() => setRange(r)}
                style={{
                  padding: '5px 10px',
                  background: range === r ? '#2a2a2a' : 'transparent',
                  border: '0.5px solid',
                  borderColor: range === r ? '#444' : '#2a2a2a',
                  borderRadius: '6px',
                  color: range === r ? '#e5e5e5' : '#666',
                  fontSize: '12px',
                  cursor: 'pointer',
                  fontFamily: 'inherit'
                }}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {data && (
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '20px', fontWeight: '500' }}>{ticker}</span>
          <span style={{ fontSize: '20px', fontWeight: '500' }}>${data.summary.latest_close.toFixed(2)}</span>
          <span style={{
            fontSize: '13px',
            padding: '3px 8px',
            borderRadius: '6px',
            background: data.summary.total_return_pct >= 0 ? '#14532d' : '#450a0a',
            color: data.summary.total_return_pct >= 0 ? '#22c55e' : '#ef4444'
          }}>
            {data.summary.total_return_pct > 0 ? '+' : ''}{data.summary.total_return_pct.toFixed(2)}%
          </span>
        </div>
      )}

       {loading && (
       <div style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '2rem 0'
        }}>
       <div style={{
        width: '16px', height: '16px', borderRadius: '50%',
       border: '2px solid #333', borderTopColor: '#1D9E75',
       animation: 'spin 0.8s linear infinite'
       }}/>
        <span style={{ color: '#666', fontSize: '14px' }}>
        Analysing {ticker}...
        </span>
       </div>
      )}
      {error && (
        <div style={{ color: '#ef4444', fontSize: '14px', padding: '1rem 0' }}>
          Error: {error}
        </div>
      )}

      {data && !loading && (
        <>
          <SummaryCards summary={data.summary} />
          <ChartGuide />
          <CandlestickChart candles={data.candles} />
          <IndicatorPanel candles={data.candles} />
        </>
      )}

    </div>
  )
}