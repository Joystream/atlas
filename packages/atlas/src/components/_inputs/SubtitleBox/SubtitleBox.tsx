import { ChangeEvent, ChangeEventHandler, FC, useRef } from 'react'

import { ListItemProps } from '@/components/ListItem'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { SvgActionDownload, SvgActionMore, SvgActionTrash } from '@/components/_icons'
import { ContextMenu } from '@/components/_overlays/ContextMenu'
import { useConfirmationModal } from '@/providers/confirmationModal'

import {
  InvisibleInput,
  StyledSvgActionCheck,
  SubtitleBoxWrapper,
  SubtitleDetails,
  SubtitlesFileName,
} from './SubtitleBox.styles'

export type Subtitles = {
  language: string
  type: 'closed-captions' | 'subtitles'
  file?: File
}

export type SubtitleBoxProps = {
  className?: string
  onChange?: ChangeEventHandler<HTMLInputElement>
  onRemove?: () => void
  onDownload?: () => void
} & Subtitles

export const SubtitleBox: FC<SubtitleBoxProps> = ({
  className,
  language,
  type,
  file,
  onChange,
  onRemove,
  onDownload,
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [openUnsuportedFileDialog, closeUnsuportedFileDialog] = useConfirmationModal()
  const contexMenuItems: ListItemProps[] = [
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

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.files?.[0]?.type !== 'text/vtt') {
      openUnsuportedFileDialog({
        title: 'File format unsupported',
        description:
          'It looks like you selected a file format which is not supported. Reselect file and choose .webvtt file to proceed.',
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
          {language} {type === 'closed-captions' ? '(CC)' : ''}
        </Text>
        <SubtitlesFileName variant="t100" as="p" color="colorText">
          {file ? file.name : 'Add subtitles file'}
        </SubtitlesFileName>
        {file ? <StyledSvgActionCheck /> : null}
      </SubtitleDetails>
      <Button size="small" onClick={() => inputRef.current?.click()} variant={file ? 'secondary' : 'primary'}>
        Select file
      </Button>
      <InvisibleInput ref={inputRef} type="file" accept=".vtt" onChange={handleChange} />
      <ContextMenu
        placement="bottom-end"
        items={contexMenuItems}
        trigger={<Button icon={<SvgActionMore />} variant="tertiary" size="small" />}
      />
    </SubtitleBoxWrapper>
  )
}
