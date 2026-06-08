
export function SummaryCards({ summary }) {
  if (!summary) return null

  const signalColor = {
    buy:  '#22c55e',
    sell: '#ef4444',
    hold: '#f59e0b'
  }[summary.signal_current] || '#f59e0b'

  const cards = [
    {
      label: 'Latest close',
      value: `$${summary.latest_close.toFixed(2)}`,
      sub:   `${summary.data_from} → ${summary.data_to}`
    },
    {
      label: 'Total return',
      value: `${summary.total_return_pct > 0 ? '+' : ''}${summary.total_return_pct.toFixed(2)}%`,
      sub:   'over selected period',
      color: summary.total_return_pct >= 0 ? '#22c55e' : '#ef4444'
    },
    {
      label: 'Sharpe ratio',
      value: summary.sharpe_ratio.toFixed(2),
      sub:   summary.sharpe_ratio >= 1 ? 'good risk-adjusted return' : 'below average'
    },
    {
      label: 'Max drawdown',
      value: `${summary.max_drawdown_pct.toFixed(2)}%`,
      sub:   'worst peak to trough',
      color: '#ef4444'
    },
    {
      label: 'Annual vol',
      value: `${summary.annual_vol_pct.toFixed(2)}%`,
      sub:   'annualised volatility'
    },
    {
      label: 'RSI (14)',
      value: summary.rsi_current.toFixed(1),
      sub:   summary.rsi_current > 70
               ? 'overbought'
               : summary.rsi_current < 30
               ? 'oversold'
               : 'neutral zone'
    },
    {
      label: 'Signal',
      value: summary.signal_current.toUpperCase(),
      sub:   'current recommendation',
      color: signalColor
    }
  ]

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: '10px',
      marginBottom: '1.25rem'
    }}>
      {cards.map((card, i) => (
        <div key={i} style={{
          background: '#1a1a1a',
          borderRadius: '10px',
          padding: '12px 14px',
          border: '0.5px solid #2a2a2a'
        }}>
          <div style={{
            fontSize: '11px',
            color: '#666',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            marginBottom: '6px'
          }}>
            {card.label}
          </div>
          <div style={{
            fontSize: '18px',
            fontWeight: '500',
            color: card.color || '#e5e5e5'
          }}>
            {card.value}
          </div>
          <div style={{
            fontSize: '11px',
            color: '#555',
            marginTop: '3px'
          }}>
            {card.sub}
          </div>
        </div>
      ))}
    </div>
  )
}