(() => {
  const pad = (n) => String(n).padStart(2, '0')

  // Start is fixed at build time so countdown is consistent for all visitors
  const startISO = (globalThis.__UC_START_AT__ || new Date().toISOString())
  const start = Date.parse(startISO)
  const twoDaysMs = 2 * 24 * 60 * 60 * 1000
  const end = start + twoDaysMs

  const el = {
    dd: document.getElementById('dd'),
    hh: document.getElementById('hh'),
    mm: document.getElementById('mm'),
    ss: document.getElementById('ss'),
  }

  function render() {
    const now = Date.now()
    const diff = Math.max(0, end - now)

    const days = Math.floor(diff / (24 * 60 * 60 * 1000))
    const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000))
    const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000))
    const seconds = Math.floor((diff % (60 * 1000)) / 1000)

    el.dd.textContent = pad(days)
    el.hh.textContent = pad(hours)
    el.mm.textContent = pad(minutes)
    el.ss.textContent = pad(seconds)
  }

  render()
  setInterval(render, 1000)
})()

