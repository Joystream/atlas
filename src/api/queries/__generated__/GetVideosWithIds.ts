/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetVideosWithIds
// ====================================================

export interface GetVideosWithIds_videosConnection_edges_node_category {
  __typename: "Category";
  id: string;
}

export interface GetVideosWithIds_videosConnection_edges_node_media_location_HttpMediaLocation {
  __typename: "HttpMediaLocation";
  url: string;
}

export interface GetVideosWithIds_videosConnection_edges_node_media_location_JoystreamMediaLocation {
  __typename: "JoystreamMediaLocation";
  dataObjectId: string;
}

export type GetVideosWithIds_videosConnection_edges_node_media_location = GetVideosWithIds_videosConnection_edges_node_media_location_HttpMediaLocation | GetVideosWithIds_videosConnection_edges_node_media_location_JoystreamMediaLocation;

export interface GetVideosWithIds_videosConnection_edges_node_media {
  __typename: "VideoMedia";
  id: string;
  pixelHeight: number;
  pixelWidth: number;
  location: GetVideosWithIds_videosConnection_edges_node_media_location;
}

export interface GetVideosWithIds_videosConnection_edges_node_channel {
  __typename: "Channel";
  id: string;
  avatarPhotoUrl: string | null;
  handle: string;
}

export interface GetVideosWithIds_videosConnection_edges_node_license_type_KnownLicense {
  __typename: "KnownLicense";
  code: string;
  url: string | null;
}

export interface GetVideosWithIds_videosConnection_edges_node_license_type_UserDefinedLicense {
  __typename: "UserDefinedLicense";
  content: string;
}

export type GetVideosWithIds_videosConnection_edges_node_license_type = GetVideosWithIds_videosConnection_edges_node_license_type_KnownLicense | GetVideosWithIds_videosConnection_edges_node_license_type_UserDefinedLicense;

export interface GetVideosWithIds_videosConnection_edges_node_license {
  __typename: "LicenseEntity";
  id: string;
  attribution: string | null;
  type: GetVideosWithIds_videosConnection_edges_node_license_type;
}

export interface GetVideosWithIds_videosConnection_edges_node {
  __typename: "Video";
  id: string;
  title: string;
  description: string;
  category: GetVideosWithIds_videosConnection_edges_node_category;
  views: number | null;
  duration: number;
  thumbnailUrl: string;
  createdAt: GQLDate;
  media: GetVideosWithIds_videosConnection_edges_node_media;
  channel: GetVideosWithIds_videosConnection_edges_node_channel;
  license: GetVideosWithIds_videosConnection_edges_node_license;
}

export interface GetVideosWithIds_videosConnection_edges {
  __typename: "VideoEdge";
  cursor: string;
  node: GetVideosWithIds_videosConnection_edges_node;
}

export interface GetVideosWithIds_videosConnection_pageInfo {
  __typename: "PageInfo";
  hasNextPage: boolean;
  endCursor: string | null;
}

export interface GetVideosWithIds_videosConnection {
  __typename: "VideoConnection";
  edges: GetVideosWithIds_videosConnection_edges[];
  pageInfo: GetVideosWithIds_videosConnection_pageInfo;
  totalCount: number;
}

export interface GetVideosWithIds {
  videosConnection: GetVideosWithIds_videosConnection;
}

export interface GetVideosWithIdsVariables {
  ids: string[];
}
