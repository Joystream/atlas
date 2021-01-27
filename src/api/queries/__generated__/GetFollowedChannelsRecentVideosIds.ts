/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetFollowedChannelsRecentVideosIds
// ====================================================

export interface GetFollowedChannelsRecentVideosIds_videosConnection_edges_node {
  __typename: "Video";
  id: string;
}

export interface GetFollowedChannelsRecentVideosIds_videosConnection_edges {
  __typename: "VideoEdge";
  node: GetFollowedChannelsRecentVideosIds_videosConnection_edges_node;
}

export interface GetFollowedChannelsRecentVideosIds_videosConnection {
  __typename: "VideoConnection";
  edges: GetFollowedChannelsRecentVideosIds_videosConnection_edges[];
}

export interface GetFollowedChannelsRecentVideosIds {
  videosConnection: GetFollowedChannelsRecentVideosIds_videosConnection;
}

export interface GetFollowedChannelsRecentVideosIdsVariables {
  channelIdIn?: (string | null)[] | null;
  createdAtGte?: GQLDate | null;
}
