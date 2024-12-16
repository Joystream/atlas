import { useState } from 'react'
import useResizeObserver from 'use-resize-observer'

import { CommentTipTier } from '@/api/queries/__generated__/baseTypes.generated'
import { FullVideoFieldsFragment } from '@/api/queries/__generated__/fragments.generated'
import { Avatar } from '@/components/Avatar'
import { FlexBox } from '@/components/FlexBox'
import { Text } from '@/components/Text'
import { AvatarContainer } from '@/components/_comments/Comment/Comment.styles'
import { CommentTierBadge, getTierIcon } from '@/components/_comments/Comment/CommentTierBadge'
import { FormField } from '@/components/_inputs/FormField'
import { DialogModal } from '@/components/_overlays/DialogModal'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useReactionTransactions } from '@/hooks/useReactionTransactions'
import { tokenNumberToHapiBn } from '@/joystream-lib/utils'
import { getMemberAvatar } from '@/providers/assets/assets.helpers'
import { useFee, useSubscribeAccountBalance } from '@/providers/joystream'
import { useUser } from '@/providers/user/user.hooks'
import { formatNumber } from '@/utils/number'

import {
  ButtonGroup,
  CommentBody,
  CommentHeader,
  CommentHeaderDot,
  CommentTemplateWrapper,
  CustomPlaceholder,
  StyledTextArea,
  TextAreaContainer,
  TextAreaWrapper,
  ToggleButton,
} from './SupportChannelModal.styles'

export type SupportChannelModalProps = {
  video: FullVideoFieldsFragment
  show: boolean
  tipTierAmounts: { [k in CommentTipTier]: number }
  onClose: () => void
  onBuyJoy?: () => void
  onTxSign?: (newCommentId: string) => void
}

export const SupportChannelModal = ({
  video,
  show,
  tipTierAmounts,
  onClose,
  onBuyJoy,
  onTxSign,
}: SupportChannelModalProps) => {
  const [selectedTier, setSelectedTier] = useState<CommentTipTier>(CommentTipTier.Silver)
  const [commentBody, setCommentBody] = useState<string>('')
  const { addComment } = useReactionTransactions()
  const { memberId, isLoggedIn } = useUser()
  const selectedTipJoy = tipTierAmounts[selectedTier]
  const selectedTipHapi = tokenNumberToHapiBn(selectedTipJoy)
  const { fullFee: txFee, loading: feeLoading } = useFee(
    'createVideoCommentTx',
    isLoggedIn && memberId
      ? [memberId, video.id, commentBody, null, [video.channel.rewardAccount, selectedTipHapi.toString()]]
      : undefined
  )
  const { accountBalance, totalBalance } = useSubscribeAccountBalance()
  const xs = useMediaMatch('xs')

  const isBalanceInsufficient =
    !feeLoading &&
    !!accountBalance &&
    !!totalBalance &&
    (accountBalance.lt(selectedTipHapi) || totalBalance.lt(selectedTipHapi.add(txFee)))

  const handleSubmit = async () => {
    await addComment({
      videoId: video.id,
      commentBody,
      videoTitle: video.title,
      tip: {
        dest: video.channel.rewardAccount,
        amount: selectedTipHapi,
        tier: selectedTier,
      },
      optimisticOpts: {
        onTxSign: (newCommentId) => {
          setCommentBody('')
          setSelectedTier(CommentTipTier.Silver)
          onTxSign?.(newCommentId)
        },
      },
    })
  }

  const continueButtonText = feeLoading ? 'Loading' : 'Continue'
  const primaryButton =
    isBalanceInsufficient && onBuyJoy
      ? { text: 'Buy joy', onClick: onBuyJoy }
      : { text: continueButtonText, onClick: handleSubmit, disabled: isBalanceInsufficient || feeLoading }

  return (
    <DialogModal
      title={`Support ${video.channel.title}`}
      show={show}
      primaryButton={primaryButton}
      secondaryButton={{ text: 'Cancel', onClick: onClose }}
      onExitClick={onClose}
    >
      <FlexBox gap={8} flow="column">
        <Text as="p" variant={xs ? 't300' : 't200'}>
          Leave a tip and message to be featured in the comments section. Choose your tip amount.
        </Text>
        <FormField
          label="Leave a message"
          tooltip={{
            text: 'Your message will be displayed as a featured comment underneath the video.',
            placement: 'top',
          }}
        >
          <CommentTemplate
            tier={selectedTier}
            amountJoy={selectedTipJoy}
            value={commentBody}
            onChange={(e) => setCommentBody(e.target.value)}
          />
        </FormField>
        <FormField
          label="Choose support amount"
          error={isBalanceInsufficient ? `Insufficient balance.${onBuyJoy ? ` Buy JOY to continue.` : ``}` : undefined}
          disableErrorAnimation
          tooltip={{
            text: 'The amount of JOY you decide to tip will determine how prominently your comment will be featured.',
            placement: 'top',
          }}
        >
          <ToggleTipButtonGroup
            onChange={(v) => setSelectedTier(v)}
            options={Object.entries(tipTierAmounts).map(([tier, amountJoy]) => ({
              label: `${formatNumber(amountJoy)} JOY`,
              icon: tier === selectedTier ? getTierIcon(tier) : getTierIcon(tier as CommentTipTier, 'muted'),
              value: tier as CommentTipTier,
            }))}
            value={selectedTier}
          />
        </FormField>
      </FlexBox>
    </DialogModal>
  )
}

export type CommentTemplateProps = {
  tier: CommentTipTier
  amountJoy: number
  value: string
  onChange: React.ChangeEventHandler<HTMLTextAreaElement>
}

export const CommentTemplate = ({ tier, amountJoy, value, onChange }: CommentTemplateProps) => {
  const xs = useMediaMatch('xs')
  const [active, setActive] = useState(false)
  const { activeMembership, isLoggedIn } = useUser()
  const { urls: memberAvatarUrls, isLoadingAsset: isMemberAvatarLoading } = getMemberAvatar(activeMembership)
  const memberHandle = activeMembership?.handle
  const { ref: measureRef } = useResizeObserver({ box: 'border-box' })

  if (!isLoggedIn) {
    return null
  }

  return (
    <CommentTemplateWrapper>
      <AvatarContainer tier={tier}>
        <Avatar assetUrls={memberAvatarUrls} size={40} loading={isMemberAvatarLoading} />
      </AvatarContainer>
      <CommentBody>
        <CommentHeader>
          <Text as="span" variant="h200" margin={{ right: 2 }}>
            {memberHandle}
          </Text>
          <CommentHeaderDot />
          <CommentTierBadge tier={tier} amount={amountJoy} />
        </CommentHeader>
        <TextAreaContainer active={active} onFocus={() => setActive(true)} onBlur={() => setActive(false)}>
          <TextAreaWrapper>
            <StyledTextArea
              ref={measureRef}
              rows={1}
              onChange={onChange}
              value={value}
              placeholder={`Leave a comment as ${memberHandle ? memberHandle : '...'}`}
            />
            <CustomPlaceholder as="p" variant={xs ? 't200' : 't100'} color="colorText">
              Leave a comment as
              {memberHandle ? (
                <Text as="span" variant={xs ? 't200-strong' : 't100-strong'} color="inherit">
                  {' '}
                  {memberHandle}
                </Text>
              ) : (
                '...'
              )}
            </CustomPlaceholder>
          </TextAreaWrapper>
        </TextAreaContainer>
      </CommentBody>
    </CommentTemplateWrapper>
  )
}

type ToggleTipButtonOption<T> = {
  icon: JSX.Element | null
  label: string
  value: T
}

export type ToggleTipButtonGroupProps<T = string> = {
  options: ToggleTipButtonOption<T>[]
  value?: T
  disabled?: boolean
  onChange: (value: T) => void
}

export function ToggleTipButtonGroup<T = string>(props: ToggleTipButtonGroupProps<T>) {
  return (
    <ButtonGroup>
      {props.options.map((option, i) => (
        <ToggleButton
          key={i}
          fullWidth
          variant="secondary"
          onClick={() => props.onChange(option.value)}
          size="medium"
          active={option.value === props.value}
          disabled={props.disabled}
          icon={option.icon}
        >
          {option.label}
        </ToggleButton>
      ))}
    </ButtonGroup>
  )
}
