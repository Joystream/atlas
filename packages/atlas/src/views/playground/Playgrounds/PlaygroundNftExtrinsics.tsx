import React, { FormEvent, useState } from 'react'
import { useForm } from 'react-hook-form'

import { useNft } from '@/api/hooks'
import { TabItem, Tabs } from '@/components/Tabs'
import { Button } from '@/components/_buttons/Button'
import { FormField } from '@/components/_inputs/FormField'
import { TextField } from '@/components/_inputs/TextField'
import { NftTileViewer } from '@/components/_nft/NftTileViewer'
import { NftAuctionInputMetadata, NftIssuanceInputMetadata, NftSaleInputMetadata, NftSaleType } from '@/joystream-lib'
import { useJoystream } from '@/providers/joystream'
import { useTransaction } from '@/providers/transactions'
import { useAuthorizedUser } from '@/providers/user'

const TABS: TabItem[] = [
  { name: 'Issue NFT' },
  { name: 'Start buy now' },
  { name: 'Start auction' },
  { name: 'Cancel sale' },
  { name: 'Buy now' },
  { name: 'Make auction bid' },
  { name: 'Cancel auction bid' },
  { name: 'Settle english auction' },
]

export const PlaygroundNftExtrinsics: React.FC = () => {
  const [videoId, setVideoId] = useState('')
  const [selectedTabIdx, setSelectedTabIdx] = useState(0)
  const { nft, nftStatus, refetch } = useNft(videoId)
  const handleSuccess = () => refetch()

  const getTabContents = () => {
    const type: NftSaleType | null =
      (nftStatus?.status === 'buy-now' ? 'buyNow' : nftStatus?.status === 'idle' ? null : nftStatus?.type) || null

    const props = {
      videoId,
      onSuccess: handleSuccess,
      onError: () => refetch(),
      type,
    }

    switch (selectedTabIdx) {
      case 0:
        return <Issue {...props} />
      case 1:
        return <StartBuyNow {...props} />
      case 2:
        return <StartAuction {...props} />
      case 3:
        return <CancelSale {...props} />
      case 4:
        return <BuyNow {...props} />
      case 5:
        return <MakeBid {...props} />
      case 6:
        return <CancelBid {...props} />
      case 7:
        return <SettleAuction {...props} />
    }
  }

  const getDetailsContent = () => {
    return (
      <div>
        <Tabs tabs={TABS} onSelectTab={setSelectedTabIdx} selected={selectedTabIdx} />
        {getTabContents()}
        <div style={{ maxWidth: 320 }}>
          <NftTileViewer nftId={videoId} />
        </div>
        <pre>{JSON.stringify(nft, null, 2)}</pre>
      </div>
    )
  }

  return (
    <div>
      <TextField label="Video ID" value={videoId} onChange={(e) => setVideoId(e.target.value)} />

      {!!videoId && getDetailsContent()}
    </div>
  )
}

type FormProps = {
  videoId: string
  onSuccess: () => void
  onError: () => void
  type: NftSaleType | null
}

type IssueInputs = {
  royalties?: string
}
const Issue: React.FC<FormProps> = ({ videoId, onSuccess, onError }) => {
  const {
    register,
    handleSubmit: createSubmitHandler,
    formState: { errors },
  } = useForm<IssueInputs>()
  const { joystream, proxyCallback } = useJoystream()
  const handleTransaction = useTransaction()
  const { activeMemberId } = useAuthorizedUser()

  const handleSubmit = (data: IssueInputs) => {
    if (!joystream) return
    const metadata: NftIssuanceInputMetadata = {
      royalty: data.royalties ? parseInt(data.royalties) : undefined,
    }

    handleTransaction({
      onError,
      txFactory: async (updateStatus) =>
        (await joystream.extrinsics).issueNft(videoId, activeMemberId, metadata, proxyCallback(updateStatus)),
      onTxSync: async (_) => onSuccess(),
    })
  }

  return (
    <div>
      <form onSubmit={createSubmitHandler(handleSubmit)}>
        <FormField title="Royalties" optional>
          <TextField
            {...register('royalties', { min: 0, max: 100 })}
            error={!!errors.royalties}
            helperText={errors.royalties?.message}
          />
        </FormField>
        <Button type="submit">Issue NFT</Button>
      </form>
    </div>
  )
}

type BuyNowInputs = {
  buyNowPrice: number
}
const StartBuyNow: React.FC<FormProps> = ({ videoId, onSuccess, onError }) => {
  const {
    register,
    handleSubmit: createSubmitHandler,
    formState: { errors },
  } = useForm<BuyNowInputs>()

  const { joystream, proxyCallback } = useJoystream()
  const handleTransaction = useTransaction()
  const { activeMemberId } = useAuthorizedUser()

  const handleSubmit = (data: BuyNowInputs) => {
    if (!joystream) return
    const metadata: NftSaleInputMetadata = {
      type: 'buyNow',
      buyNowPrice: data.buyNowPrice,
    }

    handleTransaction({
      onError,
      txFactory: async (updateStatus) =>
        (await joystream.extrinsics).putNftOnSale(videoId, activeMemberId, metadata, proxyCallback(updateStatus)),
      onTxSync: async (_) => onSuccess(),
    })
  }

  return (
    <div>
      <form onSubmit={createSubmitHandler(handleSubmit)}>
        <FormField title="Buy now price">
          <TextField
            {...register('buyNowPrice')}
            error={!!errors.buyNowPrice}
            helperText={errors.buyNowPrice?.message}
          />
        </FormField>
        <Button type="submit">Start buy now</Button>
      </form>
    </div>
  )
}

type AuctionInputs = {
  startingPrice: string
  minimalBidStep: string
  buyNowPrice?: string
  startsAtBlock?: string
  auctionDurationBlocks?: string
  whitelistedMembers?: string
}
const StartAuction: React.FC<FormProps> = ({ videoId, onSuccess, onError }) => {
  const {
    register,
    handleSubmit: createSubmitHandler,
    formState: { errors },
  } = useForm<AuctionInputs>()

  const { joystream, proxyCallback } = useJoystream()
  const handleTransaction = useTransaction()
  const { activeMemberId } = useAuthorizedUser()

  const handleSubmit = (data: AuctionInputs) => {
    if (!joystream) return

    const isEnglishAuction = !!data.auctionDurationBlocks

    const commonAuctionFields = {
      buyNowPrice: data.buyNowPrice ? parseInt(data.buyNowPrice) : undefined,
      minimalBidStep: parseInt(data.minimalBidStep),
      startingPrice: parseInt(data.startingPrice),
      startsAtBlock: data.startsAtBlock ? parseInt(data.startsAtBlock) : undefined,
      whitelistedMembersIds: data.whitelistedMembers?.split(',').filter((member) => !!member),
    }
    const metadata: NftAuctionInputMetadata = isEnglishAuction
      ? {
          type: 'english',
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          auctionDurationBlocks: parseInt(data.auctionDurationBlocks!),
          ...commonAuctionFields,
        }
      : {
          type: 'open',
          ...commonAuctionFields,
        }
    handleTransaction({
      onError,
      txFactory: async (updateStatus) =>
        (await joystream.extrinsics).putNftOnSale(videoId, activeMemberId, metadata, proxyCallback(updateStatus)),
      onTxSync: async (_) => onSuccess(),
    })
  }

  return (
    <div>
      <form onSubmit={createSubmitHandler(handleSubmit)}>
        <FormField title="Starting price">
          <TextField
            {...register('startingPrice', { required: true })}
            type="number"
            error={!!errors.startingPrice}
            helperText={errors.startingPrice?.message}
          />
        </FormField>
        <FormField title="Minimal bid step">
          <TextField
            {...register('minimalBidStep', { required: true })}
            type="number"
            error={!!errors.minimalBidStep}
            helperText={errors.minimalBidStep?.message}
          />
        </FormField>
        <FormField title="Buy now price" optional>
          <TextField
            {...register('buyNowPrice')}
            type="number"
            error={!!errors.buyNowPrice}
            helperText={errors.buyNowPrice?.message}
          />
        </FormField>
        <FormField title="Starts at block" optional>
          <TextField
            {...register('startsAtBlock')}
            type="number"
            error={!!errors.startsAtBlock}
            helperText={errors.startsAtBlock?.message}
          />
        </FormField>
        <FormField title="Duration in blocks" optional>
          <TextField
            {...register('auctionDurationBlocks')}
            type="number"
            error={!!errors.auctionDurationBlocks}
            helperText={errors.auctionDurationBlocks?.message}
          />
        </FormField>

        <FormField title="Whitelisted members (comma-separated IDs)" optional>
          <TextField
            {...register('whitelistedMembers')}
            type="text"
            error={!!errors.whitelistedMembers}
            helperText={errors.whitelistedMembers?.message}
          />
        </FormField>

        <Button type="submit">Start auction</Button>
      </form>
    </div>
  )
}

const BuyNow: React.FC<FormProps> = ({ videoId, onSuccess, onError }) => {
  const {
    register,
    handleSubmit: createSubmitHandler,
    formState: { errors },
  } = useForm<BuyNowInputs>()

  const { joystream, proxyCallback } = useJoystream()
  const handleTransaction = useTransaction()
  const { activeMemberId } = useAuthorizedUser()

  const handleSubmit = (data: BuyNowInputs) => {
    if (!joystream) return

    handleTransaction({
      onError,
      txFactory: async (updateStatus) =>
        (await joystream.extrinsics).buyNftNow(videoId, activeMemberId, data.buyNowPrice, proxyCallback(updateStatus)),
      onTxSync: async (_) => onSuccess(),
    })
  }

  return (
    <div>
      <form onSubmit={createSubmitHandler(handleSubmit)}>
        <FormField title="Price">
          <TextField
            {...register('buyNowPrice')}
            error={!!errors.buyNowPrice}
            helperText={errors.buyNowPrice?.message}
          />
        </FormField>
        <Button type="submit">Buy now</Button>
      </form>
    </div>
  )
}

type MakeBidInputs = {
  bid: number
}
const MakeBid: React.FC<FormProps> = ({ videoId, onSuccess, onError, type }) => {
  const {
    register,
    handleSubmit: createSubmitHandler,
    formState: { errors },
  } = useForm<MakeBidInputs>()

  const { joystream, proxyCallback } = useJoystream()
  const handleTransaction = useTransaction()
  const { activeMemberId } = useAuthorizedUser()

  const handleSubmit = (data: MakeBidInputs) => {
    if (!joystream || !type || type === 'buyNow') return

    handleTransaction({
      onError,
      txFactory: async (updateStatus) =>
        (await joystream.extrinsics).makeNftBid(videoId, activeMemberId, data.bid, type, proxyCallback(updateStatus)),
      onTxSync: async (_) => onSuccess(),
    })
  }

  return (
    <div>
      <form onSubmit={createSubmitHandler(handleSubmit)}>
        <FormField title="Bid">
          <TextField {...register('bid')} error={!!errors.bid} helperText={errors.bid?.message} />
        </FormField>
        <Button type="submit">Place bid</Button>
      </form>
    </div>
  )
}

const CancelSale: React.FC<FormProps> = ({ videoId, onSuccess, onError, type }) => {
  const { joystream, proxyCallback } = useJoystream()
  const handleTransaction = useTransaction()
  const { activeMemberId } = useAuthorizedUser()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!joystream || !type) return

    handleTransaction({
      onError,
      txFactory: async (updateStatus) =>
        (await joystream.extrinsics).cancelNftSale(videoId, activeMemberId, type, proxyCallback(updateStatus)),
      onTxSync: async (_) => onSuccess(),
    })
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Button type="submit">Cancel sale</Button>
      </form>
    </div>
  )
}

const CancelBid: React.FC<FormProps> = ({ videoId, onSuccess, onError }) => {
  const { joystream, proxyCallback } = useJoystream()
  const handleTransaction = useTransaction()
  const { activeMemberId } = useAuthorizedUser()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!joystream) return

    handleTransaction({
      onError,
      txFactory: async (updateStatus) =>
        (await joystream.extrinsics).cancelNftBid(videoId, activeMemberId, proxyCallback(updateStatus)),
      onTxSync: async (_) => onSuccess(),
    })
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Button type="submit">Cancel bid</Button>
      </form>
    </div>
  )
}

const SettleAuction: React.FC<FormProps> = ({ videoId, onSuccess, type }) => {
  const { joystream, proxyCallback } = useJoystream()
  const handleTransaction = useTransaction()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!joystream || !type) return

    handleTransaction({
      txFactory: async (updateStatus) =>
        (await joystream.extrinsics).settleEnglishAuction(videoId, proxyCallback(updateStatus)),
      onTxSync: async (_) => onSuccess(),
    })
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Button type="submit">Settle auction</Button>
      </form>
    </div>
  )
}
