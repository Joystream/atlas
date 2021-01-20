/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: FollowChannel
// ====================================================

export interface FollowChannel_followChannel {
  __typename: "ChannelFollowsInfo";
  id: string;
  follows: number;
}

export interface FollowChannel {
  followChannel: FollowChannel_followChannel;
}

export interface FollowChannelVariables {
  channelId: string;
}
