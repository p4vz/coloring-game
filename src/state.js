// Global app state. Kept deliberately tiny — a single object plus a few
// helpers. No framework, no reactivity library; UI modules read these values
// and update their own DOM when notified.

export const TOOLS = {
  FILL: 'fill',
  BRUSH: 'brush',
  STICKER: 'sticker',
}

export const state = {
  tool: TOOLS.FILL,
  color: '#ff5a5f',
  brushSize: 14,
  sticker: 'star',
  muted: false,
}

const MUTE_KEY = 'colorfun.muted'

export function loadPrefs() {
  try {
    state.muted = localStorage.getItem(MUTE_KEY) === '1'
  } catch {
    // localStorage can be unavailable (private mode); default to unmuted.
  }
}

export function setMuted(muted) {
  state.muted = muted
  try {
    localStorage.setItem(MUTE_KEY, muted ? '1' : '0')
  } catch {
    // ignore persistence failures
  }
}
