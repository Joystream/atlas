import React, { useState } from 'react'

import { TabItem, Tabs } from '@/components/Tabs'
import { Button } from '@/components/_buttons/Button'
import { Select, SelectItem } from '@/components/_inputs/Select'
import { TextArea } from '@/components/_inputs/TextArea'
import { TextField } from '@/components/_inputs/TextField'
import { VideoReaction } from '@/joystream-lib'
import { useJoystream } from '@/providers/joystream'
import { useTransaction } from '@/providers/transactionManager'
import { useUser } from '@/providers/user'
import { ConsoleLogger } from '@/utils/logs'

const TABS: TabItem[] = [
  { name: 'React to video' },
  { name: 'React to comment' },
  { name: 'Create comment' },
  { name: 'Edit comment' },
  { name: 'Delete comment' },
]

export const PlaygroundReactionsComments: React.FC = () => {
  const [selectedTabIdx, setSelectedTabIdx] = useState(0)
  const [videoId, setVideoId] = useState('')

  const getTabContents = () => {
    const props: CommonProps = {
      videoId,
    }
    switch (selectedTabIdx) {
      case 0:
        return <ReactToVideo {...props} />
      case 1:
        return <ReactToComment {...props} />
      case 2:
        return <CreateComment {...props} />
      case 3:
        return <EditComment {...props} />
      case 4:
        return <DeleteComment {...props} />
    }
  }

  return (
    <div>
      <TextField value={videoId} onChange={(e) => setVideoId(e.target.value)} label="Video ID" />
      <Tabs tabs={TABS} onSelectTab={setSelectedTabIdx} />
      {getTabContents()}
    </div>
  )
}

type CommonProps = {
  videoId: string
}

const ReactToVideo: React.FC<CommonProps> = ({ videoId }) => {
  const { joystream, proxyCallback } = useJoystream()
  const handleTransaction = useTransaction()
  const { activeMemberId } = useUser()
  const [videoReaction, setVideoReaction] = useState<VideoReaction>('like')

  const handleLike = () => {
    if (!joystream || !activeMemberId) {
      ConsoleLogger.error('no joystream or active member')
      return
    }

    handleTransaction({
      txFactory: async (updateStatus) =>
        (await joystream.extrinsics).reactToVideo(activeMemberId, videoId, videoReaction, proxyCallback(updateStatus)),
      minimized: {
        signErrorMessage: 'Failed to react to video',
      },
    })
  }

  const reactionItems: SelectItem<VideoReaction>[] = [
    { value: 'like', name: 'Like' },
    { value: 'dislike', name: 'Dislike' },
  ]

  return (
    <div>
      <Select
        value={videoReaction}
        onChange={(value) => value && setVideoReaction(value)}
        items={reactionItems}
        label="Reaction type"
      />
      <Button onClick={handleLike}>React</Button>
    </div>
  )
}
const ReactToComment: React.FC<CommonProps> = () => {
  const { joystream, proxyCallback } = useJoystream()
  const handleTransaction = useTransaction()
  const { activeMemberId } = useUser()

  const [commentId, setCommentId] = useState<string>('')
  const [commentReaction, setCommentReaction] = useState<number>(1)

  const handleLike = () => {
    if (!joystream || !activeMemberId || !commentId) {
      ConsoleLogger.error('no joystream or active member')
      return
    }

    handleTransaction({
      txFactory: async (updateStatus) =>
        (await joystream.extrinsics).reactToVideoComment(
          activeMemberId,
          commentId,
          commentReaction,
          proxyCallback(updateStatus)
        ),
      minimized: {
        signErrorMessage: 'Failed to react to comment',
      },
    })
  }

  const reactionItems: SelectItem<number>[] = [
    { value: 1, name: '❤️' },
    { value: 2, name: '👎' },
    { value: 3, name: '🤯' },
  ]

  return (
    <div>
      <TextField value={commentId} onChange={(e) => setCommentId(e.target.value)} label="Comment ID" />
      <Select
        value={commentReaction}
        onChange={(value) => value && setCommentReaction(value)}
        items={reactionItems}
        label="Reaction type"
      />
      <Button onClick={handleLike}>React</Button>
    </div>
  )
}
const CreateComment: React.FC<CommonProps> = ({ videoId }) => {
  const { joystream, proxyCallback } = useJoystream()
  const handleTransaction = useTransaction()
  const { activeMemberId } = useUser()
  const [commentBody, setCommentBody] = useState('')
  const [parentCommentId, setParentCommentId] = useState('')

  const handleCreate = () => {
    if (!joystream || !activeMemberId) {
      ConsoleLogger.error('no joystream or active member')
      return
    }

    handleTransaction({
      txFactory: async (updateStatus) =>
        (await joystream.extrinsics).createVideoComment(
          activeMemberId,
          videoId,
          commentBody,
          parentCommentId || null,
          proxyCallback(updateStatus)
        ),
      minimized: {
        signErrorMessage: 'Failed to post video comment',
      },
    })
  }

  return (
    <div>
      <TextArea value={commentBody} onChange={(e) => setCommentBody(e.target.value)} label="Comment body" />
      <TextField
        value={parentCommentId}
        onChange={(e) => setParentCommentId(e.target.value)}
        label="Optional parent comment ID"
      />
      <Button onClick={handleCreate}>Comment</Button>
    </div>
  )
}

const EditComment: React.FC<CommonProps> = () => {
  const { joystream, proxyCallback } = useJoystream()
  const handleTransaction = useTransaction()
  const { activeMemberId } = useUser()
  const [commentBody, setCommentBody] = useState('')
  const [commentId, setCommentId] = useState('')

  const handleCreate = () => {
    if (!joystream || !activeMemberId) {
      ConsoleLogger.error('no joystream or active member')
      return
    }

    handleTransaction({
      txFactory: async (updateStatus) =>
        (await joystream.extrinsics).editVideoComment(
          activeMemberId,
          commentId,
          commentBody,
          proxyCallback(updateStatus)
        ),
      minimized: {
        signErrorMessage: 'Failed to edit video comment',
      },
    })
  }

  return (
    <div>
      <TextField value={commentId} onChange={(e) => setCommentId(e.target.value)} label="Comment ID" />
      <TextArea value={commentBody} onChange={(e) => setCommentBody(e.target.value)} label="Updated comment body" />
      <Button onClick={handleCreate}>Edit</Button>
    </div>
  )
}

const DeleteComment: React.FC<CommonProps> = () => {
  const { joystream, proxyCallback } = useJoystream()
  const handleTransaction = useTransaction()
  const { activeMemberId } = useUser()
  const [commentId, setCommentId] = useState('')

  const handleDelete = () => {
    if (!joystream || !activeMemberId) {
      ConsoleLogger.error('no joystream or active member')
      return
    }

    handleTransaction({
      txFactory: async (updateStatus) =>
        (await joystream.extrinsics).deleteVideoComment(activeMemberId, commentId, proxyCallback(updateStatus)),
      minimized: {
        signErrorMessage: 'Failed to delete comment',
      },
    })
  }

  return (
    <div>
      <TextField value={commentId} onChange={(e) => setCommentId(e.target.value)} label="Comment ID" />
      <Button onClick={handleDelete}>Delete</Button>
    </div>
  )
}
