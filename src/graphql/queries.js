/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const syncChatties = /* GraphQL */ `
  query SyncChatties(
    $filter: ModelChattyFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncChatties(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        user
        message
        createdAt
        _version
        _deleted
        _lastChangedAt
        updatedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const getChatty = /* GraphQL */ `
  query GetChatty($id: ID!) {
    getChatty(id: $id) {
      id
      user
      message
      createdAt
      _version
      _deleted
      _lastChangedAt
      updatedAt
    }
  }
`;
export const listChattys = /* GraphQL */ `
  query ListChattys(
    $filter: ModelChattyFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listChattys(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        user
        message
        createdAt
        _version
        _deleted
        _lastChangedAt
        updatedAt
      }
      nextToken
      startedAt
    }
  }
`;
