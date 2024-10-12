import {
  GetIssuesQuery,
  SearchIssuesQuery,
} from '@/graphql/__generated__/graphql'
import Link from 'next/link'

export function IssueList({
  issueEdges,
}: {
  issueEdges: SearchIssuesQuery['search']['edges']
}) {
  if (!issueEdges || !issueEdges.length) {
    return <p>No data available</p>
  }

  return (
    <div>
      {issueEdges!.map((item) => {
        const node = item?.node!
        if (node.__typename !== 'Issue') {
          return null
        }
        return (
          <Link key={node.number} href={`issue/${node.number}`}>
            {node.title}
          </Link>
        )
      })}
    </div>
  )
}
