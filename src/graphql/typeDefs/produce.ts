import { gql } from 'apollo-server-express';
import { DocumentNode } from 'graphql';

const produceTypeDef: DocumentNode = gql`
  type Produce {
    active: Boolean
    id: ID!
    createdAt: String
    updatedAt: String
    name: String
    unit: String
    comments: String
  }
  input ProduceUpdateInput {
    active: Boolean
    name: String
    unit: String
    comments: String
  }
`;

export default produceTypeDef;
