import React, { FormEvent, useState } from 'react'
import { useForm } from 'react-hook-form'

import { useNft } from '@/api/hooks'
import { NftTileViewer } from '@/components/NftTileViewer'
import { TabItem, Tabs } from '@/components/Tabs'
import { Button } from '@/components/_buttons/Button'
import { FormField } from '@/components/_inputs/FormField'
import { TextField } from '@/components/_inputs/TextField'
import { NftAuctionInputMetadata, NftIssuanceInputMetadata, NftSaleInputMetadata } from '@/joystream-lib'
import { useJoystream } from '@/providers/joystream'
import { useTransaction } from '@/providers/transactionManager'
import { useAuthorizedUser } from '@/providers/user'

const TABS: TabItem[] = [
  { name: 'Issue NFT' },
  { name: 'Start buy now' },
  { name: 'Start auction' },
  { name: 'Cancel buy now' },
  { name: 'Cancel auction' },
  { name: 'Buy now' },
  { name: 'Make auction bid' },
  { name: 'Cancel auction bid' },
]

export const PlaygroundNFTExtrinsics: React.FC = () => {
  const [videoId, setVideoId] = useState('')
  const [selectedTabIdx, setSelectedTabIdx] = useState(0)
  const { nft, refetch } = useNft(videoId)

  const handleSuccess = () => refetch()

  const getTabContents = () => {
    switch (selectedTabIdx) {
      case 0:
        return <Issue videoId={videoId} onSuccess={handleSuccess} />
      case 1:
        return <StartBuyNow videoId={videoId} onSuccess={handleSuccess} />
      case 2:
        return <StartAuction videoId={videoId} onSuccess={handleSuccess} />
      case 3:
        return <CancelBuyNow videoId={videoId} onSuccess={handleSuccess} />
      case 4:
        return <CancelAuction videoId={videoId} onSuccess={handleSuccess} />
      case 5:
        return <BuyNow videoId={videoId} onSuccess={handleSuccess} />
      case 6:
        return <MakeBid videoId={videoId} onSuccess={handleSuccess} />
      case 7:
        return <CancelBid videoId={videoId} onSuccess={handleSuccess} />
    }
  }

  const getDetailsContent = () => (
    <div>
      <Tabs tabs={TABS} onSelectTab={setSelectedTabIdx} selected={selectedTabIdx} />
      {getTabContents()}
      <NftTileViewer nftId={videoId} />
      <pre>{JSON.stringify(nft, null, 2)}</pre>
    </div>
  )

  return (
    <div>
      <FormField title="Video ID">
        <TextField value={videoId} onChange={(e) => setVideoId(e.target.value)} />
      </FormField>

      {!!videoId && getDetailsContent()}
    </div>
  )
}

type FormProps = {
  videoId: string
  onSuccess: () => void
}

type IssueInputs = {
  royalties?: string
}
const Issue: React.FC<FormProps> = ({ videoId, onSuccess }) => {
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
      txFactory: async (updateStatus) =>
        (await joystream.extrinsics).issueNft(videoId, activeMemberId, metadata, proxyCallback(updateStatus)),
      onTxSync: async (_) => onSuccess(),
      successMessage: {
        title: 'NFT issued',
        description: 'Good job',
      },
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
const StartBuyNow: React.FC<FormProps> = ({ videoId, onSuccess }) => {
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
      txFactory: async (updateStatus) =>
        (await joystream.extrinsics).putNftOnSale(videoId, activeMemberId, metadata, proxyCallback(updateStatus)),
      onTxSync: async (_) => onSuccess(),
      successMessage: {
        title: 'NFT buy now started',
        description: 'Good job',
      },
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
const StartAuction: React.FC<FormProps> = ({ videoId, onSuccess }) => {
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
      txFactory: async (updateStatus) =>
        (await joystream.extrinsics).putNftOnSale(videoId, activeMemberId, metadata, proxyCallback(updateStatus)),
      onTxSync: async (_) => onSuccess(),
      successMessage: {
        title: 'NFT put on auction',
        description: 'Good job',
      },
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
            type="number"
            error={!!errors.whitelistedMembers}
            helperText={errors.whitelistedMembers?.message}
          />
        </FormField>

        <Button type="submit">Start auction</Button>
      </form>
    </div>
  )
}

const BuyNow: React.FC<FormProps> = ({ videoId, onSuccess }) => {
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
      txFactory: async (updateStatus) =>
        (await joystream.extrinsics).buyNftNow(videoId, activeMemberId, data.buyNowPrice, proxyCallback(updateStatus)),
      onTxSync: async (_) => onSuccess(),
      successMessage: {
        title: 'NFT bought',
        description: 'Good job',
      },
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
const MakeBid: React.FC<FormProps> = ({ videoId, onSuccess }) => {
  const {
    register,
    handleSubmit: createSubmitHandler,
    formState: { errors },
  } = useForm<MakeBidInputs>()

  const { joystream, proxyCallback } = useJoystream()
  const handleTransaction = useTransaction()
  const { activeMemberId } = useAuthorizedUser()

  const handleSubmit = (data: MakeBidInputs) => {
    if (!joystream) return

    handleTransaction({
      txFactory: async (updateStatus) =>
        (await joystream.extrinsics).makeNftBid(videoId, activeMemberId, data.bid, proxyCallback(updateStatus)),
      onTxSync: async (_) => onSuccess(),
      successMessage: {
        title: 'Bid placed',
        description: 'Good job',
      },
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

const CancelBuyNow: React.FC<FormProps> = ({ videoId, onSuccess }) => {
  const { joystream, proxyCallback } = useJoystream()
  const handleTransaction = useTransaction()
  const { activeMemberId } = useAuthorizedUser()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!joystream) return

    handleTransaction({
      txFactory: async (updateStatus) =>
        (await joystream.extrinsics).cancelNftSale(videoId, activeMemberId, true, proxyCallback(updateStatus)),
      onTxSync: async (_) => onSuccess(),
      successMessage: {
        title: 'Buy now cancelled',
        description: 'Good job',
      },
    })
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Button type="submit">Cancel buy now</Button>
      </form>
    </div>
  )
}

const CancelAuction: React.FC<FormProps> = ({ videoId, onSuccess }) => {
  const { joystream, proxyCallback } = useJoystream()
  const handleTransaction = useTransaction()
  const { activeMemberId } = useAuthorizedUser()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!joystream) return

    handleTransaction({
      txFactory: async (updateStatus) =>
        (await joystream.extrinsics).cancelNftSale(videoId, activeMemberId, false, proxyCallback(updateStatus)),
      onTxSync: async (_) => onSuccess(),
      successMessage: {
        title: 'Auction cancelled',
        description: 'Good job',
      },
    })
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Button type="submit">Cancel auction</Button>
      </form>
    </div>
  )
}

const CancelBid: React.FC<FormProps> = ({ videoId, onSuccess }) => {
  const { joystream, proxyCallback } = useJoystream()
  const handleTransaction = useTransaction()
  const { activeMemberId } = useAuthorizedUser()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!joystream) return

    handleTransaction({
      txFactory: async (updateStatus) =>
        (await joystream.extrinsics).cancelNftBid(videoId, activeMemberId, proxyCallback(updateStatus)),
      onTxSync: async (_) => onSuccess(),
      successMessage: {
        title: 'Bid cancelled',
        description: 'Good job',
      },
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
