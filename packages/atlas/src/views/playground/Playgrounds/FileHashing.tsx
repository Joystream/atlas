import { formatDuration, intervalToDuration } from 'date-fns'
import React, { useState } from 'react'

import { computeFileHash } from '@/utils/hashing'

export const FileHashing: React.FC = () => {
  const [computedHash, setComputedHash] = useState('')
  const [duration, setDuration] = useState('')
  const [file, setFile] = useState<File | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) {
      return
    }
    setFile(file)
  }

  const handleCompute = async () => {
    if (!file || computedHash === 'computing') {
      return
    }
    setComputedHash('computing')
    setDuration('')
    const start = new Date()
    const hash = await computeFileHash(file)
    setComputedHash(hash)

    const end = new Date()
    const formattedDuration = formatDuration(
      intervalToDuration({
        start,
        end,
      })
    )
    setDuration(formattedDuration)
  }

  return (
    <div>
      <input type="file" accept="*" onChange={handleFileChange} />
      <button onClick={handleCompute}>Test</button>
      {computedHash && <div>{computedHash}</div>}
      {duration && <div>{duration}</div>}
    </div>
  )
}
