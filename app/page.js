'use client';
import React, { useReducer, useEffect } from 'react';
import Head from 'next/head';
import styles from './page.module.css';

const initialState = {
  minutes: 25,
  seconds: 0,
  isActive: false,
  mode: 'work',
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
    default:
      return state;
  }
}

export default function Home() {
  const [state, dispatch] = useReducer(reducer, initialState);

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

  function toggleTimer() {
    dispatch({ type: 'TOGGLE_TIMER' });
  }

  function resetTimer() {
    dispatch({ type: 'RESET_TIMER' });
  }

  return (
    <div className={styles.container}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>{state.mode === 'work' ? 'Work' : 'Break'}</h1>
        <div className={styles.timer}>
          {String(state.minutes).padStart(2, '0')}:{String(state.seconds).padStart(2, '0')}
        </div>
        <div className={styles.buttons}>
          <button className={styles.button} onClick={toggleTimer}>
            {state.isActive ? 'Pause' : 'Start'}
          </button>
          <button className={styles.button} onClick={resetTimer}>Reset</button>
        </div>
      </main>
    </div>
  );
}