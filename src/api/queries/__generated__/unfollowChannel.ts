/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UnfollowChannel
// ====================================================

export interface UnfollowChannel_unfollowChannel {
  __typename: "ChannelFollowsInfo";
  id: string;
  follows: number;
}

export interface UnfollowChannel {
  unfollowChannel: UnfollowChannel_unfollowChannel;
}

export interface UnfollowChannelVariables {
  channelId: string;
}
