/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetVideosWithIds
// ====================================================

export interface GetVideosWithIds_videos_category {
  __typename: "Category";
  id: string;
}

export interface GetVideosWithIds_videos_media_location_HttpMediaLocation {
  __typename: "HttpMediaLocation";
  url: string;
}

export interface GetVideosWithIds_videos_media_location_JoystreamMediaLocation {
  __typename: "JoystreamMediaLocation";
  dataObjectId: string;
}

export type GetVideosWithIds_videos_media_location = GetVideosWithIds_videos_media_location_HttpMediaLocation | GetVideosWithIds_videos_media_location_JoystreamMediaLocation;

export interface GetVideosWithIds_videos_media {
  __typename: "VideoMedia";
  id: string;
  pixelHeight: number;
  pixelWidth: number;
  location: GetVideosWithIds_videos_media_location;
}

export interface GetVideosWithIds_videos_channel {
  __typename: "Channel";
  id: string;
  avatarPhotoUrl: string | null;
  handle: string;
}

export interface GetVideosWithIds_videos_license_type_KnownLicense {
  __typename: "KnownLicense";
  code: string;
  url: string | null;
}

export interface GetVideosWithIds_videos_license_type_UserDefinedLicense {
  __typename: "UserDefinedLicense";
  content: string;
}

export type GetVideosWithIds_videos_license_type = GetVideosWithIds_videos_license_type_KnownLicense | GetVideosWithIds_videos_license_type_UserDefinedLicense;

export interface GetVideosWithIds_videos_license {
  __typename: "LicenseEntity";
  id: string;
  attribution: string | null;
  type: GetVideosWithIds_videos_license_type;
}

export interface GetVideosWithIds_videos {
  __typename: "Video";
  id: string;
  title: string;
  description: string;
  category: GetVideosWithIds_videos_category;
  views: number | null;
  duration: number;
  thumbnailUrl: string;
  createdAt: GQLDate;
  media: GetVideosWithIds_videos_media;
  channel: GetVideosWithIds_videos_channel;
  license: GetVideosWithIds_videos_license;
}

export interface GetVideosWithIds {
  videos: GetVideosWithIds_videos[] | null;
}

export interface GetVideosWithIdsVariables {
  ids: string[];
}
