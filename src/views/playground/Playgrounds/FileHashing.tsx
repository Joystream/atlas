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

  const handleCompute = async (chunkSize: number) => {
    if (!file || computedHash === 'computing') {
      return
    }
    setComputedHash('computing')
    setDuration('')
    const start = new Date()
    const hash = await computeFileHash(file, chunkSize)
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
      <button onClick={() => handleCompute(64 * 1024)}>Test 64K</button>
      <button onClick={() => handleCompute(512 * 1024)}>Test 512K</button>
      <button onClick={() => handleCompute(32 * 1024 * 1024)}>Test 32M</button>
      <button onClick={() => handleCompute(64 * 1024 * 1024)}>Test 64M</button>
      <button onClick={() => handleCompute(128 * 1024 * 1024)}>Test 128M</button>
      <button onClick={() => handleCompute(512 * 1024 * 1024)}>Test 512M</button>
      {computedHash && <div>{computedHash}</div>}
      {duration && <div>{duration}</div>}
    </div>
  )
}
