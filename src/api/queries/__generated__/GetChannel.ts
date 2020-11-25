/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetChannel
// ====================================================

export interface GetChannel_channel_videos_category {
  __typename: "Category";
  id: string;
}

export interface GetChannel_channel_videos_media_location_HttpMediaLocation {
  __typename: "HttpMediaLocation";
  url: string;
}

export interface GetChannel_channel_videos_media_location_JoystreamMediaLocation {
  __typename: "JoystreamMediaLocation";
  dataObjectId: string;
}

export type GetChannel_channel_videos_media_location = GetChannel_channel_videos_media_location_HttpMediaLocation | GetChannel_channel_videos_media_location_JoystreamMediaLocation;

export interface GetChannel_channel_videos_media {
  __typename: "VideoMedia";
  id: string;
  pixelHeight: number;
  pixelWidth: number;
  location: GetChannel_channel_videos_media_location;
}

export interface GetChannel_channel_videos_channel {
  __typename: "Channel";
  id: string;
  avatarPhotoUrl: string | null;
  handle: string;
}

export interface GetChannel_channel_videos {
  __typename: "Video";
  id: string;
  title: string;
  description: string;
  category: GetChannel_channel_videos_category;
  views: number | null;
  duration: number;
  thumbnailUrl: string;
  createdAt: GQLDate;
  media: GetChannel_channel_videos_media;
  channel: GetChannel_channel_videos_channel;
}

export interface GetChannel_channel {
  __typename: "Channel";
  id: string;
  handle: string;
  avatarPhotoUrl: string | null;
  coverPhotoUrl: string | null;
  videos: GetChannel_channel_videos[];
}

export interface GetChannel {
  channel: GetChannel_channel | null;
}

export interface GetChannelVariables {
  id: string;
}
