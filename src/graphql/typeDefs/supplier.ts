import { gql } from 'apollo-server-express';
import { DocumentNode } from 'graphql';

const supplierTypeDef: DocumentNode = gql`
  type Supplier {
    active: Boolean
    id: ID!
    createdAt: String
    updatedAt: String
    email: String
    locations: [Location]
    name: String
    surname: String
    nickname: String
    idNumber: String
    phoneNumber: String
    comments: String
  }

  input SupplierUpdateInput {
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

export default supplierTypeDef;
