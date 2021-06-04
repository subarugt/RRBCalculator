/* eslint-disable no-unused-vars */
import React, { useRef } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'

import CompoundInterest from '../CompoundInterest/index'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    marginTop: 80,
    marginBottom: 20,
    margin: 'auto',
    [theme.breakpoints.up('md')]: {
      width: '100%'
    }
  },
  palette: {
    primary: {
      light: '#757ce8',
      main: '#f4711d',
      dark: '#ba4200',
      contrastText: '#fff'
    },
    secondary: {
      light: '#9b9b9b',
      main: '#6d6d6d',
      dark: '#424242',
      contrastText: 'fff'
    }
  }
}))

const Main = () => {
  const classes = useStyles()
  const top = useRef()
  const bottom = useRef()

  const scrollTop = () => {
    top.current.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollBottom = () => {
    bottom.current.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <Container className={classes.root}>
      <div ref={top} />
      <Paper elevation={2} className={classes.paper}>
        <CompoundInterest scrollTop={scrollTop} scrollBottom={scrollBottom} />
      </Paper>
      <div ref={bottom} />
    </Container>
  )
}

export default Main
