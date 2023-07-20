/// <reference types="react" />

declare module 'react-detectable-overflow' {
  function useOverflowDetector<T = HTMLElement>(
    props: useOverflowDetectorProps
  ): {
    overflow: boolean
    ref: import('react').MutableRefObject<T | null>
  }
}
