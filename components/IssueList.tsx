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
  if ((!issueNodes || !issueNodes.length) && !isLoading) {
    return <Container $bg="loading"> No results</Container>
  }

  return (
    <div>
      {issueNodes!.map((node) => {
        return (
          <a key={node.number} href={`issue/${node.number}`}>
            {node.title}
          </a>
        )
      })}
    </div>
  )
}
