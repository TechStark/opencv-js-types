import { del } from 'mirada'
import { checkThrow } from 'misc-utils-of-mine-generic'
import { CannyOptions } from './types'

export function canny(o: CannyOptions) {
  checkThrow(!o.apertureSize || o.apertureSize < 3 || o.apertureSize % 2 !== 0, 'Aperture size must be odd and greater than 2')
  const dst = o.dst = o.dst || new cv.Mat()
  o.src.copyTo(dst)
  cv.cvtColor(dst, dst, cv.CV_8UC1, 3)
  const c = dst.clone()
  cv.Canny(c, dst, typeof o.threshold1 === 'undefined' ? 0 : o.threshold1,
    typeof o.threshold2 === 'undefined' ? 255 : o.threshold2,
    typeof o.apertureSize === 'undefined' ? 3 : o.apertureSize, o.L2gradient || false) // heads up ! dst needs to be bigger!
  del(c)
  return o.dst
}