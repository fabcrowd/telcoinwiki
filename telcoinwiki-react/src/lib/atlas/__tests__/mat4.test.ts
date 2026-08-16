import { lookAt, multiply, perspective, projectPoint } from '../mat4'

function identity(): Float32Array {
  const m = new Float32Array(16)
  m[0] = m[5] = m[10] = m[15] = 1
  return m
}

describe('mat4', () => {
  it('multiply by identity is a no-op', () => {
    const a = new Float32Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16])
    const result = multiply(a, identity())
    expect(Array.from(result)).toEqual(Array.from(a))
  })

  it('lookAt produces an orthonormal basis (columns are unit length and mutually perpendicular)', () => {
    const view = lookAt([5, 3, 8], [0, 0, 0], [0, 1, 0])
    const cols = [
      [view[0], view[1], view[2]],
      [view[4], view[5], view[6]],
      [view[8], view[9], view[10]],
    ]
    cols.forEach((c) => {
      const len = Math.hypot(c[0], c[1], c[2])
      expect(len).toBeCloseTo(1, 5)
    })
    // dot products between distinct axes should be ~0
    for (let i = 0; i < 3; i++) {
      for (let j = i + 1; j < 3; j++) {
        const dot = cols[i][0] * cols[j][0] + cols[i][1] * cols[j][1] + cols[i][2] * cols[j][2]
        expect(dot).toBeCloseTo(0, 5)
      }
    }
  })

  it('lookAt places the eye at the origin of view space', () => {
    const eye: [number, number, number] = [4, 2, -3]
    const view = lookAt(eye, [0, 0, 0], [0, 1, 0])
    // Transforming the eye point by the view matrix should land at (0,0,0).
    const x = view[0] * eye[0] + view[4] * eye[1] + view[8] * eye[2] + view[12]
    const y = view[1] * eye[0] + view[5] * eye[1] + view[9] * eye[2] + view[13]
    const z = view[2] * eye[0] + view[6] * eye[1] + view[10] * eye[2] + view[14]
    expect(x).toBeCloseTo(0, 4)
    expect(y).toBeCloseTo(0, 4)
    expect(z).toBeCloseTo(0, 4)
  })

  it('perspective maps a point on the near plane to clip w > 0', () => {
    const proj = perspective(Math.PI / 4, 16 / 9, 0.1, 100)
    const view = lookAt([0, 0, 5], [0, 0, 0], [0, 1, 0])
    const vp = multiply(proj, view)
    const projected = projectPoint(vp, [0, 0, 0])
    expect(projected).not.toBeNull()
    expect(projected!.w).toBeGreaterThan(0)
  })

  it('projectPoint returns null for a point behind the camera', () => {
    const proj = perspective(Math.PI / 4, 1, 0.1, 100)
    const view = lookAt([0, 0, 5], [0, 0, 0], [0, 1, 0])
    const vp = multiply(proj, view)
    // Far behind the eye, on the wrong side of the near plane.
    const projected = projectPoint(vp, [0, 0, 50])
    expect(projected).toBeNull()
  })

  it('a point dead ahead of the camera projects near clip-space center', () => {
    const proj = perspective(Math.PI / 4, 1, 0.1, 100)
    const view = lookAt([0, 0, 5], [0, 0, 0], [0, 1, 0])
    const vp = multiply(proj, view)
    const projected = projectPoint(vp, [0, 0, 0])
    expect(projected).not.toBeNull()
    expect(projected!.clipX).toBeCloseTo(0, 4)
    expect(projected!.clipY).toBeCloseTo(0, 4)
  })
})
