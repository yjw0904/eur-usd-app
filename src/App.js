import React, { useState, useEffect } from 'react'
import './app.css'

function Converter(props) {
  const [currency, setCurrency] = useState('USD')
  const [amount, setAmount] = useState('')
  const [convertedAmount, setConvertedAmount] = useState(0)
  const [overrideRate, setOverrideRate] = useState(0)

  const [conversions, setConversions] = useState([
    {
      realTimeRate: 1.0,
      overrideRAte: 1.01,
      enteredAmount: 100,
      convertedAmount: 101,
    },
  ])

  function handleCurrencyChange(event) {
    setCurrency(event.target.value)
    setAmount(convertedAmount)
  }

  function handleAmountChange(event) {
    setAmount(event.target.value)
  }

  function handleOverrideRateChange(event) {
    setOverrideRate(event.target.value)
  }

  function handleSubmit(e) {
    e.preventDefault()

    const convertedCurrency = currency === 'USD' ? 'EUR' : 'USD'

    if (conversions.length > 4) {
      let temp = conversions.shift()
      setConversions(temp)
    }

    setConversions([
      ...conversions,
      {
        realTimeRate: props.rate,
        overrideRate: overrideRate,
        enteredAmount: amount + '    ' + currency,
        convertedAmount: convertedAmount + '    ' + convertedCurrency,
      },
    ])
  }

  function conversion() {
    const rateToUse = overrideRate ? overrideRate : props.rate
    const rateDifference = Math.abs(rateToUse - props.rate) / props.rate
    const conversionRate = rateDifference <= 0.02 ? rateToUse : props.rate

    if (currency === 'USD') {
      setConvertedAmount((amount / conversionRate).toFixed(2))
    } else {
      setConvertedAmount((amount * conversionRate).toFixed(2))
    }
  }

  useEffect(() => {
    conversion()
  }, [currency, amount, convertedAmount, props.rate, overrideRate])

  return (
    <div>
      <h2>Currency Converter</h2>
      <label>
        <input
          type="radio"
          value="USD"
          checked={currency === 'USD'}
          onChange={handleCurrencyChange}
        />
        USD
      </label>
      <label>
        <input
          type="radio"
          value="EUR"
          checked={currency === 'EUR'}
          onChange={handleCurrencyChange}
        />
        EUR
      </label>
      <br />
      <form>
        <input type="number" value={amount} onChange={handleAmountChange} />
        <button onClick={handleSubmit}>Add to History</button>
      </form>
      <br />
      <br />
      <label>
        Override Exchange Rate:
        <input
          type="number"
          value={overrideRate}
          onChange={handleOverrideRateChange}
        />
      </label>
      {amount && <p>{convertedAmount}</p>}
      <table>
        <tbody>
          <tr>
            <th className="cell">Rate</th>
            <th className="cell">Override</th>
            <th className="cell">Entered Amount</th>
            <th className="cell">Converted Amount</th>
          </tr>
          {conversions.map((c, i) => (
            <tr key={i}>
              <th>{c.realTimeRate.toFixed(2)}</th>
              <th>{c.overrideRate}</th>
              <th>{c.enteredAmount}</th>
              <th>{c.convertedAmount}</th>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function App() {
  const [exchangeRate, setExchangeRate] = useState(1.1)

  useEffect(() => {
    const interval = setInterval(() => {
      setExchangeRate((prevExchangeRate) => {
        const min = -0.05
        const max = 0.05
        const randomValue = Math.random() * (max - min) + min
        return prevExchangeRate + randomValue
      })
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div>
      <h1>EUR to USD Exchange Rate</h1>
      <p>{`1 EUR = ${exchangeRate.toFixed(2)} USD`}</p>
      <Converter rate={exchangeRate} />
    </div>
  )
}

export default App
