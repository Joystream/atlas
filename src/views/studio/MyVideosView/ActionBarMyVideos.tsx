import React from 'react'
import { Checkbox, Button } from '@/shared/components'
import ActionBar, { ActionBarProps } from '../../../shared/components/ActionBar/ActionBar'
import styled from '@emotion/styled'
import { sizes } from '@/shared/theme'

export type ActionBarMyVideosProps = {
  fee: number
  videosSelectedCount: number
  onDelete: () => void
  onCancel: () => void
  onDeselect: () => void
} & Omit<ActionBarProps, 'primaryText' | 'secondaryText'>

const ActionBarMyVideos: React.FC<ActionBarMyVideosProps> = ({
  fee,
  videosSelectedCount,
  primaryButtonText,
  onCancel,
  onDeselect,
  onDelete,
  ...actionBarArgs
}) => {
  return (
    <ActionBar
      {...actionBarArgs}
      renderInfo={
        <InfoContainer onClick={onDeselect}>
          <Checkbox value indeterminate />
          {videosSelectedCount} Video{videosSelectedCount > 1 && 's'} Selected
        </InfoContainer>
      }
      renderButtons={
        <div>
          <Button icon="trash" variant="tertiary" onClick={onDelete}>
            Delete ({fee ? `${fee}JOY` : 'No Fee'})
          </Button>
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      }
    />
  )
}

export default ActionBarMyVideos

const InfoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${sizes(4)};
  cursor: pointer;
`
