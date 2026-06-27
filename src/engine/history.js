// Undo / clear history. Each entry is a reversible operation. We keep it simple:
// an array of ops, each with an `undo()` closure. Clear is recorded as a single
// batched op so one undo restores the whole picture.

const MAX_HISTORY = 60

export function createHistory() {
  const stack = []
  const listeners = new Set()

  function notify() {
    for (const fn of listeners) fn(stack.length)
  }

  return {
    onChange(fn) {
      listeners.add(fn)
      fn(stack.length)
    },
    push(undoFn) {
      stack.push(undoFn)
      if (stack.length > MAX_HISTORY) stack.shift()
      notify()
    },
    undo() {
      const op = stack.pop()
      if (op) op()
      notify()
      return Boolean(op)
    },
    get size() {
      return stack.length
    },
    reset() {
      stack.length = 0
      notify()
    },
  }
}
