import { HoldersTable } from '@/components/_crt/HoldersTable/HoldersTable'

export const CrtHoldersTab = () => {
  return (
    <HoldersTable
      data={[
        {
          memberId: '1',
          transferable: 1000,
          allocation: 100,
          total: 1000,
          vested: 0,
        },
      ]}
      isLoading={true}
      currentMemberId="1"
    />
  )
}
