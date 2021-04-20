import { useUploadsManager } from '@/hooks'
import React from 'react'

const UploadsManager = () => {
  const { uploads } = useUploadsManager()
  return <div>Uploads manager</div>
}

export default UploadsManager
