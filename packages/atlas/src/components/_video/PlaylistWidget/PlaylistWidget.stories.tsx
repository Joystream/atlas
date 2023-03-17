import { Meta, StoryFn } from '@storybook/react'
import { BrowserRouter } from 'react-router-dom'

import { PlaylistWidget, PlaylistWidgetProps } from './PlaylistWidget'

const dummyVideos: PlaylistWidgetProps['playlistVideos'] = [
  { title: 'buy mile him', duration: 3560, id: '1' },
  { title: 'quietly tried tail,', duration: 642, id: '2' },
  { title: 'door highest take', duration: 3775, id: '3' },
  { title: 'church camera back', duration: 3531, id: '4' },
  { title: 'settle practical separate', duration: 487, id: '5' },
  { title: 'bicycle mind slept', duration: 167, id: '6' },
  { title: 'small lost bean', duration: 3225, id: '7' },
  { title: 'customs minerals giving.', duration: 3266, id: '8' },
  { title: 'different follow stop', duration: 3842, id: '9' },
  { title: 'discover gain double', duration: 2770, id: '10' },
  { title: 'handle even thumb', duration: 3952, id: '11' },
  { title: 'arrangement tail against', duration: 3599, id: '12' },
  { title: 'detail wait explore', duration: 51, id: '13' },
  { title: 'positive brief structure.', duration: 1275, id: '14' },
  { title: 'expect broken known', duration: 661, id: '15' },
  { title: 'burst aboard aware', duration: 1320, id: '16' },
  { title: 'floor mix size', duration: 3679, id: '17' },
  { title: 'during flight minute', duration: 1287, id: '18' },
  { title: 'globe related powerful', duration: 985, id: '19' },
  { title: 'lift win death!', duration: 2472, id: '20' },
]

export default {
  title: 'video/PlaylistWidget',
  component: PlaylistWidget,
  args: {
    channelId: '2',
    playlistTitle: 'Dummy playlist',
    channelTitle: 'Dummy channel',
    playlistLength: 20,
    currentVideoNumber: 1,
    playlistVideos: dummyVideos,
  },
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
} as Meta<PlaylistWidgetProps>

const Template: StoryFn<PlaylistWidgetProps> = (args) => {
  return <PlaylistWidget {...args} />
}

export const Default = Template.bind({})
