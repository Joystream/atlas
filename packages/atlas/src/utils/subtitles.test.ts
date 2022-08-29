import { convertSrtFileToString, convertSrtStringToVttString, convertSrtToVtt } from './subtitles'

const srtTextExample = `
1
00:05:00,400 --> 00:05:15,300
This is an example of a subtitle.
This is second line of a subtitle.

2
00:05:16,400 --> 00:05:25,300
This is an example of a subtitle - 2nd subtitle.
`

const vttTextExample = `WEBVTT


1
00:05:00.400 --> 00:05:15.300
This is an example of a subtitle.
This is second line of a subtitle.

2
00:05:16.400 --> 00:05:25.300
This is an example of a subtitle - 2nd subtitle.


`
  .split('\n')
  .join('\r\n')

let srtBlob: Blob
let srtFile: File
let pdfFile: File
let vttBlob: Blob
let vttFile: File

beforeEach(() => {
  srtBlob = new Blob([srtTextExample], { type: 'text/plain' })
  srtFile = new File([srtBlob], 'file.srt')
  pdfFile = new File([srtBlob], 'file.pdf')

  vttBlob = new Blob([vttTextExample])
  vttFile = new File([vttBlob], 'file.vtt', { type: 'text/vtt' })
})

describe('convertSrtFileToString', () => {
  it('should return a promise', () => {
    expect(convertSrtFileToString(srtFile)).toBeInstanceOf(Promise)
  })
  it('should convert srt file to string once resolved', async () => {
    const result = await convertSrtFileToString(srtFile)
    expect(typeof result).toEqual('string')
  })
  it('should throw error for file with wrong format', async () => {
    await expect(convertSrtFileToString(pdfFile)).rejects.toThrowError('File is not srt file')
  })
})

describe('convertSrtStringToVttString', () => {
  it('should add leading text at the top of the file', () => {
    expect(convertSrtStringToVttString(srtTextExample).split('\r\n')[0]).toEqual('WEBVTT')
  })
  it('should correctly convert subtitles to vtt format', () => {
    expect(convertSrtStringToVttString(srtTextExample)).toEqual(vttTextExample)
  })
})

describe('convertSrtToVtt', () => {
  it('should return a promise', () => {
    expect(convertSrtToVtt(srtFile)).toBeInstanceOf(Promise)
  })
  it('should have the same file name, but different extension', async () => {
    expect((await convertSrtToVtt(srtFile)).name).toBe(vttFile.name)
  })
  it('should have a type text/vtt', async () => {
    expect((await convertSrtToVtt(srtFile)).type).toBe(vttFile.type)
  })
  it('should return instance of file once resolved', async () => {
    expect(await convertSrtToVtt(srtFile)).toBeInstanceOf(File)
  })
})
