import { FC } from 'react'

import { useMediaMatch } from '@/hooks/useMediaMatch'

import { Pill } from '../Pill'
import { PillProps } from '../Pill/types'
import { Text } from '../Text'
import { ButtonProps, TextButton } from '../_buttons/Button'
import { SvgActionChevronR } from '../_icons'

export type ContentCardProps = {
  pill?: Exclude<PillProps, 'size' | 'variant'>
  button?: Exclude<ButtonProps, 'variant' | 'size' | 'icon' | 'iconPlacement'>
  subtitle: string
  title: string
  body: string
  className?: string
}
export const ContentCard: FC<ContentCardProps> = ({ title, subtitle, body, pill, button, className }) => {
  const mdMatch = useMediaMatch('md')
  return (
    <div className={className}>
      <header>
        {pill && <Pill {...pill} size="medium" variant="default" />}
        <Text as="p" variant="h100" margin={{ top: pill && 4 }} color="colorTextPrimary">
          {subtitle}
        </Text>
        <Text as="h2" variant={mdMatch ? 'h600' : 'h500'} margin={{ top: 2 }}>
          {title}
        </Text>
      </header>
      <Text as="p" variant="t300" margin={{ top: 4, bottom: button && 4 }} color="colorText">
        {body}
      </Text>
      {button && (
        <TextButton {...button} variant="primary" size="large" icon={<SvgActionChevronR />} iconPlacement="right" />
      )}
    </div>
  )
}
