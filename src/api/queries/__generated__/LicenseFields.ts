/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: LicenseFields
// ====================================================

export interface LicenseFields_type_KnownLicense {
  __typename: "KnownLicense";
  code: string;
  url: string | null;
}

export interface LicenseFields_type_UserDefinedLicense {
  __typename: "UserDefinedLicense";
  content: string;
}

export type LicenseFields_type = LicenseFields_type_KnownLicense | LicenseFields_type_UserDefinedLicense;

export interface LicenseFields {
  __typename: "LicenseEntity";
  id: string;
  type: LicenseFields_type;
}
