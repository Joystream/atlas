import { BasicWorkerFieldsFragment, WorkerType } from '@/api/queries'

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
