import { FC, useState } from 'react'

import { TabItem, Tabs } from '@/components/Tabs'
import { Button } from '@/components/_buttons/Button'
import { FormField } from '@/components/_inputs/FormField'
import { Input } from '@/components/_inputs/Input'
import { Select, SelectItem } from '@/components/_inputs/Select'
import { TextArea } from '@/components/_inputs/TextArea'
import { VideoReaction } from '@/joystream-lib/types'
import { useJoystream } from '@/providers/joystream'
import { useTransaction } from '@/providers/transactions/transactions.hooks'
import { useUser } from '@/providers/user/user.hooks'
import { ConsoleLogger } from '@/utils/logs'

const TABS: TabItem[] = [
  { name: 'React to video' },
  { name: 'React to comment' },
  { name: 'Create comment' },
  { name: 'Edit comment' },
  { name: 'Delete comment' },
]

export const PlaygroundReactionsComments: FC = () => {
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
      <FormField label="Video ID">
        <Input value={videoId} onChange={(e) => setVideoId(e.target.value)} />
      </FormField>
      <Tabs tabs={TABS} onSelectTab={setSelectedTabIdx} />
      {getTabContents()}
    </div>
  )
}

type CommonProps = {
  videoId: string
}

const ReactToVideo: FC<CommonProps> = ({ videoId }) => {
  const { joystream, proxyCallback } = useJoystream()
  const handleTransaction = useTransaction()
  const { memberId } = useUser()
  const [videoReaction, setVideoReaction] = useState<VideoReaction>('like')

  const handleLike = () => {
    if (!joystream || !memberId) {
      ConsoleLogger.error('no joystream or active member')
      return
    }

    handleTransaction({
      txFactory: async (updateStatus) =>
        (await joystream.extrinsics).reactToVideo(memberId, videoId, videoReaction, proxyCallback(updateStatus)),
      minimized: {
        errorMessage: 'Failed to react to video',
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
        inlineLabel="Reaction type"
      />
      <Button onClick={handleLike}>React</Button>
    </div>
  )
}
const ReactToComment: FC<CommonProps> = () => {
  const { joystream, proxyCallback } = useJoystream()
  const handleTransaction = useTransaction()
  const { memberId } = useUser()

  const [commentId, setCommentId] = useState<string>('')
  const [commentReaction, setCommentReaction] = useState<number>(1)

  const handleLike = () => {
    if (!joystream || !memberId || !commentId) {
      ConsoleLogger.error('no joystream or active member')
      return
    }

    handleTransaction({
      txFactory: async (updateStatus) =>
        (await joystream.extrinsics).reactToVideoComment(
          memberId,
          commentId,
          commentReaction,
          proxyCallback(updateStatus)
        ),
      minimized: {
        errorMessage: 'Failed to react to comment',
      },
    })
  }

  const reactionItems: SelectItem<number>[] = [
    { value: 1, name: '👍 ' },
    { value: 2, name: '❤️' },
    { value: 3, name: '😂' },
    { value: 4, name: '🤯' },
    { value: 5, name: '😠' },
  ]

  return (
    <div>
      <FormField label="Comment ID">
        <Input value={commentId} onChange={(e) => setCommentId(e.target.value)} />
      </FormField>
      <Select
        value={commentReaction}
        onChange={(value) => value && setCommentReaction(value)}
        items={reactionItems}
        inlineLabel="Reaction type"
      />
      <Button onClick={handleLike}>React</Button>
    </div>
  )
}
const CreateComment: FC<CommonProps> = ({ videoId }) => {
  const { joystream, proxyCallback } = useJoystream()
  const handleTransaction = useTransaction()
  const { memberId } = useUser()
  const [commentBody, setCommentBody] = useState('')
  const [parentCommentId, setParentCommentId] = useState('')

  const handleCreate = () => {
    if (!joystream || !memberId) {
      ConsoleLogger.error('no joystream or active member')
      return
    }

    handleTransaction({
      txFactory: async (updateStatus) =>
        (await joystream.extrinsics).createVideoComment(
          memberId,
          videoId,
          commentBody,
          parentCommentId || null,
          undefined,
          proxyCallback(updateStatus)
        ),
      minimized: {
        errorMessage: 'Failed to post video comment',
      },
    })
  }

  return (
    <div>
      <FormField label="Comment body">
        <TextArea value={commentBody} onChange={(e) => setCommentBody(e.target.value)} />
      </FormField>
      <FormField label="Optional parent comment ID">
        <Input value={parentCommentId} onChange={(e) => setParentCommentId(e.target.value)} />
      </FormField>
      <Button onClick={handleCreate}>Comment</Button>
    </div>
  )
}

const EditComment: FC<CommonProps> = () => {
  const { joystream, proxyCallback } = useJoystream()
  const handleTransaction = useTransaction()
  const { memberId } = useUser()
  const [commentBody, setCommentBody] = useState('')
  const [commentId, setCommentId] = useState('')

  const handleCreate = () => {
    if (!joystream || !memberId) {
      ConsoleLogger.error('no joystream or active member')
      return
    }

    handleTransaction({
      txFactory: async (updateStatus) =>
        (await joystream.extrinsics).editVideoComment(memberId, commentId, commentBody, proxyCallback(updateStatus)),
      minimized: {
        errorMessage: 'Failed to edit video comment',
      },
    })
  }

  return (
    <div>
      <FormField label="Comment ID">
        <Input value={commentId} onChange={(e) => setCommentId(e.target.value)} />
      </FormField>
      <FormField label="Updated comment body">
        <TextArea value={commentBody} onChange={(e) => setCommentBody(e.target.value)} />
      </FormField>
      <Button onClick={handleCreate}>Edit</Button>
    </div>
  )
}

const DeleteComment: FC<CommonProps> = () => {
  const { joystream, proxyCallback } = useJoystream()
  const handleTransaction = useTransaction()
  const { memberId } = useUser()
  const [commentId, setCommentId] = useState('')

  const handleDelete = () => {
    if (!joystream || !memberId) {
      ConsoleLogger.error('no joystream or active member')
      return
    }

    handleTransaction({
      txFactory: async (updateStatus) =>
        (await joystream.extrinsics).deleteVideoComment(memberId, commentId, proxyCallback(updateStatus)),
      minimized: {
        errorMessage: 'Failed to delete comment',
      },
    })
  }

  return (
    <div>
      <FormField label="Comment ID">
        <Input value={commentId} onChange={(e) => setCommentId(e.target.value)} />
      </FormField>
      <Button onClick={handleDelete}>Delete</Button>
    </div>
  )
}
