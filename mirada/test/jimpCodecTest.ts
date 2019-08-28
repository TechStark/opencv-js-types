import test from 'ava'
import { File, installFormatProxy, JimpCodec, loadFormatProxies, unInstallFormatProxies, unloadFormatProxies, loadOpencv, CanvasCodec } from '../src'
import { loadMirada, createCanvas } from './testUtil'
import fileType = require('file-type')
import Jimp from 'jimp'
import { sleep } from 'misc-utils-of-mine-generic';

test.serial('write/read jimp codec', async t => {
  console.log('write/read jimp codec 1');  
  unInstallFormatProxies()
  unloadFormatProxies()
  await installFormatProxy(() => new JimpCodec(Jimp))
  await loadFormatProxies()
  await loadOpencv()
  const file = await File.fromFile('test/assets/shape.jpg')
  var img = file.asMat()
  t.deepEqual([img.cols, img.rows, img.data.byteLength], [125, 146, 73000])
  await file.write('tmpJimp1.jpg')
  t.deepEqual(Jimp.distance(await Jimp.read('tmpJimp1.jpg'), await Jimp.read('test/assets/shape.jpg')), 0)
  let dst = new cv!.Mat()
  let M = cv.Mat.ones(5, 5, cv.CV_8U)
  let anchor = new cv.Point(-1, -1)
  cv.dilate(img, dst, M, anchor, 1, cv.BORDER_CONSTANT, cv.morphologyDefaultBorderValue())
  await File.fromMat(dst).write('tmpJimp2.jpg')
  img.delete()
  M.delete()
  dst.delete()
  t.deepEqual(Jimp.distance(await Jimp.read('tmpJimp2.jpg'), await Jimp.read('test/assets/shape.jpg')), 0.125)
  t.deepEqual(Jimp.distance(await Jimp.read('tmpJimp1.jpg'), await Jimp.read('tmpJimp2.jpg')), 0.125)
  t.deepEqual(Jimp.distance(await Jimp.read('tmpJimp2.jpg'), await Jimp.read('test/assets/shape4.jpg')), 0)
  console.log('write/read jimp codec 1');  
})

// test('write/read canvas codec', async t => {
//   unInstallFormatProxies()
//   unloadFormatProxies()
//   await installFormatProxy(() => new CanvasCodec())
//   await loadFormatProxies()
//   await loadOpencv()
//   const file = await File.fromFile('test/assets/shape.jpg')
//   const el = createCanvas()
//   cv.imshow(el , file.asMat())
//   var img = file.asMat()
//   t.deepEqual([img.cols, img.rows, img.data.byteLength], [125, 146, 73000])
//   await file.write('tmpJimp1.jpg')
//   t.deepEqual(Jimp.distance(await Jimp.read('tmpJimp1.jpg'), await Jimp.read('test/assets/shape.jpg')), 0)
//   let dst = new cv!.Mat()
//   let M = cv.Mat.ones(5, 5, cv.CV_8U)
//   let anchor = new cv.Point(-1, -1)
//   cv.dilate(img, dst, M, anchor, 1, cv.BORDER_CONSTANT, cv.morphologyDefaultBorderValue())
//   await File.fromMat(dst).write('tmpJimp2.jpg')
//   img.delete()
//   M.delete()
//   dst.delete()
//   t.deepEqual(Jimp.distance(await Jimp.read('tmpJimp2.jpg'), await Jimp.read('test/assets/shape.jpg')), 0.125)
//   t.deepEqual(Jimp.distance(await Jimp.read('tmpJimp1.jpg'), await Jimp.read('tmpJimp2.jpg')), 0.125)
//   t.deepEqual(Jimp.distance(await Jimp.read('tmpJimp2.jpg'), await Jimp.read('test/assets/shape4.jpg')), 0)
// })