import { useContext } from 'react'

import { SegmentAnalyticsContext } from './segment.provider'

const useSegmentAnalyticsContext = () => useContext(SegmentAnalyticsContext)

export default useSegmentAnalyticsContext
