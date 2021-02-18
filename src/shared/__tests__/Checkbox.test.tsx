import React from 'react'
import { mount } from 'enzyme'
import Checkbox from '@/shared/components/Checkbox'

describe('Checkbox component', () => {
  it('Should render Checkbox correctly', () => {
    expect(mount(<Checkbox value={true}></Checkbox>)).toBeDefined()
  })
})
