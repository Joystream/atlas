/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetChannels
// ====================================================

export interface GetChannels_channels {
  __typename: "Channel";
  id: string;
  handle: string;
  avatarPhotoUrl: string | null;
  coverPhotoUrl: string | null;
  follows: number | null;
}

export interface GetChannels {
  channels: GetChannels_channels[] | null;
}

export interface GetChannelsVariables {
  ids?: string[] | null;
}
