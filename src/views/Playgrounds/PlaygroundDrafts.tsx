import { useDraft } from '@/hooks/useDrafts/useDrafts'
import { FormField, Button, Text } from '@/shared/components'
import Select from '@/shared/components/Select'
import TextArea from '@/shared/components/TextArea'
import TextField from '@/shared/components/TextField'
import { css } from '@emotion/react'
import React, { useState } from 'react'

const INITIAL_STATE = {
  firstName: '',
  lastName: '',
  description: '',
  favouriteFruit: '',
}

const FRUITS = [
  { value: 'banana', name: 'banana' },
  { value: 'apple', name: 'apple' },
  { value: 'cherry', name: 'cherry' },
  { value: 'kiwi', name: 'kiwi' },
]

const PlaygroundDrafts = () => {
  const [form, setForm] = useState(INITIAL_STATE)
  const { drafts, createOrSaveDraft, getSingleDraft, discardDraft, discardAllDrafts } = useDraft<typeof form>(form)

  const [currentDraftId, setCurrentDraftId] = useState('')

  const setCurrentDraft = async (draftID: string) => {
    setCurrentDraftId(draftID)
    const draft = await getSingleDraft(draftID)
    if (draft) {
      setForm(draft)
    } else {
      setForm(INITIAL_STATE)
    }
  }

  const fakeId = new Date().getTime().toString()
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
            value={{ name: currentDraftId, value: currentDraftId }}
            onChange={({ selectedItem }) => selectedItem?.value && setCurrentDraft(selectedItem.value)}
          />
        </FormField>
      )}

      <FormField title="Your description">
        <TextArea
          placeholder="description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </FormField>

      <FormField title="Your first name">
        <TextField
          label="first name"
          value={form.firstName}
          onChange={(e) => setForm({ ...form, firstName: e.target.value })}
        />
      </FormField>
      <FormField title="Your second name">
        <TextField
          label="second name"
          value={form.lastName}
          onChange={(e) => setForm({ ...form, lastName: e.target.value })}
        />
      </FormField>
      <FormField title="Your favourite fruit">
        <Select
          placeholder="favourite fruit"
          label="favourite fruit"
          items={FRUITS}
          value={{ value: form.favouriteFruit, name: form.favouriteFruit }}
          onChange={({ selectedItem }) => setForm({ ...form, favouriteFruit: selectedItem?.value || '' })}
        />
      </FormField>
      <div style={{ display: 'flex', gap: '20px' }}>
        <Button
          onClick={async () => {
            await createOrSaveDraft(fakeId)
            setCurrentDraft(fakeId)
          }}
        >
          Create new draft
        </Button>
        {currentDraftId && <Button onClick={() => createOrSaveDraft(currentDraftId)}>Save this draft</Button>}
        <Button
          onClick={async () => {
            await discardDraft(currentDraftId)
            setCurrentDraft('')
          }}
        >
          Discard draft
        </Button>
        <Button
          onClick={async () => {
            await discardAllDrafts()
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
