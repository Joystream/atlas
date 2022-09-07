import { ErrorCode } from '@/joystream-lib/errors'
import { ExtrinsicStatus } from '@/joystream-lib/types'

export type Transaction = {
  id: string
  status: ExtrinsicStatus
  errorCode: ErrorCode | null
  isMinimized: boolean
  unsignedMessage?: string
}
