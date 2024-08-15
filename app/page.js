'use client';

import React, { useReducer, useEffect, useState } from 'react';
import Head from 'next/head';
import styles from './page.module.css';

import { Space_Mono, DM_Mono } from "next/font/google";

const spacemonofont = Space_Mono({ subsets: ['latin'], weight: ["400", "700"] });
const dmmonofont = DM_Mono({ subsets: ['latin'], weight: ["300", "400", "500"] });

const initialState = {
  minutes: 25,
  seconds: 0,
  isActive: false,
  mode: 'work',
  backgroundColor: '#8c443e',
};

function reducer(state, action) {
  switch (action.type) {
    case 'TICK':
      if (state.seconds > 0) {
        return { ...state, seconds: state.seconds - 1 };
      } else if (state.minutes > 0) {
        return { ...state, minutes: state.minutes - 1, seconds: 59 };
      } else {
        const newMode = state.mode === 'work' ? 'break' : 'work';
        return {
          ...state,
          isActive: false,
          mode: newMode,
          minutes: newMode === 'work' ? 25 : 5,
          seconds: 0,
          backgroundColor: newMode === 'work' ? '#8c443e' : '#3b5d75',
        };
      }
    case 'TOGGLE_TIMER':
      return { ...state, isActive: !state.isActive };
    case 'RESET_TIMER':
      return {
        ...state,
        isActive: false,
        minutes: state.mode === 'work' ? 25 : 5,
        seconds: 0,
      };
    case 'TOGGLE_STATE':
      const newMode = state.mode === 'work' ? 'break' : 'work';
      return {
        ...state,
        mode: newMode,
        backgroundColor: newMode === 'work' ? '#8c443e' : '#3b5d75',
        isActive: false,
        minutes: state.mode === 'break' ? 25 : 5,
        seconds: 0,
      };
    default:
      return state;
  }
}

export default function Home() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    let interval = null;
    if (state.isActive) {
      interval = setInterval(() => {
        dispatch({ type: 'TICK' });
      }, 1000);
    } else if (!state.isActive && state.seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [state.isActive, state.seconds]);

  useEffect(() => {
    document.body.style.setProperty('--background-color', state.backgroundColor);
  }, [state.backgroundColor]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  function toggleTimer() {
    dispatch({ type: 'TOGGLE_TIMER' });
  }

  function resetTimer() {
    dispatch({ type: 'RESET_TIMER' });
  }

  function toggleState() {
    dispatch({ type: 'TOGGLE_STATE' });
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${spacemonofont.className}`}>
        <button 
          onClick={toggleFullscreen}
          className={`${styles.fullscreenButton} ${spacemonofont.className}`}
        >
          {isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        </button>
        <h1 className={styles.title}>{state.mode === 'work' ? 'Work' : 'Break'}</h1>
        <div className={`${styles.timer} ${dmmonofont.className}`}>
          {String(state.minutes).padStart(2, '0')}:{String(state.seconds).padStart(2, '0')}
        </div>
        <div className={styles.buttons}>
          <button className={`${styles.button} ${spacemonofont.className}`} onClick={toggleTimer}>
            {state.isActive ? 'Pause' : 'Start'}
          </button>
          <button className={`${styles.button} ${spacemonofont.className}`} onClick={resetTimer}>Reset</button>
          <button className={`${styles.button} ${spacemonofont.className}`} onClick={toggleState}>Skip</button>
        </div>
      </main>
    </div>
  );
}