import { gql } from 'apollo-server-express';
import { DocumentNode } from 'graphql';

const HarvestTypeDef: DocumentNode = gql`
  type Harvest {
    active: Boolean
    comments: String
    category: String
    classification: String
    createdAt: String
    distributor: Distributor
    emissionDate: String
    expirationRange: String
    id: ID!
    location: Location
    produce: Produce
    quantity: Int
    supplier: Supplier
    updatedAt: String
    uuid: String
    weightOrCount: Float
    weightOrCountUnit: String
  }

  input HarvestUpdateInput {
    active: Boolean
    category: String
    classification: String
    # distributorID: ID
    emissionDate: String
    expirationRange: String
    quantity: Int
    comments: String
    weightOrCount: Float
    weightOrCountUnit: String
  }
`;

export default HarvestTypeDef;
