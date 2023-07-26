import { useCallback } from 'react'

import { useGetMembershipsLazyQuery } from '@/api/queries/__generated__/memberships.generated'
import { createId } from '@/utils/createId'
import { removeSpecialCharacters } from '@/utils/text'

export const useUniqueMemberHandle = () => {
  const [getMemberships] = useGetMembershipsLazyQuery()

  const checkIfMemberIsAvailable = useCallback(
    async (value: string) => {
      const { data } = await getMemberships({
        variables: {
          where: {
            handle_eq: value,
          },
        },
      })
      return !data?.memberships[0]
    },
    [getMemberships]
  )

  const generateUniqueMemberHandleBasedOnInput = useCallback(
    async (userHandle: string, attempt = 1): Promise<string> => {
      const sanitizedHandle = removeSpecialCharacters(userHandle)

      if (attempt >= 5) {
        const newMemberHandle = sanitizedHandle + createId()
        const isAvailable = await checkIfMemberIsAvailable(sanitizedHandle)
        if (!isAvailable) {
          return generateUniqueMemberHandleBasedOnInput(newMemberHandle, 1)
        }
      }

      const isAvailable = await checkIfMemberIsAvailable(sanitizedHandle)
      if (!isAvailable) {
        const modified = attempt === 1 ? `${sanitizedHandle}${attempt}` : `${sanitizedHandle.slice(0, -1)}${attempt}`

        return generateUniqueMemberHandleBasedOnInput(modified, attempt + 1)
      }
      return sanitizedHandle
    },
    [checkIfMemberIsAvailable]
  )

  return { checkIfMemberIsAvailable, generateUniqueMemberHandleBasedOnInput }
}
