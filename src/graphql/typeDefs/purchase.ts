import { gql } from 'apollo-server-express';
import { DocumentNode } from 'graphql';

const purchaseTypeDef: DocumentNode = gql`
  type Purchase {
    id: ID!
    createdAt: String
    updatedAt: String
    quantity: Float
    produce: [Produce]
    price: String
    status: Boolean
    comments: String
  }

  input PurchaseUpdateInput {
    quantity: Float
    price: String
    status: String
    comments: String
    supplierID: ID
    produceID: ID
  }
`;

export default purchaseTypeDef;
