import { gql } from 'apollo-server-express';
import { DocumentNode } from 'graphql';

const workspaceTypeDef: DocumentNode = gql`
  type WorkspaceMetaCounts {
    users: Int
    produce: Int
    suppliers: Int
  }
  type WorkspaceMetaInfo {
    counts: WorkspaceMetaCounts
  }
`;

export default workspaceTypeDef;
