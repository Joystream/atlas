/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: followChannel
// ====================================================

export interface followChannel_followChannel {
  __typename: "ChannelFollowsInfo";
  id: string;
  follows: number;
}

export interface followChannel {
  followChannel: followChannel_followChannel;
}

export interface followChannelVariables {
  channelId: string;
}
