/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetFollowedChannelsRecentVideos
// ====================================================

export interface GetFollowedChannelsRecentVideos_videosConnection_edges_node_category {
  __typename: "Category";
  id: string;
}

export interface GetFollowedChannelsRecentVideos_videosConnection_edges_node_media_location_HttpMediaLocation {
  __typename: "HttpMediaLocation";
  url: string;
}

export interface GetFollowedChannelsRecentVideos_videosConnection_edges_node_media_location_JoystreamMediaLocation {
  __typename: "JoystreamMediaLocation";
  dataObjectId: string;
}

export type GetFollowedChannelsRecentVideos_videosConnection_edges_node_media_location = GetFollowedChannelsRecentVideos_videosConnection_edges_node_media_location_HttpMediaLocation | GetFollowedChannelsRecentVideos_videosConnection_edges_node_media_location_JoystreamMediaLocation;

export interface GetFollowedChannelsRecentVideos_videosConnection_edges_node_media {
  __typename: "VideoMedia";
  id: string;
  pixelHeight: number;
  pixelWidth: number;
  location: GetFollowedChannelsRecentVideos_videosConnection_edges_node_media_location;
}

export interface GetFollowedChannelsRecentVideos_videosConnection_edges_node_channel {
  __typename: "Channel";
  id: string;
  avatarPhotoUrl: string | null;
  handle: string;
}

export interface GetFollowedChannelsRecentVideos_videosConnection_edges_node_license_type_KnownLicense {
  __typename: "KnownLicense";
  code: string;
  url: string | null;
}

export interface GetFollowedChannelsRecentVideos_videosConnection_edges_node_license_type_UserDefinedLicense {
  __typename: "UserDefinedLicense";
  content: string;
}

export type GetFollowedChannelsRecentVideos_videosConnection_edges_node_license_type = GetFollowedChannelsRecentVideos_videosConnection_edges_node_license_type_KnownLicense | GetFollowedChannelsRecentVideos_videosConnection_edges_node_license_type_UserDefinedLicense;

export interface GetFollowedChannelsRecentVideos_videosConnection_edges_node_license {
  __typename: "LicenseEntity";
  id: string;
  attribution: string | null;
  type: GetFollowedChannelsRecentVideos_videosConnection_edges_node_license_type;
}

export interface GetFollowedChannelsRecentVideos_videosConnection_edges_node {
  __typename: "Video";
  id: string;
  title: string;
  description: string;
  category: GetFollowedChannelsRecentVideos_videosConnection_edges_node_category;
  views: number | null;
  duration: number;
  thumbnailUrl: string;
  createdAt: GQLDate;
  media: GetFollowedChannelsRecentVideos_videosConnection_edges_node_media;
  channel: GetFollowedChannelsRecentVideos_videosConnection_edges_node_channel;
  license: GetFollowedChannelsRecentVideos_videosConnection_edges_node_license;
}

export interface GetFollowedChannelsRecentVideos_videosConnection_edges {
  __typename: "VideoEdge";
  cursor: string;
  node: GetFollowedChannelsRecentVideos_videosConnection_edges_node;
}

export interface GetFollowedChannelsRecentVideos_videosConnection_pageInfo {
  __typename: "PageInfo";
  hasNextPage: boolean;
  endCursor: string | null;
}

export interface GetFollowedChannelsRecentVideos_videosConnection {
  __typename: "VideoConnection";
  edges: GetFollowedChannelsRecentVideos_videosConnection_edges[];
  pageInfo: GetFollowedChannelsRecentVideos_videosConnection_pageInfo;
  totalCount: number;
}

export interface GetFollowedChannelsRecentVideos {
  videosConnection: GetFollowedChannelsRecentVideos_videosConnection;
}

export interface GetFollowedChannelsRecentVideosVariables {
  channelIdIn?: (string | null)[] | null;
  createdAtGte?: GQLDate | null;
  first?: number | null;
  after?: string | null;
}
