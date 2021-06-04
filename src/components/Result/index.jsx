/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200
  },
  tableCell: {
    fontSize: 16
  },
  tableCellTotalBold: {
    fontSize: 16
  },
  resultsTableHeader: {
    background: '#d73818'
  },
  fontWeight: {
    fontWeight: 'bold'
  }
}))

const Result = ({ resultData }) => {
  console.log('resultDataTable', resultData)

  let total = 0
  const classes = useStyles()
  const payments =
    resultData != null && resultData.payments != null ? resultData.payments : []
  const date = new Date()
  const valueFormatter = new Intl.NumberFormat('en-GB', { currency: 'ZAR', style: 'currency' })
  const interestFormatter = new Intl.NumberFormat('en-GB', { style: 'decimal' })
  const dateFormatter = new Intl.DateTimeFormat('en-GB')

  total = 0

  resultData.payments.forEach(item => {
    total = total + item.interest
  })

  return (
    <div>
      <Table className={classes.table} size='small' aria-label='result'>
        <TableHead>
          <TableRow>
            <TableCell className={classes.tableCell} colSpan={2} align='left'>
              INVESTMENT OVERVIEW
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow height='12' />
          <TableRow hover>
            <TableCell className={classes.tableCell}>Interest Rate</TableCell>
            <TableCell className={classes.tableCell} align='left'>
              {resultData.rate.toFixed(2)}%
            </TableCell>
          </TableRow>
          <TableRow hover>
            <TableCell className={classes.tableCell}>Starting</TableCell>
            <TableCell className={classes.tableCell} align='left'>
              {dateFormatter.format(new Date(resultData.startDate))}
            </TableCell>
          </TableRow>
          <TableRow hover>
            <TableCell className={classes.tableCell}>Ending</TableCell>
            <TableCell className={classes.tableCell} align='cleft'>
              {dateFormatter.format(new Date(resultData.endDate))}
            </TableCell>
          </TableRow>
          <TableRow hover>
            <TableCell className={classes.tableCell}><span className={classes.fontWeight}>Total Interest Earned</span></TableCell>
            <TableCell className={classes.tableCell} align='left'>
              <span className={classes.fontWeight}>{valueFormatter.format(total).replace('ZAR', 'R ')}</span>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <div className='tableGap' />

      <Table className={classes.table} size='small' aria-label='result'>
        <TableHead>
          <TableRow>
            <TableCell className={classes.tableCell} colSpan={6} align='left'>
              Interest returns
            </TableCell>
          </TableRow>
          <TableRow height='12' />
          <TableRow>
            <TableCell className={classes.tableCell} colSpan={2} align='left'>
              Date
            </TableCell>
            <TableCell className={classes.tableCell} colSpan={2} align='left'>
              Interest Earned
            </TableCell>{
              !(resultData.productType === 'monthly-interest' || resultData.productType === 'interest') &&
                <TableCell className={classes.tableCell} colSpan={2} align='left'>
                  Investment Value
                </TableCell>
            }

          </TableRow>
        </TableHead>

        <TableBody>
          {payments.map(i => (
            <TableRow key={i.date} hover>
              <TableCell className={classes.tableCell} colSpan={2} align='left'>
                {dateFormatter.format(new Date(i.date))}
              </TableCell>
              <TableCell className={classes.tableCell} colSpan={2} align='left'>
                {i.interest.toFixed(2)}
              </TableCell>{
                  !(resultData.productType === 'monthly-interest' || resultData.productType === 'interest') &&
                    <TableCell className={classes.tableCellTotalBold} colSpan={2} align='left'>
                      {valueFormatter.format(i.total).replace('ZAR', 'R ')}
                    </TableCell>
              }

            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default Result
