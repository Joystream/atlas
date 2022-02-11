import React from 'react'

import { EmptyFallback } from '@/components/EmptyFallback'

export const MemberNFTs = () => {
  return (
    <section>
      <EmptyFallback
        title="No NFTs collected"
        subtitle="This member hasn't started the collection yet."
        variant="small"
      />
    </section>
  )
}
