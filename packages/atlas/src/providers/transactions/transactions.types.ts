import { ErrorCode, ExtrinsicStatus } from '@/joystream-lib'

export type Transaction = {
  id: string
  status: ExtrinsicStatus
  errorCode: ErrorCode | null
  isMinimized: boolean
}
