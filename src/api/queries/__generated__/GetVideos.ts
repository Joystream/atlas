/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetVideos
// ====================================================

export interface GetVideos_videos_category {
  __typename: "Category";
  id: string;
}

export interface GetVideos_videos_media_location_HttpMediaLocation {
  __typename: "HttpMediaLocation";
  url: string;
}

export interface GetVideos_videos_media_location_JoystreamMediaLocation {
  __typename: "JoystreamMediaLocation";
  dataObjectId: string;
}

export type GetVideos_videos_media_location = GetVideos_videos_media_location_HttpMediaLocation | GetVideos_videos_media_location_JoystreamMediaLocation;

export interface GetVideos_videos_media {
  __typename: "VideoMedia";
  id: string;
  pixelHeight: number;
  pixelWidth: number;
  location: GetVideos_videos_media_location;
}

export interface GetVideos_videos_channel {
  __typename: "Channel";
  id: string;
  avatarPhotoUrl: string | null;
  handle: string;
}

export interface GetVideos_videos_license_type_KnownLicense {
  __typename: "KnownLicense";
  code: string;
  url: string | null;
}

export interface GetVideos_videos_license_type_UserDefinedLicense {
  __typename: "UserDefinedLicense";
  content: string;
}

export type GetVideos_videos_license_type = GetVideos_videos_license_type_KnownLicense | GetVideos_videos_license_type_UserDefinedLicense;

export interface GetVideos_videos_license {
  __typename: "LicenseEntity";
  id: string;
  attribution: string | null;
  type: GetVideos_videos_license_type;
}

export interface GetVideos_videos {
  __typename: "Video";
  id: string;
  title: string;
  description: string;
  category: GetVideos_videos_category;
  views: number | null;
  duration: number;
  thumbnailUrl: string;
  createdAt: GQLDate;
  media: GetVideos_videos_media;
  channel: GetVideos_videos_channel;
  license: GetVideos_videos_license;
}

export interface GetVideos {
  videos: GetVideos_videos[] | null;
}

export interface GetVideosVariables {
  ids?: string[] | null;
}
