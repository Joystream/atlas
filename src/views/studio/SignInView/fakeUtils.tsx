// this file is temporary

import { writeToLocalStorage, readFromLocalStorage } from '@/utils/localStorage'
import { promisify } from '@/utils/data'
import { Membership } from './SignInView'

export type Account = {
  accountId: string
  accountName: string
  accountBalance: number
  memberships: Membership[]
}

export const installPolkadot = () => {
  writeToLocalStorage('fakePolkaDot', true)
}
export const checkPolkadot = promisify(() => readFromLocalStorage<boolean>('fakePolkaDot') || false)

export const getAccounts = promisify(() => readFromLocalStorage<Account[]>('accounts') || [])

export const getAccount = async (accountId: string) => {
  const accounts = await getAccounts()
  return accounts.find((account) => account.accountId === accountId)
}

export const createFakeAccount = async (accountName: string, accountBalance = 0) => {
  const fakeId = Date.now().toString()
  const presentAccounts = await getAccounts()
  writeToLocalStorage('accounts', [
    ...presentAccounts,
    { accountId: fakeId, accountName, accountBalance, memberships: [] },
  ])
}

export const createFakeMembership = async (accountId: string, membership: Omit<Membership, 'id'>) => {
  const fakeId = Date.now().toString()
  const accounts = await getAccounts()
  const accountToUpdate = accounts.find((account) => account.accountId === accountId)
  if (!accountToUpdate) {
    return
  }
  accountToUpdate.memberships = [...accountToUpdate.memberships, { ...membership, id: fakeId }]
  writeToLocalStorage('accounts', [accountToUpdate, ...accounts.filter((account) => account.accountId !== accountId)])
}

export const getAccountMemberships = async (accountId: string) => {
  const account = await getAccount(accountId)
  if (!account) {
    return
  }
  return account.memberships
}
