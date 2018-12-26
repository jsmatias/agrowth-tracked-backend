import { gql } from 'apollo-server-express';
import { DocumentNode } from 'graphql';

const HarvestTypeDef: DocumentNode = gql`
  type Harvest {
    active: Boolean
    comments: String
    createdAt: String
    distributor: [Distributor]
    emissionDate: String
    id: ID!
    location: Location
    produce: Produce
    quantity: Int
    supplier: Supplier
    updatedAt: String
    uuid: String
  }

  input HarvestUpdateInput {
    active: Boolean
    # distributorID: ID
    emissionDate: String
    quantity: Int
    comments: String
  }
`;

export default HarvestTypeDef;
