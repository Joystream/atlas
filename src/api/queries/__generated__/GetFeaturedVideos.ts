/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetFeaturedVideos
// ====================================================

export interface GetFeaturedVideos_featured_videos_category {
  __typename: "Category";
  id: string;
}

export interface GetFeaturedVideos_featured_videos_media_location_HttpMediaLocation {
  __typename: "HttpMediaLocation";
  url: string;
}

export interface GetFeaturedVideos_featured_videos_media_location_JoystreamMediaLocation {
  __typename: "JoystreamMediaLocation";
  dataObjectId: string;
}

export type GetFeaturedVideos_featured_videos_media_location = GetFeaturedVideos_featured_videos_media_location_HttpMediaLocation | GetFeaturedVideos_featured_videos_media_location_JoystreamMediaLocation;

export interface GetFeaturedVideos_featured_videos_media {
  __typename: "VideoMedia";
  id: string;
  pixelHeight: number;
  pixelWidth: number;
  location: GetFeaturedVideos_featured_videos_media_location;
}

export interface GetFeaturedVideos_featured_videos_channel {
  __typename: "Channel";
  id: string;
  avatarPhotoUrl: string | null;
  handle: string;
}

export interface GetFeaturedVideos_featured_videos {
  __typename: "Video";
  id: string;
  title: string;
  description: string;
  category: GetFeaturedVideos_featured_videos_category;
  views: number | null;
  duration: number;
  thumbnailUrl: string;
  createdAt: GQLDate;
  media: GetFeaturedVideos_featured_videos_media;
  channel: GetFeaturedVideos_featured_videos_channel;
}

export interface GetFeaturedVideos {
  featured_videos: GetFeaturedVideos_featured_videos[];
}
