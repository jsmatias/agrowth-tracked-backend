import { gql } from 'apollo-server-express';
import { DocumentNode } from 'graphql';

const distributorTypeDef: DocumentNode = gql`
  type Distributor {
    active: Boolean
    id: ID!
    createdAt: String
    updatedAt: String
    email: String
    name: String
    surname: String
    nickname: String
    idNumber: String
    phoneNumber: String
    comments: String
  }

  input DistributorUpdateInput {
    active: Boolean
    email: String
    name: String
    surname: String
    nickname: String
    idNumber: String
    phoneNumber: String
    comments: String
  }
`;

export default distributorTypeDef;
