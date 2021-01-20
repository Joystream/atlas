/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: unfollowChannel
// ====================================================

export interface unfollowChannel_unfollowChannel {
  __typename: "ChannelFollowsInfo";
  id: string;
  follows: number;
}

export interface unfollowChannel {
  unfollowChannel: unfollowChannel_unfollowChannel;
}

export interface unfollowChannelVariables {
  channelId: string;
}
