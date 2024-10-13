import { SearchIssuesQuery } from '@/graphql/__generated__/graphql'
import { Container } from './_primitives'

type SearchIssuesEdge = NonNullable<
  NonNullable<SearchIssuesQuery['search']['edges']>[number]
>['node']
export type IssueNode = Extract<SearchIssuesEdge, { __typename?: 'Issue' }>

export function IssueList({
  issueNodes,
  isLoading,
}: {
  issueNodes: IssueNode[]
  isLoading: boolean
}) {
  return (
    <div data-test-id="issueList:container">
      {(!issueNodes || !issueNodes.length) && !isLoading ? (
        <Container $bg="loading" data-test-id="issueList:container">
          No results
        </Container>
      ) : (
        issueNodes!.map((node) => {
          return (
            <a key={node.number} href={`issue/${node.number}`}>
              {node.title}
            </a>
          )
        })
      )}
    </div>
  )
}
