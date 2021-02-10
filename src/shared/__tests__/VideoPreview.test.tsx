import React from 'react'
import { mount } from 'enzyme'
import { VideoPreviewBase } from '@/shared/components/VideoPreviewBase'

describe('VideoPreviewBase component', () => {
  ;(global as any).ResizeObserver = class {
    disconnect() {}
    observe(element: any, initObject: any) {}
  }
  it('Should render Video Preview correctly', () => {
    expect(
      mount(
        <VideoPreviewBase
          title="Some Video Title"
          channelHandle="some channel"
          thumbnailUrl=""
          views={1000}
          createdAt={new Date()}
        />
      )
    ).toBeDefined()
  })
})
