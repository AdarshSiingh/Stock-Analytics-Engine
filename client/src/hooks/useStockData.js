
import { useState, useEffect } from 'react'

export function useStockData(ticker, range) {
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    if (!ticker) return

    setLoading(true)
    setError(null)
    setData(null)

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'
    fetch(`${API_URL}/api/analyse/${ticker}?range=${range}`)
      .then(res => {
        if (!res.ok) throw new Error(`Server error: ${res.status}`)
        return res.json()
      })
      .then(json => {
        if (json.error) throw new Error(json.error)
        setData(json)
      })
      .catch(err => {
        setError(err.message)
      })
      .finally(() => {
        setLoading(false)
      })

  }, [ticker, range])

  return { data, loading, error }
}