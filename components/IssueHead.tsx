import { IssueDetail } from '@/pages/issue/[issueNumber]'
import styled from 'styled-components'
import { StatusTile } from './StatusTile'

export const IssueHead = styled(
  ({
    issueDetail,
    className,
  }: {
    issueDetail: IssueDetail
    className?: string
  }) => {
    return (
      <div className={className} data-test-id="issue:head">
        <h2>
          {issueDetail.title} <span> #{issueDetail.number}</span>
        </h2>
        <StatusTile issueStatus={issueDetail.state} />
      </div>
    )
  }
)`
  & {
    align-items: flex-start;
    margin-bottom: 24px;
  }
  & h2 span {
    color: ${(props) => props.theme.colors.text2};
  }
`
