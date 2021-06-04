/* eslint-disable no-unused-vars */
/* eslint-disable no-const-assign */
/* eslint-disable no-case-declarations */
/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import { Calculator } from '../../utils/calc'
import Result from '../Result'
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'

import DateFnsUtils from '@date-io/date-fns'
import { TableRow } from '@material-ui/core'

const styles = theme => ({
  root: {
    padding: 16
  },
  input: {
    width: '100%'
  },
  calcButton: {
    width: '100%',
    marginBottom: 16,
    [theme.breakpoints.up('sm')]: {
      width: '48%',
      marginRight: 11,
      marginBottom: 0
    }
  },
  resetButton: {
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '48%',
      marginLeft: 11
    }
  },
  buttonProgress: {
    position: 'absolute',
    marginTop: 8,
    marginLeft: -150
  }
})

class CompoundInterest extends Component {
  constructor (props) {
    super(props)
    const data = JSON.parse(sessionStorage.getItem('calculator'))

    const initialInvestment = data?.initialInvestment || '1000'
    const startDate = data?.startDate || new Date()
    const product = data?.product || { name: '2y', rate: 6.00, years: 2 }
    const productType = data?.productType || 'reinvested'

    this.state = {
      initialInvestment: initialInvestment,
      startDate: startDate,
      productType: productType,
      product: product,
      isCalculating: false,
      isResetting: false,
      resultData: {
        investment: this.state?.initialInvestment,
        rate: this.state?.product.rate,
        startDate: new Date(),
        payments: []
      }
    }
  }

  handleChange = e => {
    console.log(e.target.name)
    console.log(e.target.value)
    this.setState({ [e.target.name]: e.target.value })
  };

  handleDate = e => {
    console.log('date', e)
    this.setState({ startDate: e })
  };

  handleProduct = e => {
    if (e.target.value === '2y') this.setState({ product: { name: '2y', rate: 6.00, years: 2 } })
    if (e.target.value === '3y') this.setState({ product: { name: '3y', rate: 6.75, years: 3 } })
    if (e.target.value === '5y') this.setState({ product: { name: '5y', rate: 8.25, years: 5 } })
    if (e.target.value === 'custom') {
      const nprod = this.state?.product
      nprod.name = 'custom'
      this.setState(this.state)
    }
  };

  handleProductYears = e => {
    const yprod = this.state?.product || { product: { name: 'custom', rate: 6.00, years: 2 } }
    yprod.years = parseInt(e.target.value)
    this.setState(this.state)
  };

  handleProductRate = e => {
    const rprod = this.state?.product
    rprod.rate = parseFloat(e.target.value)
    this.setState(this.state)
  };

  handleSubmit = e => {
    e.preventDefault()
    console.log('state', this.state)

    sessionStorage.setItem(
      'calculator',
      JSON.stringify({
        initialInvestment: this.state?.initialInvestment,
        startDate: this.state?.startDate,
        product: this.state?.product,
        productType: this.state?.productType
      })
    )

    this.setState({ isCalculating: true })

    setTimeout(() => {
      let {
        isResetting,
        initialInvestment,
        startDate,
        product,
        resultData,
        productType
      } = this.state

      if (!initialInvestment) initialInvestment = 2000
      if (!startDate) startDate = new Date()
      if (!product) product = { years: 2, rate: 5.00 }

      const calc = new Calculator()
      const startDateObject = new Date(startDate)
      const endDateObject = new Date(startDateObject.getFullYear() + this.state.product.years, startDateObject.getMonth(), startDateObject.getDate())

      resultData = calc.GetAllInterestData(initialInvestment, product.rate, startDateObject, endDateObject, productType)

      console.log('resultDtat', resultData)

      this.setState({
        isCalculating: false,
        isResetting,
        initialInvestment,
        startDate,
        product,
        resultData
      })

      this.props.scrollBottom()
    }, 2000)
  };

  handleReset = (e) => {
    e.preventDefault()
    const newState = {
      isResetting: false,
      initialInvestment: 1000,
      startDate: new Date(),
      productType: 'reinvested',
      product: { name: '5y', rate: 8.25, years: 5 },
      isCalculating: false
    }

    sessionStorage.setItem(
      'calculator',
      JSON.stringify(newState)
    )

    this.setState(newState)

    this.props.scrollTop()
  };

  render () {
    let {
      initialInvestment,
      startDate,
      product,
      isCalculating,
      isResetting,
      resultData
    } = this.state

    const date = new Date()
    const formatedDate = `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`

    if (!initialInvestment) initialInvestment = 1000
    if (!startDate) startDate = `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`
    if (!product) product = { name: 'reinvested', years: 2, rate: 5.00 }
    if (!resultData) {
      this.props.resultData = {
        investment: 1000,
        rate: 5.00,
        startDate: `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`,
        endDate: new Date(startDate.getFullYear() + product.years, startDate.getMonth(), startDate.getDate()),
        payments: []
      }
    }

    // eslint-disable-next-line react/prop-types
    const { classes } = this.props
    let isFormFilled = false
    if (
      initialInvestment &&
      product &&
      startDate
    ) {
      isFormFilled = true
    }

    return (
      <main role='main'>
        <form
          className={classes.root}
          noValidate
          autoComplete='off'
          onSubmit={this.handleSubmit}
          onReset={this.handleReset}
        >
          <Grid container spacing={3}>
            {this.state.resultData.payments.length > 0 &&

              <Grid item xs={6}>

                <Result resultData={resultData} />

              </Grid>}
            <Grid item spacing={3} xs={6}>
              <Grid item spacing={3} xs={12}>
                <TextField
                  className={classes.input}
                  id='initial-investment'
                  name='initialInvestment'
                  label='Initial Investment'
                  variant='outlined'
                  type='number'
                  value={this.state.initialInvestment || '100000'}
                  onChange={this.handleChange}
                  disabled={isCalculating || isResetting}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  className={classes.input}
                  id='type'
                  name='productType'
                  label='Interest Frequency'
                  variant='outlined'
                  onChange={this.handleChange}
                  defaultValue={this.state.productType || 'reinvested'}
                  select
                >
                  <MenuItem selected value='reinvested'>Re-Invest Interest</MenuItem>
                  <MenuItem value='interest'>Receive Interest Semi-Anually</MenuItem>
                  <MenuItem value='monthly-interest'>Monthly Returns</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <DatePicker
                    label='Start date'
                    animateYearScrolling
                    format='dd-MMMM-yyyy'
                    name='startDate'
                    value={this.state.startDate}
                    onChange={this.handleDate}
                    className={classes.input}
                    inputVariant='outlined'
                  />
                </MuiPickersUtilsProvider>

              </Grid>
              {/* <Grid item xs={12}>
              <TextField
                id='start-date'
                name='startDate'
                variant='outlined'
                type='date'
                value={this.startDate}
                onChange={this.handleChange}
                disabled={isCalculating || isResetting}
              />
            </Grid> */}

              <Grid item xs={12}>

                <TextField
                  className={classes.input}
                  id='product'
                  name='product'
                  label='Product'
                  variant='outlined'
                  onChange={this.handleProduct}
                  disabled={isCalculating || isResetting}
                  defaultValue={this.state.product.name}
                  select
                >
                  <MenuItem value='2y'>2 Year (6.00% interest)</MenuItem>
                  <MenuItem value='3y'>3 Year (6.75% interest)</MenuItem>
                  <MenuItem value='5y'>5 Year (8.25% interest)</MenuItem>
                  <MenuItem value='custom'>Custom</MenuItem>
                </TextField>
              </Grid>

              {this.state.product.name === 'custom' &&
                <Grid container>
                  <Grid item xs={6}>

                    <TextField
                      className={classes.input}
                      id='rate'
                      name='productRate'
                      label='Interest Rate'
                      variant='outlined'
                      onChange={this.handleProductRate}
                      defaultValue={this.state.product.rate || 5.00}
                      select
                    >
                      <MenuItem selected value='0.25'>0.25%</MenuItem>
                      <MenuItem selected value='0.50'>0.50%</MenuItem>
                      <MenuItem selected value='0.75'>0.75%</MenuItem>
                      <MenuItem selected value='1.00'>1.00%</MenuItem>
                      <MenuItem selected value='1.25'>1.25%</MenuItem>
                      <MenuItem selected value='1.50'>1.50%</MenuItem>
                      <MenuItem selected value='1.75'>1.75%</MenuItem>
                      <MenuItem selected value='2.00'>2.00%</MenuItem>
                      <MenuItem selected value='2.25'>2.25%</MenuItem>
                      <MenuItem selected value='2.50'>2.50%</MenuItem>
                      <MenuItem selected value='2.75'>2.75%</MenuItem>
                      <MenuItem selected value='3.00'>3.00%</MenuItem>
                      <MenuItem selected value='3.25'>3.25%</MenuItem>
                      <MenuItem selected value='3.50'>3.50%</MenuItem>
                      <MenuItem selected value='3.75'>3.75%</MenuItem>
                      <MenuItem selected value='4.00'>4.00%</MenuItem>
                      <MenuItem selected value='4.25'>4.25%</MenuItem>
                      <MenuItem selected value='4.50'>4.50%</MenuItem>
                      <MenuItem selected value='4.75'>4.75%</MenuItem>
                      <MenuItem selected value='5.00'>5.00%</MenuItem>
                      <MenuItem selected value='5.25'>5.25%</MenuItem>
                      <MenuItem selected value='5.50'>5.50%</MenuItem>
                      <MenuItem selected value='5.75'>5.75%</MenuItem>
                      <MenuItem selected value='6.00'>6.00%</MenuItem>
                      <MenuItem selected value='6.25'>6.25%</MenuItem>
                      <MenuItem selected value='6.50'>6.50%</MenuItem>
                      <MenuItem selected value='6.75'>6.75%</MenuItem>
                      <MenuItem selected value='7.00'>7.00%</MenuItem>
                      <MenuItem selected value='7.25'>7.25%</MenuItem>
                      <MenuItem selected value='7.50'>7.50%</MenuItem>
                      <MenuItem selected value='7.75'>7.75%</MenuItem>
                      <MenuItem selected value='8.00'>8.00%</MenuItem>
                      <MenuItem selected value='8.25'>8.25%</MenuItem>
                      <MenuItem selected value='8.50'>8.50%</MenuItem>
                      <MenuItem selected value='8.75'>8.75%</MenuItem>
                      <MenuItem selected value='9.00'>9.00%</MenuItem>
                    </TextField>
                  </Grid>

                  <Grid item xs={6}>

                    <TextField
                      className={classes.input}
                      id='years'
                      name='productYears'
                      label='Number of Years'
                      variant='outlined'
                      onChange={this.handleProductYears}
                      defaultValue={this.state.product.years || 1}
                      select
                    >
                      <MenuItem selected value='1'>1 Year</MenuItem>
                      <MenuItem selected value='2'>2 Years</MenuItem>
                      <MenuItem selected value='3'>3 Years</MenuItem>
                      <MenuItem selected value='4'>4 Years</MenuItem>
                      <MenuItem selected value='5'>5 Years</MenuItem>
                      <MenuItem selected value='6'>6 Years</MenuItem>
                      <MenuItem selected value='7'>7 Years</MenuItem>
                      <MenuItem selected value='8'>8 Years</MenuItem>
                      <MenuItem selected value='9'>9 Years</MenuItem>
                      <MenuItem selected value='10'>10 Years</MenuItem>
                      <MenuItem selected value='11'>11 Years</MenuItem>
                      <MenuItem selected value='12'>12 Years</MenuItem>
                      <MenuItem selected value='13'>13 Years</MenuItem>
                      <MenuItem selected value='14'>14 Years</MenuItem>
                      <MenuItem selected value='15'>15 Years</MenuItem>
                      <MenuItem selected value='16'>16 Years</MenuItem>
                      <MenuItem selected value='17'>17 Years</MenuItem>
                      <MenuItem selected value='18'>18 Years</MenuItem>
                      <MenuItem selected value='19'>19 Years</MenuItem>
                      <MenuItem selected value='20'>20 Years</MenuItem>
                    </TextField>
                  </Grid>
                </Grid>}

              <Grid item xs={12}>
                <Button
                  className={classes.calcButton}
                  type='submit'
                  variant='contained'
                  color='primary'
                  size='large'
                  disabled={!isFormFilled || isCalculating}
                >
                  Calculate
                </Button>
                {isCalculating && (
                  <CircularProgress
                    className={classes.buttonProgress}
                    thickness={4}
                    size={28}
                  />
                )}
                <Button
                  className={classes.resetButton}
                  type='reset'
                  variant='contained'
                  size='large'
                  disabled={!isFormFilled || isResetting}
                >
                  Reset
                </Button>
                {isResetting && (
                  <CircularProgress
                    className={classes.buttonProgress}
                    thickness={4}
                    size={28}
                  />
                )}
              </Grid>
            </Grid>
          </Grid>
        </form>

      </main>
    )
  }
}

export default withStyles(styles)(CompoundInterest)
