import { ChangeEvent, ChangeEventHandler, FC, useRef } from 'react'

import { ListItemProps } from '@/components/ListItem'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { SvgActionDownload, SvgActionMore, SvgActionTrash } from '@/components/_icons'
import { ContextMenu } from '@/components/_overlays/ContextMenu'
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
  onDownload?: () => void
} & SubtitlesInput

export const SubtitlesBox: FC<SubtitleBoxProps> = ({
  className,
  languageIso,
  type,
  file,
  assetId,
  onChange,
  onRemove,
  onDownload,
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [openUnsuportedFileDialog, closeUnsuportedFileDialog] = useConfirmationModal()
  const hasFile = !!file || !!assetId
  const contexMenuItems: ListItemProps[] = [
    // TODO: allow downloading already published subtitles
    ...(file
      ? [
          {
            label: 'Download file',
            onClick: onDownload,
            externalLink: {
              href: URL.createObjectURL(file),
              download: file.name,
            },
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
          {languageIso} {type === 'closed-captions' ? '(CC)' : ''}
        </Text>
        <SubtitlesFileName variant="t100" as="p" color="colorText">
          {!hasFile ? 'Add subtitles file' : file ? file.name : 'subs.vtt'}
        </SubtitlesFileName>
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
