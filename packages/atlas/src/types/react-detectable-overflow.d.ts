/// <reference types="react" />

declare module 'react-detectable-overflow' {
  function useOverflowDetector<T = HTMLElement>(
    props: useOverflowDetectorProps
  ): {
    overflow: boolean
    // @ts-ignore not important
    ref: import('react').MutableRefObject<T | null>
  }
}
