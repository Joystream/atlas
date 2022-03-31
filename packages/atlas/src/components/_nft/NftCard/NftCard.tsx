import React, { useRef, useState } from 'react'
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

export const NftCard: React.FC<NftCardProps> = ({
  title,
  creator,
  supporters,
  owner,
  thumbnail,
  fullWidth,
  loading,
}) => {
  const [ref, isHovered] = useHover<HTMLDivElement>()
  // const [hovered, setHovered] = useState(false)
  const { width = 1, height = 1 } = useResizeObserver({ ref: ref, box: 'border-box' })
  const [mousePos, setMousePos] = useState<[number, number]>([1, 1])

  const pos = mousePos
  // math for mouse position
  const left = pos[0]
  const top = pos[1]

  const px = Math.abs(Math.floor((100 / width) * left) - 100)
  const py = Math.abs(Math.floor((100 / height) * top) - 100)
  const pa = 50 - px + (50 - py)
  // math for gradient / background positions
  const lp = 50 + (px - 50) / 1.5
  const tp = 50 + (py - 50) / 1.5
  const px_spark = 50 + (px - 50) / 7
  const py_spark = 50 + (py - 50) / 7
  const p_opc = 20 + Math.abs(pa) * 1.5
  const transformY = ((tp - 50) / 2) * -1
  const transformX = ((lp - 50) / 1.5) * 0.5
  // css to apply for active card
  const grad_pos = `${lp}% ${tp}%`
  const spark_pos = `${px_spark}% ${py_spark}%`
  const opacity = p_opc / 100
  // need to use a <style> tag for psuedo elements
  const style = `
      .card:hover:before { ${grad_pos} }  /* gradient */
      .card:hover:after { ${spark_pos} ${opacity} }   /* sparkles */ 
    `

  // console.log({ opacity })

  return (
    <Container
      ref={ref}
      fullWidth={fullWidth}
      style={{ transform: isHovered ? `rotateX(${transformY}deg) rotateY(${transformX}deg) ` : undefined }}
      gradientPos={grad_pos}
      sparkPos={spark_pos}
      opacity={opacity}
      onMouseLeave={() => setMousePos([0, 0])}
      onMouseMove={(e) => {
        setMousePos([e.nativeEvent.offsetX, e.nativeEvent.offsetY])
      }}
    >
      <VideoThumbnail clickable={false} {...thumbnail} />
      <Details>
        {loading ? <SkeletonLoader width="70%" height={24} bottomSpace={24} /> : <Title variant="h400">{title}</Title>}
        <Content>
          <Members loading={loading} caption="Creator" members={creator} />
          {supporters && !!supporters.length && (
            <>
              <Members caption="Supporters" members={supporters} />
              <Separator />
            </>
          )}
          <Members loading={loading} caption="Owner" members={owner} />
        </Content>
      </Details>
    </Container>
  )
}
