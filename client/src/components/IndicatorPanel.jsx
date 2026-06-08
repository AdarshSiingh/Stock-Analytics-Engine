
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ReferenceLine, ResponsiveContainer, Bar,
  ComposedChart, Cell
} from 'recharts'

function DarkTooltip({ active, payload, label, valueKey, decimals = 2 }) {
  if (!active || !payload?.length) return null
  const value = payload.find(p => p.dataKey === valueKey)?.value
  if (value == null) return null
  return (
    <div style={{
      background: '#1a1a1a', border: '0.5px solid #333',
      borderRadius: '8px', padding: '8px 12px', fontSize: '12px'
    }}>
      <p style={{ color: '#666', marginBottom: '3px' }}>{label}</p>
      <p style={{ color: '#e5e5e5', fontWeight: '500' }}>{Number(value).toFixed(decimals)}</p>
    </div>
  )
}

function RSIPanel({ candles }) {
  const data = candles.filter(c => c.rsi_14 !== null)

  return (
    <div style={{
      background: '#111111', borderRadius: '12px',
      border: '0.5px solid #222', padding: '1rem 1.25rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <span style={{ fontSize: '13px', fontWeight: '500', color: '#e5e5e5' }}>RSI (14)</span>
        <div style={{ display: 'flex', gap: '12px' }}>
          <span style={{ fontSize: '11px', color: '#ef4444' }}>— Overbought 70</span>
          <span style={{ fontSize: '11px', color: '#22c55e' }}>— Oversold 30</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={120}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: '#444' }}
            tickFormatter={d => d.slice(5)}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 10, fill: '#444' }}
            ticks={[0, 30, 70, 100]}
          />
          <Tooltip content={<DarkTooltip valueKey="rsi_14" decimals={1}/>}/>
          <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="3 3" strokeWidth={1}/>
          <ReferenceLine y={30} stroke="#22c55e" strokeDasharray="3 3" strokeWidth={1}/>
          <ReferenceLine y={50} stroke="#333" strokeWidth={1}/>
          <Line
            type="monotone"
            dataKey="rsi_14"
            stroke="#534AB7"
            strokeWidth={1.5}
            dot={false}
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

function MACDPanel({ candles }) {
  const data = candles.filter(c => c.macd !== null)

  return (
    <div style={{
      background: '#111111', borderRadius: '12px',
      border: '0.5px solid #222', padding: '1rem 1.25rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <span style={{ fontSize: '13px', fontWeight: '500', color: '#e5e5e5' }}>MACD</span>
        <div style={{ display: 'flex', gap: '12px' }}>
          <span style={{ fontSize: '11px', color: '#534AB7' }}>— MACD</span>
          <span style={{ fontSize: '11px', color: '#D85A30' }}>— Signal</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={120}>
        <ComposedChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: '#444' }}
            tickFormatter={d => d.slice(5)}
            interval="preserveStartEnd"
          />
          <YAxis tick={{ fontSize: 10, fill: '#444' }}/>
          <Tooltip
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null
              return (
                <div style={{
                  background: '#1a1a1a', border: '0.5px solid #333',
                  borderRadius: '8px', padding: '8px 12px', fontSize: '12px'
                }}>
                  <p style={{ color: '#666', marginBottom: '4px' }}>{label}</p>
                  {payload.map((p, i) => (
                    <p key={i} style={{ color: p.color, marginBottom: '2px' }}>
                      {p.name}: {Number(p.value).toFixed(3)}
                    </p>
                  ))}
                </div>
              )
            }}
          />
          <ReferenceLine y={0} stroke="#333" strokeWidth={1}/>
          <Bar dataKey="macd_hist" name="Histogram" maxBarSize={4}>
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={entry.macd_hist >= 0 ? '#22c55e' : '#ef4444'}
                opacity={0.6}
              />
            ))}
          </Bar>
          <Line
            type="monotone"
            dataKey="macd"
            name="MACD"
            stroke="#534AB7"
            strokeWidth={1.5}
            dot={false}
            connectNulls={false}
          />
          <Line
            type="monotone"
            dataKey="macd_signal"
            name="Signal"
            stroke="#D85A30"
            strokeWidth={1.5}
            dot={false}
            connectNulls={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

export function IndicatorPanel({ candles }) {
  if (!candles) return null

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '1rem' }}>
      <RSIPanel candles={candles}/>
      <MACDPanel candles={candles}/>
    </div>
  )
}