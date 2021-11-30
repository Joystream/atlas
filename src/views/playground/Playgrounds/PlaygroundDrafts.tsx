import React, { useState } from 'react'

import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { FormField } from '@/components/_inputs/FormField'
import { Select } from '@/components/_inputs/Select'
import { TextArea } from '@/components/_inputs/TextArea'
import { TextField } from '@/components/_inputs/TextField'
import { RawDraft, channelDraftsSelector, useDraftStore } from '@/providers/drafts'
import { useUser } from '@/providers/user'

const INITIAL_STATE: RawDraft = {
  channelId: '100',
  title: '',
  type: 'video',
  description: '',
  isExplicit: undefined,
}

const CONTENT_RATING = [
  { value: false, name: 'all' },
  { value: true, name: 'mature' },
]

export const PlaygroundDrafts = () => {
  const [form, setForm] = useState(INITIAL_STATE)
  const { activeChannelId } = useUser()

  const drafts = useDraftStore(channelDraftsSelector(activeChannelId || INITIAL_STATE.channelId))
  const { removeDrafts, removeAllDrafts, updateDraft, addDraft } = useDraftStore((state) => state.actions)

  const [currentDraftId, setCurrentDraftId] = useState('')

  const setCurrentDraft = async (draftID: string) => {
    setCurrentDraftId(draftID)
    const draft = drafts.find((draft) => draft.id === draftID)
    if (draft) {
      const { title, description, isExplicit, channelId, type } = draft
      setForm({ title, description, isExplicit, channelId: activeChannelId || channelId, type })
    } else {
      setForm({ ...INITIAL_STATE, channelId: activeChannelId || INITIAL_STATE.channelId })
    }
  }

  const draftsIds = drafts.map((draft) => ({ value: draft.id, name: draft.id }))

  return (
    <div style={{ maxWidth: '600px' }}>
      <Text variant="h600">Testing drafts</Text>

      {draftsIds.length > 0 && (
        <FormField title="change draft">
          <Select
            placeholder="drafts"
            label="change draft"
            items={draftsIds}
            value={currentDraftId}
            onChange={(value) => setCurrentDraft(value ?? '')}
          />
        </FormField>
      )}

      <FormField title="Your title">
        <TextField
          label="title"
          value={form.title ?? undefined}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
      </FormField>
      <FormField title="Your description">
        <TextArea
          placeholder="description"
          value={form.description ?? undefined}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </FormField>

      <FormField title="Content Rating">
        <Select
          placeholder="rating"
          label="rating"
          items={CONTENT_RATING}
          value={form.isExplicit}
          onChange={(value) => setForm({ ...form, isExplicit: value ?? false })}
        />
      </FormField>
      <div style={{ display: 'flex', gap: '20px' }}>
        <Button
          onClick={() => {
            const newDraft = addDraft(form)
            if (newDraft) {
              setCurrentDraft(newDraft.id)
            }
          }}
        >
          Create new draft
        </Button>
        {currentDraftId && <Button onClick={() => updateDraft(currentDraftId, form)}>Save this draft</Button>}
        <Button
          onClick={() => {
            removeDrafts([currentDraftId])
            setCurrentDraft('')
          }}
        >
          Discard draft
        </Button>
        <Button
          onClick={() => {
            removeAllDrafts(activeChannelId ?? '')
            setCurrentDraft('')
          }}
        >
          Remove all drafts
        </Button>
      </div>
      <Text variant="h500" style={{ margin: '20px 0' }}>
        Saved drafts
      </Text>
      <pre>{JSON.stringify(drafts, null, 2)}</pre>
    </div>
  )
}
