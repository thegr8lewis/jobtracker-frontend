import React from 'react';
import type { AppProps } from 'next/app';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Head from 'next/head';
import '../styles/globals.css';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Job Tracker</title>
      </Head>
      <Component {...pageProps} />
    </LocalizationProvider>
  );
}