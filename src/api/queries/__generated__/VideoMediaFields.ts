/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: VideoMediaFields
// ====================================================

export interface VideoMediaFields_location_HttpMediaLocation {
  __typename: "HttpMediaLocation";
  url: string;
}

export interface VideoMediaFields_location_JoystreamMediaLocation {
  __typename: "JoystreamMediaLocation";
  dataObjectId: string;
}

export type VideoMediaFields_location = VideoMediaFields_location_HttpMediaLocation | VideoMediaFields_location_JoystreamMediaLocation;

export interface VideoMediaFields {
  __typename: "VideoMedia";
  id: string;
  pixelHeight: number | null;
  pixelWidth: number;
  location: VideoMediaFields_location;
}
