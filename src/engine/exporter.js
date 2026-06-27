// Save the current picture as a PNG. We serialize the live SVG, rasterize it
// onto an offscreen canvas, and trigger a download. In Phase 2 (Capacitor) this
// is the one spot that swaps to the native filesystem/share API.

const EXPORT_WIDTH = 1600 // crisp enough to print, still light

export function exportPng(svg, filename = 'my-coloring.png') {
  return new Promise((resolve, reject) => {
    if (!svg) return reject(new Error('no picture to save'))

    const clone = svg.cloneNode(true)
    // Give the export a solid white background so it isn't transparent.
    const vb = (svg.getAttribute('viewBox') || '0 0 100 100')
      .split(/\s+/)
      .map(Number)
    const [, , vbW, vbH] = vb
    const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    bg.setAttribute('x', vb[0])
    bg.setAttribute('y', vb[1])
    bg.setAttribute('width', vbW)
    bg.setAttribute('height', vbH)
    bg.setAttribute('fill', '#ffffff')
    clone.insertBefore(bg, clone.firstChild)
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')

    const data = new XMLSerializer().serializeToString(clone)
    const blob = new Blob([data], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)

    const img = new Image()
    img.onload = () => {
      const ratio = vbH / vbW || 1
      const canvas = document.createElement('canvas')
      canvas.width = EXPORT_WIDTH
      canvas.height = Math.round(EXPORT_WIDTH * ratio)
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(url)

      canvas.toBlob((png) => {
        if (!png) return reject(new Error('export failed'))
        const a = document.createElement('a')
        a.href = URL.createObjectURL(png)
        a.download = filename
        document.body.appendChild(a)
        a.click()
        a.remove()
        setTimeout(() => URL.revokeObjectURL(a.href), 1000)
        resolve()
      }, 'image/png')
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('could not render picture'))
    }
    img.src = url
  })
}
