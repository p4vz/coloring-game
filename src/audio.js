// Tiny sound effects generated with the WebAudio API — no audio files ship,
// which keeps the bundle small. Gentle, short blips suitable for young kids.

import { state } from './state.js'

let ctx = null

function ensureCtx() {
  if (ctx) return ctx
  const AC = window.AudioContext || window.webkitAudioContext
  if (!AC) return null
  ctx = new AC()
  return ctx
}

// Mobile/tablet browsers require a user gesture before audio can start.
export function unlockAudio() {
  const c = ensureCtx()
  if (c && c.state === 'suspended') c.resume()
}

function blip({ freq = 600, dur = 0.12, type = 'sine', gain = 0.18 }) {
  if (state.muted) return
  const c = ensureCtx()
  if (!c) return
  if (c.state === 'suspended') c.resume()

  const osc = c.createOscillator()
  const g = c.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, c.currentTime)
  // Gentle rise then fall so it sounds soft, not harsh.
  g.gain.setValueAtTime(0.0001, c.currentTime)
  g.gain.exponentialRampToValueAtTime(gain, c.currentTime + 0.02)
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur)
  osc.connect(g).connect(c.destination)
  osc.start()
  osc.stop(c.currentTime + dur + 0.02)
}

export const sounds = {
  fill: () => blip({ freq: 520, dur: 0.14, type: 'triangle' }),
  stamp: () => blip({ freq: 740, dur: 0.12, type: 'sine' }),
  brush: () => blip({ freq: 360, dur: 0.08, type: 'sine', gain: 0.08 }),
  undo: () => blip({ freq: 300, dur: 0.12, type: 'triangle' }),
  pick: () => blip({ freq: 880, dur: 0.1, type: 'sine', gain: 0.12 }),
}
