import styled from '@emotion/styled'
import { Meta, StoryFn } from '@storybook/react'
import { useState } from 'react'

import { SvgActionCancel } from '@/assets/icons'
import { OutputPill } from '@/components/OutputPill'
import { sizes } from '@/styles'
import { createLookup } from '@/utils/data'

import { ComboBox, ComboBoxProps } from '.'

const MEMBERS = [
  {
    id: 1,
    label: 'Klaudiusz',
    thumbnailUrl: ['https://placedog.net/57/32?random=1'],
  },
  {
    id: 2,
    label: 'Diego',
    thumbnailUrl: ['https://placedog.net/57/32?random=2'],
  },
  {
    id: 3,
    label: 'Rafal',
    thumbnailUrl: ['https://placedog.net/57/32?random=3'],
  },
  {
    id: 3,
    label: 'Loic',
    thumbnailUrl: ['https://placedog.net/57/32?random=4'],
  },
  {
    id: 4,
    label: 'Bartosz',
    thumbnailUrl: ['https://placedog.net/57/32?random=5'],
  },
  {
    id: 5,
    label: 'Klaudiusz the Second',
    thumbnailUrl: ['https://placedog.net/57/32?random=6'],
  },
  {
    id: 6,
    label: 'Diego the Second',
    thumbnailUrl: ['https://placedog.net/57/32?random=7'],
  },
  {
    id: 7,
    label: 'Rafal the Second',
    thumbnailUrl: ['https://placedog.net/57/32?random=8'],
  },
  {
    id: 8,
    label: 'Loic the Second',
    thumbnailUrl: ['https://placedog.net/57/32?random=9'],
  },
  {
    id: 9,
    label: 'Bartosz the Second',
    thumbnailUrl: ['https://placedog.net/57/32?random=10'],
  },
  {
    id: 10,
    label: 'Klaudiusz the Third',
    thumbnailUrl: ['https://placedog.net/57/32?random=11'],
  },
  {
    id: 11,
    label: 'Diego the Third',
    thumbnailUrl: ['https://placedog.net/57/32?random=12'],
  },
  {
    id: 12,
    label: 'Rafal the Third',
    thumbnailUrl: ['https://placedog.net/57/32?random=13'],
  },
  {
    id: 13,
    label: 'Loic the Third',
    thumbnailUrl: ['https://placedog.net/57/32?random=14'],
  },
  {
    id: 14,
    label: 'Bartosz the Third',
    thumbnailUrl: ['https://placedog.net/57/32?random=15'],
  },
]

export default {
  title: 'inputs/ComboBox',
  component: ComboBox,
  argTypes: {
    items: { table: { disable: true } },
    type: { table: { disable: true } },
    isSelect: { table: { disable: true } },
    nodeStart: { table: { disable: true } },
    nodeEnd: { table: { disable: true } },
    onChange: { table: { disable: true } },
    onBlur: { table: { disable: true } },
    onFocus: { table: { disable: true } },
    onKeyDown: { table: { disable: true } },
    onClick: { table: { disable: true } },
    onSelectedItemChange: { table: { disable: true } },
    onInputValueChange: { table: { disable: true } },
    notFoundNode: { table: { disable: true } },
    autoComplete: { table: { disable: true } },
    name: { table: { disable: true } },
    value: { table: { disable: true } },
    required: { table: { disable: true } },
    className: { table: { disable: true } },
    defaultValue: { table: { disable: true } },
    charactersCount: { table: { disable: true } },
    maxLength: { table: { disable: true } },
    onWheel: { table: { disable: true } },
    resetOnSelect: { table: { disable: true } },
    size: { table: { disable: true } },
    actionButton: { table: { disable: true } },
  },
  args: {
    placeholder: 'Type name here',
    notFoundNode: {
      label: 'Item not found',
      nodeStart: <SvgActionCancel />,
    },
    helperText: 'Some helper text here',
    processing: false,
  },
} as Meta<ComboBoxProps>

const Template: StoryFn<ComboBoxProps> = (args) => {
  return <ComboBox items={MEMBERS.map((member) => ({ label: member.label }))} {...args} />
}

export const Default = Template.bind({})

type Member = { label: string; thumbnailUrl: string[]; id: string }
const TemplateWithMembers: StoryFn<ComboBoxProps> = (args) => {
  const [selectedMembers, setSelectedMembers] = useState<Member[]>([])
  const [focusedElement, setFocusedElement] = useState<number | null>(null)

  const handleSelectMember = (item?: Member) => {
    if (!item) {
      return
    }
    setSelectedMembers((prev) => [...prev, item])
  }

  const handleDeleteMember = (memberId?: string, id?: number) => {
    setSelectedMembers((prev) => prev.filter((existingMember) => existingMember.id !== memberId))
    if (id) {
      setFocusedElement(id === 0 ? null : id - 1)
    }
  }

  const selectedMembersLookup = selectedMembers ? createLookup(selectedMembers) : {}

  const dropdownItems = MEMBERS.map((item) => ({ ...item, id: item.id.toString() })).filter(
    (member) => !selectedMembersLookup[member.id]
  )

  return (
    <div>
      <ComboBox
        {...args}
        onSelectedItemChange={handleSelectMember}
        items={dropdownItems.map((member) => ({
          id: member.id,
          label: member.label,
          thumbnailUrl: [],
        }))}
        resetOnSelect
      />
      <MemberBadgesWrapper>
        {selectedMembers.map((member, idx) => (
          <OutputPill
            withAvatar
            avatarUri={member.thumbnailUrl}
            key={member.id}
            handle={member.label}
            onDeleteClick={() => handleDeleteMember(member.id)}
            onKeyPress={() => handleDeleteMember(member.id, idx)}
            focused={focusedElement === idx}
          />
        ))}
      </MemberBadgesWrapper>
    </div>
  )
}

export const WithMembers = TemplateWithMembers.bind({})

const TemplateWithSeparators: StoryFn<ComboBoxProps> = (args) => {
  const mappedItems = [
    { label: 'TOP MEMBERS', value: '', isSeparator: true },
    ...MEMBERS.slice(0, 3),
    { label: 'ALL MEMBERS', value: '', isSeparator: true },
    ...MEMBERS,
  ]

  return <ComboBox items={mappedItems} {...args} />
}

export const WithSeparators = TemplateWithSeparators.bind({})

const MemberBadgesWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: ${sizes(4)};
  gap: ${sizes(3)};
`
