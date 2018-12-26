import { gql } from 'apollo-server-express';
import { DocumentNode } from 'graphql';

const locationTypeDef: DocumentNode = gql`
  type Location {
    id: ID!
    createdAt: String
    updatedAt: String
    name: String
    address: String
    notes: String
    coordinates: [Float!]!
  }

  input LocationUpdateInput {
    name: String!
    address: String
    notes: String
    coordinates: [Float!]!
  }
`;

export default locationTypeDef;
