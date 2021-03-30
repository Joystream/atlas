import { useDrafts, VideoDraft } from '@/hooks'
import { FormField, Button, Text } from '@/shared/components'
import Select from '@/shared/components/Select'
import TextArea from '@/shared/components/TextArea'
import TextField from '@/shared/components/TextField'
import { css } from '@emotion/react'
import React, { useState } from 'react'

const INITIAL_STATE: Omit<VideoDraft, 'id' | 'updatedAt' | 'type'> = {
  channelId: '100',
  title: '',
  description: '',
  isExplicit: undefined,
}

const CONTENT_RATING = [
  { value: false, name: 'all' },
  { value: true, name: 'mature' },
]

const PlaygroundDrafts = () => {
  const [form, setForm] = useState(INITIAL_STATE)
  const { drafts, getDraft, removeDraft, removeAllDrafts, updateDraft, addDraft } = useDrafts('video')
  const [currentDraftId, setCurrentDraftId] = useState('')

  const setCurrentDraft = async (draftID: string) => {
    setCurrentDraftId(draftID)
    const draft = await getDraft(draftID)
    if (draft) {
      const { title, description, isExplicit, channelId } = draft
      setForm({ title, description, isExplicit, channelId })
    } else {
      setForm(INITIAL_STATE)
    }
  }

  const draftsIds = drafts.map((draft) => ({ value: draft.id, name: draft.id }))

  return (
    <div style={{ maxWidth: '600px' }}>
      <Text variant="h3">Testing drafts</Text>

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
        <TextField label="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
      </FormField>
      <FormField title="Your description">
        <TextArea
          placeholder="description"
          value={form.description}
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
          onClick={async () => {
            const newDraft = await addDraft(form)
            if (newDraft) {
              setCurrentDraft(newDraft.id)
            }
          }}
        >
          Create new draft
        </Button>
        {currentDraftId && (
          <Button onClick={async () => await updateDraft(currentDraftId, form)}>Save this draft</Button>
        )}
        <Button
          onClick={async () => {
            await removeDraft(currentDraftId)
            setCurrentDraft('')
          }}
        >
          Discard draft
        </Button>
        <Button
          onClick={async () => {
            await removeAllDrafts()
            setCurrentDraft('')
          }}
        >
          Remove all drafts
        </Button>
      </div>
      <Text
        variant="h4"
        css={css`
          margin: 20px 0;
        `}
      >
        Saved drafts
      </Text>
      <pre>{JSON.stringify(drafts, null, 2)}</pre>
    </div>
  )
}

export default PlaygroundDrafts
