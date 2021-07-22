import { WorkerType } from '@/api/queries'
import { BasicWorkerFieldsFragment } from '@/api/queries/__generated__/workers.generated'

export const mockWorkers: BasicWorkerFieldsFragment[] = [
  {
    __typename: 'Worker',
    id: 'mock_worker',
    workerId: '123',
    metadata: 'http://google.com/storage',
    type: WorkerType.Storage,
    isActive: true,
  },
]
