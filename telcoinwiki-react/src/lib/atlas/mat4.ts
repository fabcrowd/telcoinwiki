/**
 * Minimal column-major mat4 / vec3 helpers for the Network Atlas WebGL scene.
 *
 * No dependency (gl-matrix, three) is pulled in for this: the render loop
 * only ever needs multiply, perspective and lookAt, and hand-rolling three
 * functions is cheaper than a library plus its types for this single use site.
 */

export type Mat4 = Float32Array
export type Vec3 = readonly [number, number, number]

/** Column-major 4x4 multiply: returns a * b. */
export function multiply(a: Mat4, b: Mat4): Mat4 {
  const o = new Float32Array(16)
  for (let c = 0; c < 4; c++) {
    for (let r = 0; r < 4; r++) {
      o[c * 4 + r] =
        a[r] * b[c * 4] + a[4 + r] * b[c * 4 + 1] + a[8 + r] * b[c * 4 + 2] + a[12 + r] * b[c * 4 + 3]
    }
  }
  return o
}

export function perspective(fovYRadians: number, aspect: number, near: number, far: number): Mat4 {
  const f = 1 / Math.tan(fovYRadians / 2)
  const nf = 1 / (near - far)
  const o = new Float32Array(16)
  o[0] = f / aspect
  o[5] = f
  o[10] = (far + near) * nf
  o[11] = -1
  o[14] = 2 * far * near * nf
  return o
}

export function lookAt(eye: Vec3, target: Vec3, up: Vec3): Mat4 {
  let zx = eye[0] - target[0]
  let zy = eye[1] - target[1]
  let zz = eye[2] - target[2]
  const zl = Math.hypot(zx, zy, zz) || 1
  zx /= zl
  zy /= zl
  zz /= zl

  let xx = up[1] * zz - up[2] * zy
  let xy = up[2] * zx - up[0] * zz
  let xz = up[0] * zy - up[1] * zx
  const xl = Math.hypot(xx, xy, xz) || 1
  xx /= xl
  xy /= xl
  xz /= xl

  const yx = zy * xz - zz * xy
  const yy = zz * xx - zx * xz
  const yz = zx * xy - zy * xx

  const o = new Float32Array(16)
  o[0] = xx
  o[1] = yx
  o[2] = zx
  o[3] = 0
  o[4] = xy
  o[5] = yy
  o[6] = zy
  o[7] = 0
  o[8] = xz
  o[9] = yz
  o[10] = zz
  o[11] = 0
  o[12] = -(xx * eye[0] + xy * eye[1] + xz * eye[2])
  o[13] = -(yx * eye[0] + yy * eye[1] + yz * eye[2])
  o[14] = -(zx * eye[0] + zy * eye[1] + zz * eye[2])
  o[15] = 1
  return o
}

/** Project a world-space point through a combined view-projection matrix into clip space. */
export function projectPoint(
  vp: Mat4,
  p: Vec3,
): { clipX: number; clipY: number; w: number } | null {
  const x = vp[0] * p[0] + vp[4] * p[1] + vp[8] * p[2] + vp[12]
  const y = vp[1] * p[0] + vp[5] * p[1] + vp[9] * p[2] + vp[13]
  const w = vp[3] * p[0] + vp[7] * p[1] + vp[11] * p[2] + vp[15]
  if (w <= 0.0001) return null
  return { clipX: x / w, clipY: y / w, w }
}
