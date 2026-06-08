
import { useState } from 'react'

export function ChartGuide() {
  const [open, setOpen] = useState(false)

  return (
    <div style={{ marginBottom: '1rem' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          background:   'transparent',
          border:       '0.5px solid #2a2a2a',
          borderRadius: '8px',
          color:        '#555',
          fontSize:     '12px',
          padding:      '6px 12px',
          cursor:       'pointer',
          fontFamily:   'inherit',
          display:      'flex',
          alignItems:   'center',
          gap:          '6px'
        }}
      >
        <span>{open ? '▾' : '▸'}</span>
        How to read this dashboard
      </button>

      {open && (
        <div style={{
          marginTop:    '8px',
          background:   '#111',
          border:       '0.5px solid #222',
          borderRadius: '12px',
          padding:      '1rem 1.25rem',
          display:      'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap:          '1rem'
        }}>
          {[
            {
              title: 'Navigating the chart',
              items: [
                'Scroll to zoom in and out',
                'Click and drag to pan left or right',
                'Hover over a candle to see OHLC values',
                'Double click to reset the view',
              ]
            },
            {
              title: 'Candlesticks',
              items: [
                'Green candle = price closed higher than it opened',
                'Red candle = price closed lower than it opened',
                'The thin lines (wicks) show the high and low of the day',
                'The body shows the open and close prices',
              ]
            },
            {
              title: 'Moving averages',
              items: [
                'SMA 20 (green) = average of last 20 days',
                'SMA 50 (purple) = average of last 50 days',
                'When SMA 20 crosses above SMA 50 = golden cross (buy)',
                'When SMA 20 crosses below SMA 50 = death cross (sell)',
              ]
            },
            {
              title: 'Bollinger bands',
              items: [
                'Dashed orange lines above and below price',
                'Price near upper band = potentially overbought',
                'Price near lower band = potentially oversold',
                'Bands squeezing together = big move coming',
              ]
            },
            {
              title: 'RSI panel',
              items: [
                'Measures momentum on a scale of 0 to 100',
                'Above 70 = overbought, likely to fall',
                'Below 30 = oversold, likely to rise',
                'Around 50 = neutral, no strong signal',
              ]
            },
            {
              title: 'MACD panel',
              items: [
                'Blue line = MACD line (fast EMA minus slow EMA)',
                'Orange line = signal line (EMA of MACD)',
                'Green bars = positive momentum building',
                'Red bars = negative momentum building',
              ]
            },
          ].map((section, i) => (
            <div key={i}>
              <div style={{
                fontSize:      '11px',
                fontWeight:    '500',
                color:         '#1D9E75',
                marginBottom:  '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.04em'
              }}>
                {section.title}
              </div>
              {section.items.map((item, j) => (
                <div key={j} style={{
                  display:       'flex',
                  gap:           '8px',
                  marginBottom:  '5px',
                  alignItems:    'flex-start'
                }}>
                  <span style={{ color: '#333', flexShrink: 0 }}>·</span>
                  <span style={{ fontSize: '12px', color: '#555', lineHeight: '1.5' }}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}