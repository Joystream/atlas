import { css } from '@emotion/core'
import { transitions, sizes } from '@/shared/theme'
import { TitleSection, VideoSection } from '@/views/ChannelView/ChannelView.style'
import { InfoContainer } from '@/views/VideoView/VideoView.style'
import { Container as HomeViewContainer } from '@/views/HomeView'
import { Container as ChannelsViewContainer } from '@/views/VideosView/VideosView.style'

export const routingTransitions = css`
  .${transitions.names.fadeAndSlide}-enter {
    opacity: 0;

    & ${InfoContainer}, ${TitleSection}, ${VideoSection}, ${HomeViewContainer}, ${ChannelsViewContainer} {
      transform: translateY(${sizes(8)});
    }
  }

  .${transitions.names.fadeAndSlide}-enter-active {
    opacity: 1;

    & ${InfoContainer}, ${TitleSection}, ${VideoSection}, ${HomeViewContainer}, ${ChannelsViewContainer} {
      transform: translateY(0);
      transition: ${transitions.timings.loading} ${transitions.easing};
    }
  }

  .${transitions.names.fadeAndSlide}-exit {
    opacity: 1;
  }

  .${transitions.names.fadeAndSlide}-exit-active {
    opacity: 0;
  }

  .${transitions.names.fadeAndSlide}-enter-active, .${transitions.names.fadeAndSlide}-exit-active {
    transition: ${transitions.timings.loading} ${transitions.easing};
  }
`
