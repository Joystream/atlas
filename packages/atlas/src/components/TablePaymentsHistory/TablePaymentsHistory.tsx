import BN from 'bn.js'
import { FC, useEffect, useMemo, useRef, useState } from 'react'

import { useMemberships } from '@/api/hooks/membership'
import { SvgJoystreamLogoShort } from '@/assets/logos'
import { Avatar } from '@/components/Avatar'
import { Table, TableProps } from '@/components/Table'
import { Text } from '@/components/Text'
import { TextButton } from '@/components/_buttons/Button'
import { DialogModal } from '@/components/_overlays/DialogModal'
import { absoluteRoutes } from '@/config/routes'
import { useBlockTimeEstimation } from '@/hooks/useBlockTimeEstimation'
import { getMemberAvatar } from '@/providers/assets/assets.helpers'
import { SentryLogger } from '@/utils/logs'
import { shortenString } from '@/utils/misc'
import { formatNumber } from '@/utils/number'
import { formatDateTime } from '@/utils/time'

import {
  DialogText,
  JoyAmountWrapper,
  JoystreamSvgWrapper,
  SenderItem,
  StyledJoyTokenIcon,
  StyledLink,
  StyledNumberFormat,
  TextWrapper,
  TypeIconWrapper,
  TypeWrapper,
} from './TablePaymentsHistory.styles'
import {
  COLUMNS,
  PaymentType,
  paymentTypeMappings,
  tableEmptyState,
  tableLoadingData,
} from './TablePaymentsHistory.utils'

export type PaymentHistory = {
  type: PaymentType
  block: number
  date: Date
  sender: string
  amount: BN
  description?: string
}

export type TablePaymentsHistoryProps = {
  data: PaymentHistory[]
  isLoading: boolean
}

export const TablePaymentsHistory: FC<TablePaymentsHistoryProps> = ({ data, isLoading }) => {
  const [dialogText, setDialogText] = useState('')
  const mappedData: TableProps['data'] = useMemo(
    () =>
      data.map((data) => ({
        date: <Date date={data.date} />,
        type: <Type type={data.type} />,
        amount: <TokenAmount tokenAmount={data.amount} />,
        sender: <Sender sender={data.sender} />,
        description: (
          <TableText onShowMoreClick={() => setDialogText(data.description ?? '')} text={data.description} />
        ),
      })),
    [data]
  )
  return (
    <>
      <DialogModal title="Payout info" show={!!dialogText} size="small" onExitClick={() => setDialogText('')}>
        <DialogText as="p" variant="t200" color="colorText">
          {dialogText}
        </DialogText>
      </DialogModal>
      <Table
        title="History"
        columns={COLUMNS}
        data={isLoading ? tableLoadingData : mappedData}
        emptyState={tableEmptyState}
      />
    </>
  )
}

const TableText = ({ text, onShowMoreClick }: { text?: string; onShowMoreClick: () => void }) => {
  const commentBodyRef = useRef<HTMLParagraphElement>(null)
  const [isTruncated, setIsTruncated] = useState(false)

  useEffect(() => {
    if (!commentBodyRef.current) {
      return
    }
    setIsTruncated(commentBodyRef.current?.offsetWidth < commentBodyRef.current?.scrollWidth)
  }, [])

  return (
    <TextWrapper>
      <Text variant="t200" as="p" ref={commentBodyRef}>
        {text ?? '-'}
      </Text>
      {isTruncated && (
        <TextButton variant="primary" size="medium" onClick={onShowMoreClick}>
          Show more
        </TextButton>
      )}
    </TextWrapper>
  )
}

const Sender = ({ sender }: { sender: PaymentHistory['sender'] }) => {
  const { memberships } = useMemberships(
    { where: { controllerAccount_eq: sender } },
    {
      onError: (error) => SentryLogger.error('Failed to fetch memberships', 'ActiveUserProvider', error),
      skip: sender === 'council',
    }
  )
  const member = memberships?.find((member) => member.controllerAccount === sender)
  const { urls: avatarUrls, isLoadingAsset: avatarLoading } = getMemberAvatar(member)

  if (sender === 'council') {
    return (
      <SenderItem
        nodeStart={
          <JoystreamSvgWrapper>
            <SvgJoystreamLogoShort />
          </JoystreamSvgWrapper>
        }
        label="Joystream Council"
        isInteractive={false}
      />
    )
  }
  if (member) {
    return (
      <StyledLink to={absoluteRoutes.viewer.member(member.handle)}>
        <SenderItem
          nodeStart={<Avatar assetUrl={avatarUrls} size={32} loading={avatarLoading} />}
          label={member?.handle}
          isInteractive={false}
        />
      </StyledLink>
    )
  } else {
    return <SenderItem nodeStart={<Avatar />} label={shortenString(sender, 6, 4)} isInteractive={false} />
  }
}

const Date = ({ date }: { date: Date }) => {
  const { convertMsTimestampToBlock } = useBlockTimeEstimation()
  return (
    <>
      <Text as="p" variant="t200-strong">
        {formatDateTime(date)}
      </Text>
      <Text as="p" variant="t100" margin={{ top: 1 }} color="colorText">
        {formatNumber(convertMsTimestampToBlock(date.getTime()) || 0)} block
      </Text>
    </>
  )
}

const Type = ({ type }: { type: PaymentType }) => {
  return (
    <TypeWrapper>
      <TypeIconWrapper>{paymentTypeMappings[type].icon}</TypeIconWrapper>
      <Text variant="t200" as="p" margin={{ left: 2 }}>
        {paymentTypeMappings[type].title}
      </Text>
    </TypeWrapper>
  )
}

const TokenAmount = ({ tokenAmount }: { tokenAmount: BN }) => {
  const isNegative = tokenAmount.isNeg()
  return (
    <JoyAmountWrapper>
      <StyledJoyTokenIcon variant="gray" error={isNegative} />
      <StyledNumberFormat
        variant="t200-strong"
        as="p"
        value={tokenAmount}
        margin={{ left: 1 }}
        format="short"
        color={isNegative ? 'colorTextError' : 'colorTextStrong'}
      />
    </JoyAmountWrapper>
  )
}
