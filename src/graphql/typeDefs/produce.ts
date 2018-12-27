import { gql } from 'apollo-server-express';
import { DocumentNode } from 'graphql';

const produceTypeDef: DocumentNode = gql`
  type Produce {
    active: Boolean
    id: ID!
    category: String
    classification: String
    createdAt: String
    updatedAt: String
    name: String
    unit: String
    variety: String
    comments: String
    weightUnit: String
  }
  input ProduceUpdateInput {
    active: Boolean
    name: String
    unit: String
    comments: String
    category: String
    classification: String
    variety: String
    weightUnit: String
  }
`;

export default produceTypeDef;