import { IssueDetail } from '@/pages/issue/[issueNumber]'
import styled from 'styled-components'

export const IssueHead = styled(
  ({
    issueDetail,
    className,
  }: {
    issueDetail: IssueDetail
    className?: string
  }) => {
    return (
      <div className={className}>
        <h2>
          {issueDetail.title} <span> #{issueDetail.number}</span>
        </h2>
      </div>
    )
  }
)`
  & h2 span {
    color: ${(props) => props.theme.colors.text2};
  }
`
