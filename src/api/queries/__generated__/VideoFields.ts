/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: VideoFields
// ====================================================

export interface VideoFields_category {
  __typename: "Category";
  id: string;
}

export interface VideoFields_media_location_HttpMediaLocation {
  __typename: "HttpMediaLocation";
  url: string;
}

export interface VideoFields_media_location_JoystreamMediaLocation {
  __typename: "JoystreamMediaLocation";
  dataObjectId: string;
}

export type VideoFields_media_location = VideoFields_media_location_HttpMediaLocation | VideoFields_media_location_JoystreamMediaLocation;

export interface VideoFields_media {
  __typename: "VideoMedia";
  id: string;
  pixelHeight: number | null;
  pixelWidth: number;
  location: VideoFields_media_location;
}

export interface VideoFields_channel {
  __typename: "Channel";
  id: string;
  avatarPhotoUrl: string | null;
  handle: string;
}

export interface VideoFields_license_type_KnownLicense {
  __typename: "KnownLicense";
  code: string;
  url: string | null;
}

export interface VideoFields_license_type_UserDefinedLicense {
  __typename: "UserDefinedLicense";
  content: string;
}

export type VideoFields_license_type = VideoFields_license_type_KnownLicense | VideoFields_license_type_UserDefinedLicense;

export interface VideoFields_license {
  __typename: "LicenseEntity";
  id: string;
  attribution: string | null;
  type: VideoFields_license_type;
}

export interface VideoFields {
  __typename: "Video";
  id: string;
  title: string;
  description: string;
  category: VideoFields_category;
  views: number | null;
  duration: number;
  thumbnailUrl: string;
  createdAt: GQLDate;
  media: VideoFields_media;
  channel: VideoFields_channel;
  license: VideoFields_license;
}
