/** @jsxImportSource @emotion/react */
import { css, jsx } from '@emotion/react'
import useMouse from '@react-hook/mouse-position'
import React, { useEffect, useRef, useState } from 'react'
import { animated, useSpring } from 'react-spring'
import useResizeObserver from 'use-resize-observer'

import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { VideoThumbnail, VideoThumbnailProps } from '@/components/_video/VideoThumbnail'
import { useHover } from '@/hooks/useHover'
import { useMsTimestamp } from '@/hooks/useMsTimestamp'

import { Member, Members } from './Members'
import { Container, Content, Details, Separator, Title } from './NftCard.styles'

export type NftCardProps = {
  title?: string | null
  loading?: boolean
  thumbnail: VideoThumbnailProps
  creator: Member
  supporters?: Member[]
  owner: Member
  fullWidth?: boolean
}

const calcX = (y: number) => -(y - window.innerHeight / 2) / 20
const calcY = (x: number) => (x - window.innerWidth / 2) / 20

export const NftCard: React.FC<NftCardProps> = ({
  title,
  creator,
  supporters,
  owner,
  thumbnail,
  fullWidth,
  loading,
}) => {
  const ref = useRef<HTMLDivElement>(null)
  // const [hovered, setHovered] = useState(false)
  const { width = 1, height = 1 } = useResizeObserver({ ref: ref, box: 'border-box' })
  // const [mousePos, setMousePos] = useState<[number, number]>([1, 1])

  const mouse = useMouse(ref, {
    // fps: 60,
    fps: 10,
  })
  const pos = [mouse.x || 0, mouse.y || 0]
  const left = pos[0]
  const top = pos[1]

  // const pos = mousePos
  // math for mouse position

  const px = Math.abs(Math.floor((100 / width) * left) - 100)
  const py = Math.abs(Math.floor((100 / height) * top) - 100)
  const pa = 50 - px + (50 - py)
  // math for gradient / background positions
  const lp = 50 + (px - 50) / 1.5
  const rp = 50 - (px - 50) / 1.5
  const tp = 50 + (py - 50) / 1.5
  const px_hueshift = 50 + (px - 50) / 10
  const py_hueshift = 50 + (py - 50) / 10
  const px_spark = 50 + (px - 50) / 7
  const py_spark = 50 + (py - 50) / 7
  const p_opc = 30 + Math.abs(pa) * 1.5
  const transformY = ((tp - 50) / 2) * -1
  const transformX = ((lp - 50) / 1.5) * 0.75
  // css to apply for active card
  // css to apply for active card
  const gradPos = `${rp}% ${tp}%`
  const patternPos = `${px_spark}% ${tp}%`
  const sparkPos = `${px_hueshift + py_hueshift}rad`
  const opacity = p_opc / 100
  // need to use a <style> tag for psuedo elements

  const { rotateX, rotateY } = useSpring({
    from: { rotateX: 0, rotateY: 0 },
    to: {
      rotateX: mouse.isOver ? transformY : 0,
      rotateY: mouse.isOver ? transformX : 0,
    },
    config: { mass: 5, tension: 350, friction: 40 },
  })

  console.log({ opacity, left, px, py, pa, width, p_opc })

  // TODO: ask adam about mask images as black opacity only
  return (
    <Container
      ref={ref}
      fullWidth={fullWidth}
      style={{ transform: `rotateX(${rotateX.get()}deg) rotateY(${rotateY.get()}deg) perspective(500px)` }}
      gradientPos={gradPos}
      sparkPos={sparkPos}
      patternPos={patternPos}
      opacity={opacity}
    >
      <animated.div
        css={css`
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          top: 0;
          background-repeat: no-repeat;
          opacity: 0.5;
          mix-blend-mode: color-dodge;
          transition: all 0.33s ease;

          /* pattern */
          background-image: url('https://i.imgur.com/Y9uPQ9n.png');
          background-position: 50% 50%;
          background-size: 135%;
          background-blend-mode: overlay;
          z-index: 20;
          filter: brightness(1) contrast(1) hue-rotate(${sparkPos});
          transition: all 0.33s ease;

          /* mix-blend-mode: color-dodge; */
          opacity: 0;
          mask-image: linear-gradient(
            90deg,
            rgb(0 0 0 / 1) 0%,
            rgb(0 0 0 / 0.1) 35%,
            rgb(0 0 0 / 0) 50%,
            rgb(0 0 0 / 0.1) 65%,
            rgb(0 0 0 / 1) 100%
          );
          mask-mode: alpha;
          mask-repeat: no-repeat;
          mask-size: 200%;

          &:hover {
            filter: brightness(0.751) contrast(1);
            opacity: ${opacity};
            mask-position: ${gradPos};
            transition: none;
          }
        `}
      />
      <VideoThumbnail clickable={false} {...thumbnail} />
      <Details>
        {loading ? <SkeletonLoader width="70%" height={24} bottomSpace={24} /> : <Title variant="h400">{title}</Title>}
        <Content>
          <Members loading={loading} caption="Creator" members={creator} />
          {supporters && !!supporters.length && (
            <div>
              <Members caption="Supporters" members={supporters} />
              <Separator />
            </div>
          )}
          <Members loading={loading} caption="Owner" members={owner} />
        </Content>
      </Details>

      {/* after */}
      <animated.div
        css={css`
          --color1: #efb2fb;
          --color2: #acc6f8;

          content: '';
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          top: 0;
          background-repeat: no-repeat;
          opacity: 0.5;
          mix-blend-mode: color-dodge;
          transition: all 0.33s ease;
          background-position: 50% 50%;
          background-size: 300% 300%;

          /* background-image: linear-gradient(
            115deg,
            transparent 0%,
            var(--color1) 25%,
            transparent 47%,
            transparent 53%,
            var(--color2) 75%,
            transparent 100%
          ); */
          background-image: url('https://i.imgur.com/AjBArhU.png');
          opacity: 0.15;
          filter: brightness(0.5) contrast(1);
          z-index: 1;

          /* mask-image: linear-gradient(110deg, transparent 25%, var(--color1) 48%, var(--color2) 52%, transparent 75%);
          mask-mode: alpha;
          mask-repeat: no-repeat;
          mask-size: 200%; */

          &:hover {
            animation: none;
            background-image: linear-gradient(
              110deg,
              transparent 25%,
              var(--color1) 48%,
              var(--color2) 52%,
              transparent 75%
            );
            background-size: 700% 700%;
            opacity: 1;
            filter: brightness(0.68) contrast(0.795) hue-rotate(${sparkPos});
            transition: none;
            background-position: ${patternPos};

            /* mask-position: ${gradPos}; */
          }
        `}
      />
    </Container>
  )
}
