import { AppBar, Box } from '@mui/material'
import React from 'react'
import { Outlet } from 'react-router-dom'
import AppBarComponent from './auth/components/NavBar'

export default function LandingPageLayout() {
  return (
    <Box>
      <AppBarComponent/>
        <Outlet/>
    </Box>
  )
}
