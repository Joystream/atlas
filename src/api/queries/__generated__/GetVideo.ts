/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetVideo
// ====================================================

export interface GetVideo_video_category {
  __typename: "Category";
  id: string;
}

export interface GetVideo_video_media_location_HttpMediaLocation {
  __typename: "HttpMediaLocation";
  url: string;
}

export interface GetVideo_video_media_location_JoystreamMediaLocation {
  __typename: "JoystreamMediaLocation";
  dataObjectId: string;
}

export type GetVideo_video_media_location = GetVideo_video_media_location_HttpMediaLocation | GetVideo_video_media_location_JoystreamMediaLocation;

export interface GetVideo_video_media {
  __typename: "VideoMedia";
  id: string;
  pixelHeight: number | null;
  pixelWidth: number;
  location: GetVideo_video_media_location;
}

export interface GetVideo_video_channel {
  __typename: "Channel";
  id: string;
  avatarPhotoUrl: string | null;
  handle: string;
}

export interface GetVideo_video_license_type_KnownLicense {
  __typename: "KnownLicense";
  code: string;
  url: string | null;
}

export interface GetVideo_video_license_type_UserDefinedLicense {
  __typename: "UserDefinedLicense";
  content: string;
}

export type GetVideo_video_license_type = GetVideo_video_license_type_KnownLicense | GetVideo_video_license_type_UserDefinedLicense;

export interface GetVideo_video_license {
  __typename: "LicenseEntity";
  id: string;
  attribution: string | null;
  type: GetVideo_video_license_type;
}

export interface GetVideo_video {
  __typename: "Video";
  id: string;
  title: string;
  description: string;
  category: GetVideo_video_category;
  views: number | null;
  duration: number;
  thumbnailUrl: string;
  createdAt: GQLDate;
  media: GetVideo_video_media;
  channel: GetVideo_video_channel;
  license: GetVideo_video_license;
}

export interface GetVideo {
  video: GetVideo_video | null;
}

export interface GetVideoVariables {
  id: string;
}
