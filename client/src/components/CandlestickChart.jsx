
import { useEffect, useRef } from 'react'
import { createChart, ColorType, CandlestickSeries, LineSeries } from 'lightweight-charts'

export function CandlestickChart({ candles }) {
  const chartContainerRef = useRef(null)
  const chartRef          = useRef(null)

  useEffect(() => {
    if (!candles || !chartContainerRef.current) return

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#111111' },
        textColor:  '#666666',
      },
      grid: {
        vertLines: { color: '#1a1a1a' },
        horzLines: { color: '#1a1a1a' },
      },
      crosshair: {
        vertLine: { color: '#333' },
        horzLine: { color: '#333' },
      },
      rightPriceScale: { borderColor: '#222' },
      timeScale:       { borderColor: '#222', timeVisible: true },
      width:  chartContainerRef.current.clientWidth,
      height: 380,
    })

    chartRef.current = chart

    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor:         '#22c55e',
      downColor:       '#ef4444',
      borderUpColor:   '#22c55e',
      borderDownColor: '#ef4444',
      wickUpColor:     '#22c55e',
      wickDownColor:   '#ef4444',
    })

    const sma20Series = chart.addSeries(LineSeries, {
      color:            '#1D9E75',
      lineWidth:        1.5,
      priceLineVisible: false,
    })

    const sma50Series = chart.addSeries(LineSeries, {
      color:            '#534AB7',
      lineWidth:        1.5,
      priceLineVisible: false,
    })

    const bbUpperSeries = chart.addSeries(LineSeries, {
      color:            '#D85A30',
      lineWidth:        1,
      lineStyle:        2,
      priceLineVisible: false,
    })

    const bbLowerSeries = chart.addSeries(LineSeries, {
      color:            '#D85A30',
      lineWidth:        1,
      lineStyle:        2,
      priceLineVisible: false,
    })

    const candleData = candles
      .filter(c => c.open && c.high && c.low && c.close)
      .map(c => ({
        time:  c.date.slice(0, 10),
        open:  c.open,
        high:  c.high,
        low:   c.low,
        close: c.close,
      }))

    const sma20Data = candles
      .filter(c => c.sma_20 !== null)
      .map(c => ({ time: c.date.slice(0, 10), value: c.sma_20 }))

    const sma50Data = candles
      .filter(c => c.sma_50 !== null)
      .map(c => ({ time: c.date.slice(0, 10), value: c.sma_50 }))

    const bbUpperData = candles
      .filter(c => c.bb_upper !== null)
      .map(c => ({ time: c.date.slice(0, 10), value: c.bb_upper }))

    const bbLowerData = candles
      .filter(c => c.bb_lower !== null)
      .map(c => ({ time: c.date.slice(0, 10), value: c.bb_lower }))

    candleSeries.setData(candleData)
    sma20Series.setData(sma20Data)
    sma50Series.setData(sma50Data)
    bbUpperSeries.setData(bbUpperData)
    bbLowerSeries.setData(bbLowerData)

    chart.timeScale().fitContent()

    const resizeObserver = new ResizeObserver(entries => {
      const { width } = entries[0].contentRect
      chart.applyOptions({ width })
    })
    resizeObserver.observe(chartContainerRef.current)

    return () => {
      resizeObserver.disconnect()
      chart.remove()
    }

  }, [candles])

  return (
    <div style={{
      background:   '#111111',
      borderRadius: '12px',
      border:       '0.5px solid #222',
      padding:      '1rem 1.25rem',
      marginBottom: '1rem'
    }}>
      <div style={{
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'space-between',
        marginBottom:   '14px'
      }}>
        <span style={{ fontSize: '13px', fontWeight: '500', color: '#e5e5e5' }}>
          Price · candlestick
        </span>
        <div style={{ display: 'flex', gap: '14px' }}>
          {[
            { color: '#1D9E75', label: 'SMA 20' },
            { color: '#534AB7', label: 'SMA 50' },
            { color: '#D85A30', label: 'BB bands', dashed: true },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{
                width:      '16px',
                height:     '2px',
                background: item.dashed ? 'transparent' : item.color,
                borderBottom: item.dashed ? `2px dashed ${item.color}` : 'none',
                borderRadius: '1px',
              }}/>
              <span style={{ fontSize: '11px', color: '#555' }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div ref={chartContainerRef}/>
    </div>
  )
}