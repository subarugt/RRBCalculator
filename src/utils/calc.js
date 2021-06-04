// eslint-disable-next-line no-undef
exports.__esModule = true
// eslint-disable-next-line no-undef
exports.Calculator = undefined

const Calculator = /** @class */ (function () {
  function Calculator () {
  }

  Calculator.prototype.numOfMonths = function (dTempDate1, dTempDate2) {
    return dTempDate1.getMonth() - dTempDate2.getMonth() + 12 * (dTempDate1.getFullYear() - dTempDate2.getFullYear())
  }

  Calculator.prototype.isLastDay = function (date) {
    /** @type {!Date} */
    const playdate = new Date(date.getTime())
    /** @type {number} */
    const a = playdate.getMonth()
    playdate.setDate(playdate.getDate() + 1)
    return playdate.getMonth() !== a
  }

  Calculator.prototype.MonthDays = function (dt) {
    return (new Date(dt.getFullYear(), dt.getMonth() + 1, 0)).getDate()
  }

  Calculator.prototype.getMonthDaysLeft = function (val) {
    const lastThisMonth = new Date(val.getFullYear(), val.getMonth() + 1, 0)
    return lastThisMonth.getDate() - val.getDate() + 1
  }

  Calculator.prototype.getDayOfYear = function (val) {
    const start = new Date(val.getFullYear(), 0, 0)
    const diff = val - start
    const oneDay = 1000 * 60 * 60 * 24
    return Math.floor(diff / oneDay)
  }

  Calculator.prototype.daysBetween = function (date1, date2) {
    const diffTime = Math.abs(date2 - date1)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  Calculator.prototype.GetAllInterestData = function (investedAmount, rate, start, end, product) {
    const period = product === 'monthly-interest' ? 'month' : 'halfyear'
    const dates = this.GetPaymentDates(start, end, period)
    /** @type {!Array} */
    let res = []
    /** @type {number} */
    let index = 0
    let n = 0
    let i = 0
    let eTotal = 0
    if (product === 'interest') {
      for (; index < dates.length; index++) {
        /** @type {number} */
        const binarySign = (this.getMonthDaysLeft(dates[0]) - 2) / this.MonthDays(dates[0]) / 12
        if (index === 0) {
          /** @type {number} */
          n = investedAmount * Math.pow(1 + rate / 100 / 2, 2 * binarySign)
          res.push({
            date: dates[index],
            total: n,
            interest: 0
          })
        }
        if (index === 1) {
          /** @type {number} */
          eTotal = (new Date(dates[1]) - new Date(dates[0])) / 864E5
          console.log('diffInDays', eTotal.toFixed(2))
          /** @type {number} */
          i = investedAmount * (rate / 100) * eTotal / 365
          res.push({
            date: dates[index],
            total: i,
            interest: i
          })
        } else {
          if (dates.length - 1 !== index || this.isLastDay(dates[index]) || index === 0) {
            if (index > 1 && index < dates.length - 1) {
              /** @type {number} */
              n = investedAmount * Math.pow(1 + rate / 100 / 2, 1)
              res.push({
                date: dates[index],
                total: n,
                interest: n - investedAmount
              })
            }
          } else {
            /** @type {number} */
            eTotal = (dates[dates.length - 1] - dates[dates.length - 2]) / 864E5
            console.log('diffInDays', eTotal.toFixed(2))
            /** @type {number} */
            i = investedAmount * (rate / 100) * eTotal / 365
            res.push({
              date: dates[index],
              total: investedAmount + i,
              interest: i
            })
          }
        }
      }
      return {
        investment: investedAmount,
        rate: rate,
        startDate: start,
        endDate: end,
        payments: res,
        productType: product
      }
    }
    if (product === 'monthly-interest') {
      /** @type {!Array} */
      res = []
      const remainingDays = this.getMonthDaysLeft(start)
      const m = this.MonthDays(start)
      const actual = this.numOfMonths(end, start)
      /** @type {number} */
      const target = investedAmount * rate / 100 * remainingDays / 365 * (365 / 12) / m
      /** @type {number} */
      const _Container = investedAmount * rate / 100 * (m - remainingDays) / 365 * (365 / 12) / m
      res.push({
        date: dates[0],
        total: investedAmount,
        interest: 0
      })
      res.push({
        date: dates[1],
        total: investedAmount,
        interest: target
      })
      /** @type {number} */
      i = 2
      for (; i < dates.length - 1; i++) {
        res.push({
          date: dates[i],
          total: investedAmount,
          interest: investedAmount * (rate / 100) / 12
        })
      }
      res.push({
        date: dates[dates.length - 1],
        total: investedAmount,
        interest: _Container
      })
      return {
        investment: investedAmount,
        rate: rate,
        startDate: start,
        endDate: end,
        payments: res,
        productType: product,
        totalMonthlyInterest: investedAmount * (rate / 100) / 12 * Math.abs(actual - 1) + target + _Container
      }
    }
    if (product === 'reinvested') {
      console.log('startAmount', investedAmount)
      /** @type {!Array} */
      res = []
      /** @type {number} */
      let total = parseFloat(investedAmount)

      res.push({
        date: dates[0],
        total: total,
        interest: 0
      })

      let interest = total * (rate / 100) * (this.DaysLeftInYear(start) / 365)
      total = total + interest

      res.push({
        date: dates[1],
        total: total,
        interest: interest
      })

      /** @type {number} */
      i = 2
      for (; i < dates.length - 1; i++) {
        /** @type {number} */
        interest = total * (rate / 100 / 2)
        total = total + interest
        res.push({
          date: dates[i],
          total: total,
          interest: interest
        })
      }

      interest = total * (rate / 100) * ((this.DaysPassedInYear(end) + 1) / 365)
      total = total + interest
      res.push({
        date: dates[i],
        total: total,
        interest: interest
      })

      console.log('outputRR', total, res)

      return {
        investment: total,
        rate: rate,
        startDate: start,
        endDate: end,
        payments: res,
        productType: 'reinvested'
      }
    }
  }
  Calculator.prototype.GetPaymentDates = function (dt, a, period) {
    console.log('dattes', dt)
    /** @type {!Array} */
    const dates = []
    dates.push(new Date(dt.getFullYear(), dt.getMonth(), dt.getDate()))
    /** @type {!Date} */
    let date = new Date(dt.getFullYear(), 3, 0)
    /** @type {!Date} */
    let today = new Date(dt.getFullYear(), 9, 0)
    for (; date.getTime() < a.getTime();) {
      if (period === 'halfyear') {
        if (date.getTime() > dt.getTime() && date.getTime() < a.getTime()) {
          dates.push(date)
        }
        if (today.getTime() > dt.getTime() && today.getTime() < a.getTime()) {
          dates.push(today)
        }

        /** @type {!Date} */
        date = new Date(date.getFullYear() + 1, 3, 0)
        /** @type {!Date} */
        today = new Date(today.getFullYear() + 1, 9, 0)
      } else if (period === 'month') {
        if (date.getTime() > dt.getTime() && date.getTime() < a.getTime()) {
          dates.push(date)
        }
        /** @type {!Date} */
        date = new Date(date.getFullYear(), date.getMonth() + 2, 0)
      }
    }
    dates.push(new Date(a.getFullYear(), a.getMonth(), a.getDate()))
    return dates
  }

  Calculator.prototype.NextFullYear = function (dt) {
    const apr = new Date(dt.getFullYear(), 3, 1)
    const sep = new Date(dt.getFullYear(), 9, 1)
    const aprNext = new Date(dt.getFullYear() + 1, 3, 1)

    if (dt.getTime() > sep.getTime()) return aprNext
    else if (dt.getTime() > apr.getTime()) return sep
    else return apr
  }

  Calculator.prototype.PrevFullYear = function (dt) {
    const sepPrev = new Date(dt.getFullYear() - 1, 9, 1)
    const apr = new Date(dt.getFullYear(), 3, 1)
    const sep = new Date(dt.getFullYear(), 9, 1)

    if (dt.getTime() < apr.getTime()) return sepPrev
    else if (dt.getTime() < sep.getTime()) return apr
    else return sep
  }

  Calculator.prototype.DaysLeftInYear = function (dt) {
    const nextHalfYear = this.NextFullYear(dt)
    return this.daysBetween(dt, nextHalfYear) - 1
  }
  Calculator.prototype.DaysPassedInYear = function (dt) {
    const lastHalfYear = this.PrevFullYear(dt)
    return this.daysBetween(lastHalfYear, dt)
  }
  Calculator.prototype.PercentDaysLeftInMonth = function (dt) {
    if (dt === undefined) { dt = new Date() }
    const now = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate() + 1)
    const today = now
    const lastDayThisMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    const daysLeft = lastDayThisMonth.getDate() - today.getDate()
    const totalDaysThisMonth = lastDayThisMonth.getDate()
    return daysLeft / totalDaysThisMonth
  }
  Calculator.prototype.PercentDaysPassedInMonth = function (dt) {
    if (dt === undefined) { dt = new Date() }
    const now = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate())
    const today = now
    const lastDayThisMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    const daysPassed = today.getDate()
    const totalDaysThisMonth = lastDayThisMonth.getDate()

    console.log('ressd', daysPassed, totalDaysThisMonth)
    return daysPassed / totalDaysThisMonth
  }
  return Calculator
}())
// eslint-disable-next-line no-undef
exports.Calculator = Calculator
