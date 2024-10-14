import { IssueState } from '@/graphql/__generated__/graphql'
import styled from 'styled-components'

export const StatusTile = styled(
  ({
    className,
    issueStatus,
    compact = false,
  }: {
    className?: string
    issueStatus: IssueState
    compact?: boolean
  }) => (
    <div className={className} data-issue-status={issueStatus}>
      {compact ? issueStatus.charAt(0) : issueStatus}
    </div>
  )
)`
  background: ${(props) =>
    props.issueStatus === IssueState.Open
      ? props.theme.colors.openStatus
      : props.theme.colors.closedStatus};
  padding: ${(props) => (props.compact ? '3px 6px;' : '10px 14px')};
  font-size: ${(props) => props.theme.typeography.small};
  color: ${(props) => props.theme.colors.controlText};
  text-align: center;
  width: ${(props) => (props.compact ? '2em' : 'auto')};
  border-radius: ${(props) => (props.compact ? '10px' : '20px')};
`
