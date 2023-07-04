import { FC, ImgHTMLAttributes, ReactNode } from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { useGetAssetUrl } from '@/hooks/useGetAssetUrl'
import { cVar, transitions } from '@/styles'

export type AssetImageProps = {
  isLoading?: boolean
  resolvedUrls: string[] | undefined | null
  imagePlaceholder?: ReactNode
} & Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'>

export const AssetImage: FC<AssetImageProps> = ({ resolvedUrls, isLoading, imagePlaceholder, ...imgProps }) => {
  const { url, isLoading: isResolving } = useGetAssetUrl(resolvedUrls, 'image')

  const loading = isLoading || isResolving

  return (
    <SwitchTransition>
      <CSSTransition
        key={String(loading)}
        timeout={parseInt(cVar('animationTimingFast', true))}
        classNames={transitions.names.fade}
      >
        {loading ? (
          <SkeletonLoader className={imgProps.className} />
        ) : imagePlaceholder && !url ? (
          <>{imagePlaceholder}</>
        ) : (
          <img {...imgProps} src={url} />
        )}
      </CSSTransition>
    </SwitchTransition>
  )
}
