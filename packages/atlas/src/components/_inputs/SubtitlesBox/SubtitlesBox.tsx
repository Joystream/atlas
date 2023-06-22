import axios from 'axios'
import { ChangeEvent, ChangeEventHandler, FC, useRef } from 'react'
import { useMutation } from 'react-query'

import { SvgActionDownload, SvgActionMore, SvgActionTrash } from '@/assets/icons'
import { ListItemProps } from '@/components/ListItem'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { ContextMenu } from '@/components/_overlays/ContextMenu'
import { atlasConfig } from '@/config'
import { useConfirmationModal } from '@/providers/confirmationModal'
import { SubtitlesInput } from '@/types/subtitles'

import {
  InvisibleInput,
  StyledSvgActionCheck,
  SubtitleBoxWrapper,
  SubtitleDetails,
  SubtitlesFileName,
} from './SubtitlesBox.styles'

export type SubtitleBoxProps = {
  className?: string
  onChange?: ChangeEventHandler<HTMLInputElement>
  onRemove?: () => void
} & SubtitlesInput

export const SubtitlesBox: FC<SubtitleBoxProps> = ({
  className,
  languageIso,
  type,
  file,
  isUploadedAsSrt,
  id,
  onChange,
  onRemove,
  asset,
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [openUnsuportedFileDialog, closeUnsuportedFileDialog] = useConfirmationModal()
  const hasFile = !!file || !!id
  const { mutateAsync: subtitlesFetch } = useMutation('subtitles-fetch', (url: string) =>
    axios.get(url, { responseType: 'blob' })
  )

  const url = asset?.resolvedUrls

  const handleDownload = async (url = '') => {
    const response = await subtitlesFetch(url)
    const objectURL = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = objectURL
    link.setAttribute('download', `${id}-${languageIso.toLowerCase()}.vtt`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const contexMenuItems: ListItemProps[] = [
    ...(file || url
      ? [
          {
            label: 'Download file',
            onClick: () => url && handleDownload(url[0]),
            externalLink: file
              ? {
                  href: URL.createObjectURL(file),
                  download: file.name,
                }
              : undefined,
            nodeStart: <SvgActionDownload />,
          },
        ]
      : []),
    {
      label: 'Remove subtitles',
      destructive: true,
      onClick: onRemove,
      nodeStart: <SvgActionTrash />,
    },
  ]

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0]
    if (!file) {
      return
    }
    const isSupported = file.name.match(/\.(vtt|srt)$/) || file?.type === 'text/vtt'

    if (!isSupported) {
      openUnsuportedFileDialog({
        title: 'File format unsupported',
        description:
          'It looks like you selected a file format which is not supported. Reselect file and choose .vtt or .srt file to proceed.',
        type: 'informative',
        primaryButton: {
          onClick: () => {
            inputRef.current?.click()
            closeUnsuportedFileDialog()
          },
          text: 'Select another file',
        },
        secondaryButton: {
          text: 'Cancel',
          onClick: () => {
            closeUnsuportedFileDialog()
          },
        },
      })
      return
    }
    onChange?.(e)
  }
  return (
    <SubtitleBoxWrapper className={className}>
      <SubtitleDetails>
        <Text variant="t100-strong" as="p">
          {atlasConfig.derived.languagesLookup[languageIso]} {type === 'closed-captions' ? '(CC)' : ''}
        </Text>
        {!hasFile && (
          <SubtitlesFileName variant="t100" as="p" color="colorText">
            Add subtitles file
          </SubtitlesFileName>
        )}
        {file && (
          <SubtitlesFileName variant="t100" as="p" color="colorText">
            {isUploadedAsSrt ? file.name.replace('.vtt', '.srt') : file.name}
          </SubtitlesFileName>
        )}
        {hasFile ? <StyledSvgActionCheck /> : null}
      </SubtitleDetails>
      <Button size="small" onClick={() => inputRef.current?.click()} variant={hasFile ? 'secondary' : 'primary'}>
        Select file
      </Button>
      <InvisibleInput ref={inputRef} type="file" accept=".vtt,.srt" onChange={handleChange} />
      <ContextMenu
        placement="bottom-end"
        items={contexMenuItems}
        trigger={<Button icon={<SvgActionMore />} variant="tertiary" size="small" />}
      />
    </SubtitleBoxWrapper>
  )
}
