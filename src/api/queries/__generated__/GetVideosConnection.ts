/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { VideoOrderByInput } from "./../../../../__generated__/globalTypes";

// ====================================================
// GraphQL query operation: GetVideosConnection
// ====================================================

export interface GetVideosConnection_videosConnection_edges_node_category {
  __typename: "Category";
  id: string;
}

export interface GetVideosConnection_videosConnection_edges_node_media_location_HttpMediaLocation {
  __typename: "HttpMediaLocation";
  url: string;
}

export interface GetVideosConnection_videosConnection_edges_node_media_location_JoystreamMediaLocation {
  __typename: "JoystreamMediaLocation";
  dataObjectId: string;
}

export type GetVideosConnection_videosConnection_edges_node_media_location = GetVideosConnection_videosConnection_edges_node_media_location_HttpMediaLocation | GetVideosConnection_videosConnection_edges_node_media_location_JoystreamMediaLocation;

export interface GetVideosConnection_videosConnection_edges_node_media {
  __typename: "VideoMedia";
  id: string;
  pixelHeight: number;
  pixelWidth: number;
  location: GetVideosConnection_videosConnection_edges_node_media_location;
}

export interface GetVideosConnection_videosConnection_edges_node_channel {
  __typename: "Channel";
  id: string;
  avatarPhotoUrl: string | null;
  handle: string;
}

export interface GetVideosConnection_videosConnection_edges_node_license_type_KnownLicense {
  __typename: "KnownLicense";
  code: string;
  url: string | null;
}

export interface GetVideosConnection_videosConnection_edges_node_license_type_UserDefinedLicense {
  __typename: "UserDefinedLicense";
  content: string;
}

export type GetVideosConnection_videosConnection_edges_node_license_type = GetVideosConnection_videosConnection_edges_node_license_type_KnownLicense | GetVideosConnection_videosConnection_edges_node_license_type_UserDefinedLicense;

export interface GetVideosConnection_videosConnection_edges_node_license {
  __typename: "LicenseEntity";
  id: string;
  attribution: string | null;
  type: GetVideosConnection_videosConnection_edges_node_license_type;
}

export interface GetVideosConnection_videosConnection_edges_node {
  __typename: "Video";
  id: string;
  title: string;
  description: string;
  category: GetVideosConnection_videosConnection_edges_node_category;
  views: number | null;
  duration: number;
  thumbnailUrl: string;
  createdAt: GQLDate;
  media: GetVideosConnection_videosConnection_edges_node_media;
  channel: GetVideosConnection_videosConnection_edges_node_channel;
  license: GetVideosConnection_videosConnection_edges_node_license;
}

export interface GetVideosConnection_videosConnection_edges {
  __typename: "VideoEdge";
  cursor: string;
  node: GetVideosConnection_videosConnection_edges_node;
}

export interface GetVideosConnection_videosConnection_pageInfo {
  __typename: "PageInfo";
  hasNextPage: boolean;
  endCursor: string | null;
}

export interface GetVideosConnection_videosConnection {
  __typename: "VideoConnection";
  edges: GetVideosConnection_videosConnection_edges[];
  pageInfo: GetVideosConnection_videosConnection_pageInfo;
  totalCount: number;
}

export interface GetVideosConnection {
  videosConnection: GetVideosConnection_videosConnection;
}

export interface GetVideosConnectionVariables {
  first?: number | null;
  after?: string | null;
  categoryId?: string | null;
  channelId?: string | null;
  channelIdIn?: (string | null)[] | null;
  createdAtGte?: GQLDate | null;
  orderBy?: VideoOrderByInput | null;
}
