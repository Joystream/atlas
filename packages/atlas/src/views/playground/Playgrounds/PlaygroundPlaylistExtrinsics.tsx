import Long from 'long'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { usePlaylist } from '@/api/hooks/playlists'
import { TabItem, Tabs } from '@/components/Tabs'
import { Button } from '@/components/_buttons/Button'
import { FormField } from '@/components/_inputs/FormField'
import { Input } from '@/components/_inputs/Input'
import { Switch } from '@/components/_inputs/Switch'
import { PlaylistExtrinsicResult, PlaylistInputMetadata } from '@/joystream-lib'
import { useJoystream } from '@/providers/joystream'
import { useTransaction } from '@/providers/transactionManager'
import { useAuthorizedUser } from '@/providers/user'
import { sizes } from '@/styles'

const TABS: TabItem[] = [{ name: 'Create playlist' }, { name: 'Edit playlist' }, { name: 'Delete playlist' }]

export const PlaygroundPlaylistExtrinsics: React.FC = () => {
  const [playlistId, setPlaylistId] = useState('')
  const [selectedTabIdx, setSelectedTabIdx] = useState(0)
  const { playlist, refetch } = usePlaylist(playlistId)
  const handleSuccess = (id?: string) => {
    if (id) {
      setPlaylistId(id)
      refetch({ where: { id } })
    } else {
      refetch()
    }
  }

  const getTabContents = () => {
    const props = {
      playlistId,
      onSuccess: handleSuccess,
    }
    switch (selectedTabIdx) {
      case 0:
        return <CreatePlaylist {...props} />
      case 1:
        return <EditPlaylist {...props} />
      case 2:
        return <DeletePlaylist {...props} />
    }
  }

  return (
    <div>
      <FormField label="Playlist ID">
        <Input value={playlistId} onChange={(e) => setPlaylistId(e.target.value)} />
      </FormField>

      <div>
        <Tabs tabs={TABS} onSelectTab={setSelectedTabIdx} selected={selectedTabIdx} />
        {getTabContents()}
        <pre>{JSON.stringify(playlist, null, 2)}</pre>
      </div>
    </div>
  )
}

type CommonProps = {
  playlistId: string
  onSuccess: (id?: string) => void
}

type CreateInputs = {
  title: string
  description: string
  isPublic: boolean
  videosIds: string
}

const CreatePlaylist: React.FC<CommonProps> = ({ onSuccess }) => {
  const { register, control, handleSubmit: createSubmitHandler } = useForm<CreateInputs>()
  const { joystream, proxyCallback } = useJoystream()
  const handleTransaction = useTransaction()
  const { activeMemberId, activeChannelId } = useAuthorizedUser()

  const handleSubmit = (data: CreateInputs) => {
    if (!joystream) return
    const metadata: PlaylistInputMetadata = {
      title: data.title,
      description: data.description,
      isPublic: data.isPublic,
      videoIds: data.videosIds
        ? data.videosIds
            .trim()
            .split(',')
            .map((id) => Long.fromString(id))
        : null,
    }

    handleTransaction({
      txFactory: async (updateStatus) =>
        (await joystream.extrinsics).createPlaylist(
          activeMemberId,
          activeChannelId,
          metadata,
          {},
          proxyCallback(updateStatus)
        ),
      onTxSync: async (data: PlaylistExtrinsicResult) => onSuccess(data.playlistId),
    })
  }

  return (
    <form onSubmit={createSubmitHandler(handleSubmit)} style={{ display: 'grid', gap: sizes(8), marginTop: sizes(8) }}>
      <FormField label="Title">
        <Input {...register('title')} />
      </FormField>
      <FormField label="Description">
        <Input {...register('description')} />
      </FormField>
      <Controller
        name="isPublic"
        control={control}
        defaultValue={true}
        render={({ field: { value, onChange } }) => <Switch label="Public" value={value} onChange={onChange} />}
      />
      <FormField label="Videos IDs (comma separated)">
        <Input {...register('videosIds')} />
      </FormField>
      <Button type="submit">Create</Button>
    </form>
  )
}

const EditPlaylist: React.FC<CommonProps> = ({ playlistId, onSuccess }) => {
  const { register, control, handleSubmit: createSubmitHandler, reset } = useForm<CreateInputs>()
  const { joystream, proxyCallback } = useJoystream()
  const handleTransaction = useTransaction()
  const { activeMemberId } = useAuthorizedUser()

  const { playlist, loading } = usePlaylist(playlistId, {
    onCompleted: ({ playlistByUniqueInput: playlist }) => {
      if (!playlist) return
      reset({
        title: playlist.title,
        description: playlist.description,
        isPublic: playlist.isPublic ?? false,
        videosIds: playlist.videos.map((v) => v.video.id).join(','),
      })
    },
  })

  const handleSubmit = (data: CreateInputs) => {
    if (!joystream) return
    const metadata: PlaylistInputMetadata = {
      title: data.title,
      description: data.description,
      isPublic: data.isPublic,
      videoIds: data.videosIds
        ? data.videosIds
            .trim()
            .split(',')
            .map((id) => Long.fromString(id))
        : null,
    }

    handleTransaction({
      txFactory: async (updateStatus) =>
        (await joystream.extrinsics).updatePlaylist(
          playlistId,
          activeMemberId,
          metadata,
          {},
          proxyCallback(updateStatus)
        ),
      onTxSync: async () => onSuccess(),
    })
  }

  if (loading) {
    return <span>Loading...</span>
  }

  if (!playlist) {
    return <span>Playlist not found :(</span>
  }

  return (
    <form onSubmit={createSubmitHandler(handleSubmit)}>
      <FormField label="Title">
        <Input {...register('title')} />
      </FormField>
      <FormField label="Description">
        <Input {...register('description')} />
      </FormField>
      <Controller
        name="isPublic"
        control={control}
        defaultValue={true}
        render={({ field: { value, onChange } }) => <Switch label="Public" value={value} onChange={onChange} />}
      />
      <FormField label="Videos IDs (comma separated)">
        <Input {...register('videosIds')} />
      </FormField>
      <Button type="submit">Edit</Button>
    </form>
  )
}

const DeletePlaylist: React.FC<CommonProps> = ({ playlistId, onSuccess }) => {
  const { joystream, proxyCallback } = useJoystream()
  const handleTransaction = useTransaction()
  const { activeMemberId } = useAuthorizedUser()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!joystream) return

    handleTransaction({
      txFactory: async (updateStatus) =>
        (await joystream.extrinsics).deletePlaylist(playlistId, activeMemberId, [], proxyCallback(updateStatus)),
      onTxSync: async () => onSuccess(),
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <Button type="submit" variant="destructive">
        Delete
      </Button>
    </form>
  )
}
