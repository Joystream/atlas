/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Search
// ====================================================

export interface Search_search_item_Video_category {
  __typename: "Category";
  id: string;
}

export interface Search_search_item_Video_media_location_HttpMediaLocation {
  __typename: "HttpMediaLocation";
  url: string;
}

export interface Search_search_item_Video_media_location_JoystreamMediaLocation {
  __typename: "JoystreamMediaLocation";
  dataObjectId: string;
}

export type Search_search_item_Video_media_location = Search_search_item_Video_media_location_HttpMediaLocation | Search_search_item_Video_media_location_JoystreamMediaLocation;

export interface Search_search_item_Video_media {
  __typename: "VideoMedia";
  id: string;
  pixelHeight: number | null;
  pixelWidth: number;
  location: Search_search_item_Video_media_location;
}

export interface Search_search_item_Video_channel {
  __typename: "Channel";
  id: string;
  avatarPhotoUrl: string | null;
  handle: string;
}

export interface Search_search_item_Video_license_type_KnownLicense {
  __typename: "KnownLicense";
  code: string;
  url: string | null;
}

export interface Search_search_item_Video_license_type_UserDefinedLicense {
  __typename: "UserDefinedLicense";
  content: string;
}

export type Search_search_item_Video_license_type = Search_search_item_Video_license_type_KnownLicense | Search_search_item_Video_license_type_UserDefinedLicense;

export interface Search_search_item_Video_license {
  __typename: "LicenseEntity";
  id: string;
  attribution: string | null;
  type: Search_search_item_Video_license_type;
}

export interface Search_search_item_Video {
  __typename: "Video";
  id: string;
  title: string;
  description: string;
  category: Search_search_item_Video_category;
  views: number | null;
  duration: number;
  thumbnailUrl: string;
  createdAt: GQLDate;
  media: Search_search_item_Video_media;
  channel: Search_search_item_Video_channel;
  license: Search_search_item_Video_license;
}

export interface Search_search_item_Channel {
  __typename: "Channel";
  id: string;
  handle: string;
  avatarPhotoUrl: string | null;
}

export type Search_search_item = Search_search_item_Video | Search_search_item_Channel;

export interface Search_search {
  __typename: "SearchFTSOutput";
  item: Search_search_item;
  rank: number;
}

export interface Search {
  search: Search_search[];
}

export interface SearchVariables {
  text: string;
}
