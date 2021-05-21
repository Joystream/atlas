import React from 'react'
import * as Icons from '../../icons'
import { camelCase } from 'lodash'

type IconType = Icons.IconType
export type IconProps = {
  name: IconType
} & React.SVGProps<SVGSVGElement>

const capitalize = (s: string) => s.slice(0, 1).toUpperCase() + s.slice(1)
const pascalCase = (s: string) => capitalize(camelCase(s))
const iconsList = Object.keys(Icons)

const Icon: React.FC<IconProps> = ({ name, ...svgProps }) => {
  const iconProp = pascalCase(name) as keyof typeof Icons
  if (!iconsList.includes(iconProp)) {
    console.warn(`Icon ${iconProp} is not a valid icon and will not render.`)
    return null
  }

  const IconComponent = Icons[iconProp]

  return <IconComponent {...svgProps} />
}

export default Icon
export type { IconType }
