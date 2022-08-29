export const convertSrtFileToString = async (srtFile: File) => {
  const isSrtFile = srtFile.name.match(/\.srt$/)
  if (!isSrtFile) {
    throw new Error('File is not srt file')
  }
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    const onLoadEnd = (event: ProgressEvent<FileReader>) => {
      const result = event.target?.result
      reader.removeEventListener('loadend', onLoadEnd)
      if (typeof result === 'string') {
        resolve(result)
      } else {
        reject(new Error('Error during loading subtitles file, event.target.result is not a string'))
      }
    }

    const onError = () => {
      reader.removeEventListener('error', onError)
      reject(new Error('Srt file could not be converted to string'))
    }

    reader.addEventListener('loadend', onLoadEnd)
    reader.addEventListener('error', onError)
    reader.readAsText(srtFile)
  })
}

export const convertSrtStringToVttString = (srtString: string) => {
  const converted = srtString
    .replace(/\{\\([ibu])\}/g, '</$1>')
    .replace(/\{\\([ibu])1\}/g, '<$1>')
    .replace(/\{([ibu])\}/g, '<$1>')
    .replace(/\{\/([ibu])\}/g, '</$1>')
    .replace(/(\d\d:\d\d:\d\d),(\d\d\d)/g, '$1.$2')
    .concat('\r\n\r\n')
  const leadingText = 'WEBVTT\n\r\n'
  return leadingText
    .concat(converted)
    .split('\n')
    .map((line) => line.trim())
    .join('\r\n')
}

export const convertSrtToVtt = async (srtFile: File): Promise<File> => {
  const srtString = await convertSrtFileToString(srtFile)
  const vttString = convertSrtStringToVttString(srtString)
  const blob = new Blob([vttString], { type: 'text/vtt' })
  const file = new File([blob], srtFile.name.replace('.srt', '.vtt'), { type: 'text/vtt' })
  return file
}
