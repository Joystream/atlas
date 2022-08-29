export const convertSrtToVtt = async (srtFile: File): Promise<File> => {
  const subtitlesString = await new Promise<string>((resolve, reject) => {
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
  const converted = subtitlesString
    .replace(/\{\\([ibu])\}/g, '</$1>')
    .replace(/\{\\([ibu])1\}/g, '<$1>')
    .replace(/\{([ibu])\}/g, '<$1>')
    .replace(/\{\/([ibu])\}/g, '</$1>')
    .replace(/(\d\d:\d\d:\d\d),(\d\d\d)/g, '$1.$2')
    .concat('\r\n\r\n')
  const leadingText = 'WEBVTT\r\n\r\n'
  const vttText = leadingText.concat(converted)
  const blob = new Blob([vttText], { type: 'text/vtt' })
  const file = new File([blob], srtFile.name.replace('.srt', '.vtt'), { type: 'text/vtt' })
  return file
}
