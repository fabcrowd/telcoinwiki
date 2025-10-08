import { getRailTransforms } from '../../cinematic/railMath'

describe('railMath', () => {
  it('computes track/bg/progress transforms', () => {
    const res = getRailTransforms(5, 0.5, 0.25)
    expect(res.trackX).toBe(-200) // (-(5-1)*100)*0.5 = -400*0.5
    expect(res.bgX).toBe(-50) // trackX * 0.25
    expect(res.scaleX).toBe(0.5)
  })

  it('clamps inputs', () => {
    const res = getRailTransforms(0, 2, -1)
    expect(res.trackX).toBe(0)
    expect(res.bgX).toBe(0)
    expect(res.scaleX).toBe(1)
  })
})

