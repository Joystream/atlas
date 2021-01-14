/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetNewestVideos
// ====================================================

export interface GetNewestVideos_videosConnection_edges_node_category {
  __typename: "Category";
  id: string;
}

export interface GetNewestVideos_videosConnection_edges_node_media_location_HttpMediaLocation {
  __typename: "HttpMediaLocation";
  url: string;
}

export interface GetNewestVideos_videosConnection_edges_node_media_location_JoystreamMediaLocation {
  __typename: "JoystreamMediaLocation";
  dataObjectId: string;
}

export type GetNewestVideos_videosConnection_edges_node_media_location = GetNewestVideos_videosConnection_edges_node_media_location_HttpMediaLocation | GetNewestVideos_videosConnection_edges_node_media_location_JoystreamMediaLocation;

export interface GetNewestVideos_videosConnection_edges_node_media {
  __typename: "VideoMedia";
  id: string;
  pixelHeight: number;
  pixelWidth: number;
  location: GetNewestVideos_videosConnection_edges_node_media_location;
}

export interface GetNewestVideos_videosConnection_edges_node_channel {
  __typename: "Channel";
  id: string;
  avatarPhotoUrl: string | null;
  handle: string;
}

export interface GetNewestVideos_videosConnection_edges_node_license_type_KnownLicense {
  __typename: "KnownLicense";
  code: string;
  url: string | null;
}

export interface GetNewestVideos_videosConnection_edges_node_license_type_UserDefinedLicense {
  __typename: "UserDefinedLicense";
  content: string;
}

export type GetNewestVideos_videosConnection_edges_node_license_type = GetNewestVideos_videosConnection_edges_node_license_type_KnownLicense | GetNewestVideos_videosConnection_edges_node_license_type_UserDefinedLicense;

export interface GetNewestVideos_videosConnection_edges_node_license {
  __typename: "LicenseEntity";
  id: string;
  attribution: string | null;
  type: GetNewestVideos_videosConnection_edges_node_license_type;
}

export interface GetNewestVideos_videosConnection_edges_node {
  __typename: "Video";
  id: string;
  title: string;
  description: string;
  category: GetNewestVideos_videosConnection_edges_node_category;
  views: number | null;
  duration: number;
  thumbnailUrl: string;
  createdAt: GQLDate;
  media: GetNewestVideos_videosConnection_edges_node_media;
  channel: GetNewestVideos_videosConnection_edges_node_channel;
  license: GetNewestVideos_videosConnection_edges_node_license;
}

export interface GetNewestVideos_videosConnection_edges {
  __typename: "VideoEdge";
  cursor: string;
  node: GetNewestVideos_videosConnection_edges_node;
}

export interface GetNewestVideos_videosConnection_pageInfo {
  __typename: "PageInfo";
  hasNextPage: boolean;
  endCursor: string | null;
}

export interface GetNewestVideos_videosConnection {
  __typename: "VideoConnection";
  edges: GetNewestVideos_videosConnection_edges[];
  pageInfo: GetNewestVideos_videosConnection_pageInfo;
  totalCount: number;
}

export interface GetNewestVideos {
  videosConnection: GetNewestVideos_videosConnection;
}

export interface GetNewestVideosVariables {
  first?: number | null;
  after?: string | null;
  categoryId?: string | null;
  channelId?: string | null;
}
