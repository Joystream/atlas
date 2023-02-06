import BN from 'bn.js'
import { FC, ReactElement, useEffect, useMemo, useRef, useState } from 'react'

import { useMemberships } from '@/api/hooks/membership'
import { SvgActionCouncil, SvgActionCrown, SvgActionNft, SvgActionPayment, SvgActionRevenueShare } from '@/assets/icons'
import { SvgEmptyStateIllustration } from '@/assets/illustrations'
import { SvgJoystreamLogoShort } from '@/assets/logos'
import { Avatar } from '@/components/Avatar'
import { Table, TableProps } from '@/components/Table'
import { Text } from '@/components/Text'
import { TextButton } from '@/components/_buttons/Button'
import { DialogModal } from '@/components/_overlays/DialogModal'
import { useBlockTimeEstimation } from '@/hooks/useBlockTimeEstimation'
import { useMemberAvatar } from '@/providers/assets/assets.hooks'
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
  StyledNumberFormat,
  TextWrapper,
  TypeIconWrapper,
  TypeWrapper,
} from './TablePaymentsHistory.styles'

const COLUMNS: TableProps['columns'] = [
  {
    Header: 'Date',
    accessor: 'date',
    width: 100,
  },
  {
    Header: 'Type',
    accessor: 'type',
    width: 100,
  },
  {
    Header: 'Sender',
    accessor: 'sender',
    width: 100,
  },
  {
    Header: 'Amount',
    accessor: 'amount',
    width: 100,
  },
  {
    Header: 'Description',
    accessor: 'description',
    width: 200,
  },
]

const paymentTypeMappings: Record<
  PaymentType,
  {
    title: string
    icon?: ReactElement
  }
> = {
  'nft-sale': {
    title: 'NFT sale',
    icon: <SvgActionNft />,
  },
  'nft-royalty': {
    title: 'NFT royalty',
    icon: <SvgActionCrown />,
  },
  'claimed-reward': {
    title: 'Claimed reward',
    icon: <SvgActionRevenueShare />,
  },
  'withdrawal': {
    title: 'Withdrawal',
    icon: <SvgActionRevenueShare />,
  },
  'ypp-reward': {
    title: 'YPP reward',
    icon: <SvgActionRevenueShare />,
  },
  'council-reward': {
    title: 'Council reward',
    icon: <SvgActionCouncil />,
  },
  'direct-payment': {
    title: 'Direct payment',
    icon: <SvgActionPayment />,
  },
  'revenue-share': {
    title: 'Revenue share',
    icon: <SvgActionRevenueShare />,
  },
}

type PaymentType =
  | 'nft-sale'
  | 'nft-royalty'
  | 'claimed-reward'
  | 'withdrawal'
  | 'ypp-reward'
  | 'council-reward'
  | 'direct-payment'
  | 'revenue-share'

const tableEmptyState = {
  title: 'No payments here yet',
  description:
    'Here you will see proceedings to your channel balance from sold NFTs and royalties, claimed council rewards, direct payments from members to your channel and withdrawals from channel balance.',
  icon: <SvgEmptyStateIllustration />,
}

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
}

export const TablePaymentsHistory: FC<TablePaymentsHistoryProps> = ({ data }) => {
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
      <Table title="History" columns={COLUMNS} data={mappedData} emptyState={tableEmptyState} />
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
  const { url: avatarUrl, isLoadingAsset: avatarLoading } = useMemberAvatar(member)

  switch (true) {
    case sender === 'council':
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
    case !!member:
      return (
        <SenderItem
          nodeStart={<Avatar assetUrl={avatarUrl} loading={avatarLoading} />}
          label={member?.handle}
          isInteractive={false}
        />
      )
    default:
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
        {formatNumber(convertMsTimestampToBlock(date.getTime()) || 0)} blocks
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
        color={isNegative ? 'colorTextError' : 'colorTextStrong'}
      />
    </JoyAmountWrapper>
  )
}
