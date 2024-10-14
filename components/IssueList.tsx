import {
  IssueState,
  SearchIssuesQuery,
} from '@/graphql/__generated__/graphql'
import { Container, Row } from './_primitives'
import styled from 'styled-components'
import { StatusTile } from './StatusTile'
import { formatGitHubDate } from '@/lib/dateTime'

type SearchIssuesEdge = NonNullable<
  NonNullable<SearchIssuesQuery['search']['edges']>[number]
>['node']
export type IssueNode = Extract<SearchIssuesEdge, { __typename?: 'Issue' }>

export const IssueRow = styled(
  ({
    className,
    issueNode,
  }: {
    className?: string
    issueNode: IssueNode
  }) => (
    <div className={className}>
      <a href={`issue/${issueNode.number}`}>
        <StatusTile issueStatus={issueNode.state} compact />
        <div>
          <span className="issue-title">{issueNode.title}</span>
          <span className="issue-meta">
            {issueNode.author?.login}
            {issueNode.state === IssueState.Closed
              ? ` closed ${formatGitHubDate(issueNode.closedAt)}`
              : ` opened ${formatGitHubDate(issueNode.createdAt)}`}
          </span>
        </div>
      </a>
    </div>
  )
)`
  & {
    border-bottom: 1px solid ${(props) => props.theme.colors.text2};
  }
  & a {
    padding: 8px;
    display: flex;
    align-items: flex-start;

    &:hover {
      background: ${(props) => props.theme.colors.background2};
    }

    & > div {
      margin-right: 8px;

      & .issue-meta {
        color: ${(props) => props.theme.colors.text2};
        margin-top: 4px;
      }
    }
  }
`

export const IssueList = styled(
  ({
    issueNodes,
    isLoading,
    className,
  }: {
    issueNodes: IssueNode[]
    isLoading: boolean
    className?: string
  }) => (
    <div data-test-id="issueList:container" className={className}>
      {(!issueNodes || !issueNodes.length) && !isLoading ? (
        <Container $bg="loading" data-test-id="issueList:container">
          No results
        </Container>
      ) : (
        issueNodes!.map((node) => (
          <IssueRow issueNode={node} key={node.number} />
        ))
      )}
    </div>
  )
)`
  & {
    border: 1px solid ${(props) => props.theme.colors.text2};
    border-bottom-width: 0;
    margin: 12px 0;
  }
`
