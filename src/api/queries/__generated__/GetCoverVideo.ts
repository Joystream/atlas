/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetCoverVideo
// ====================================================

export interface GetCoverVideo_coverVideo_video_category {
  __typename: "Category";
  id: string;
}

export interface GetCoverVideo_coverVideo_video_media_location_HttpMediaLocation {
  __typename: "HttpMediaLocation";
  url: string;
}

export interface GetCoverVideo_coverVideo_video_media_location_JoystreamMediaLocation {
  __typename: "JoystreamMediaLocation";
  dataObjectId: string;
}

export type GetCoverVideo_coverVideo_video_media_location = GetCoverVideo_coverVideo_video_media_location_HttpMediaLocation | GetCoverVideo_coverVideo_video_media_location_JoystreamMediaLocation;

export interface GetCoverVideo_coverVideo_video_media {
  __typename: "VideoMedia";
  id: string;
  pixelHeight: number;
  pixelWidth: number;
  location: GetCoverVideo_coverVideo_video_media_location;
}

export interface GetCoverVideo_coverVideo_video_channel {
  __typename: "Channel";
  id: string;
  avatarPhotoUrl: string | null;
  handle: string;
}

export interface GetCoverVideo_coverVideo_video {
  __typename: "Video";
  id: string;
  title: string;
  description: string;
  category: GetCoverVideo_coverVideo_video_category;
  views: number | null;
  duration: number;
  thumbnailUrl: string;
  createdAt: GQLDate;
  media: GetCoverVideo_coverVideo_video_media;
  channel: GetCoverVideo_coverVideo_video_channel;
}

export interface GetCoverVideo_coverVideo_coverCutMedia_location_HttpMediaLocation {
  __typename: "HttpMediaLocation";
  url: string;
}

export interface GetCoverVideo_coverVideo_coverCutMedia_location_JoystreamMediaLocation {
  __typename: "JoystreamMediaLocation";
  dataObjectId: string;
}

export type GetCoverVideo_coverVideo_coverCutMedia_location = GetCoverVideo_coverVideo_coverCutMedia_location_HttpMediaLocation | GetCoverVideo_coverVideo_coverCutMedia_location_JoystreamMediaLocation;

export interface GetCoverVideo_coverVideo_coverCutMedia {
  __typename: "VideoMedia";
  id: string;
  pixelHeight: number;
  pixelWidth: number;
  location: GetCoverVideo_coverVideo_coverCutMedia_location;
}

export interface GetCoverVideo_coverVideo {
  __typename: "CoverVideo";
  video: GetCoverVideo_coverVideo_video;
  coverDescription: string;
  coverCutMedia: GetCoverVideo_coverVideo_coverCutMedia;
}

export interface GetCoverVideo {
  coverVideo: GetCoverVideo_coverVideo;
}
