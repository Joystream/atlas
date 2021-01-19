import React from 'react'
import { shallow } from 'enzyme'
import LayoutWithRouting from '../views/LayoutWithRouting'

describe('LayoutWithRouting component', () => {
  const component = shallow(<LayoutWithRouting />)

  it('Should render.', () => {
    expect(component).toBeDefined()
  })
})
