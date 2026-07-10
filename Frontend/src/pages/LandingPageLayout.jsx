import { AppBar, Box } from '@mui/material'
import React from 'react'
import { Outlet } from 'react-router-dom'
import AppBarComponent from './auth/components/NavBar'
import Footer from './Footer'

export default function LandingPageLayout() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <AppBarComponent />
      <Box
        component="main"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Outlet />
      </Box>
      <Footer />
    </Box>

  )
}
