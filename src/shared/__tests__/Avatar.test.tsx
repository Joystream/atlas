import React from 'react'
import { mount } from 'enzyme'
import Avatar from '@/shared/components/Avatar'
describe('Avatar component', () => {
  it('Should render avatar correctly', () => {
    expect(mount(<Avatar imageUrl="https://source.unsplash.com/WLUHO9A_xik/1600x900" />)).toBeDefined()
  })
})
