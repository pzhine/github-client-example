import { micromark } from 'micromark'
import sanitizeHtml from 'sanitize-html'
import { gfmHtml, gfm } from 'micromark-extension-gfm'
import { IssueContent } from '@/pages/issue/[issueNumber]'
import styled from 'styled-components'

export const IssueComment = styled(
  ({
    issueContent,
    className,
  }: {
    issueContent: IssueContent
    className?: string
  }) => {
    const mdhtml = sanitizeHtml(
      micromark(issueContent.body, {
        extensions: [gfm()],
        htmlExtensions: [gfmHtml()],
      })
    )
    return (
      <div className={className}>
        <div className="head">
          {issueContent.author?.login}{' '}
          <span>
            {' '}
            commented on{' '}
            {issueContent.createdAt.replace('T', ' ').replace('Z', '')}
          </span>
        </div>
        <div
          className="body"
          dangerouslySetInnerHTML={{ __html: mdhtml }}
        />
      </div>
    )
  }
)`
  & {
    border: 1px solid ${(props) => props.theme.colors.text2};
    margin-bottom: 24px;
  }
  & .head {
    font-weight: bold;
    flex-direction: row;
    padding: 12px;
    font-size: medium;
    & span {
      margin-left: 0.5em;
      font-weight: normal;
      color: ${(props) => props.theme.colors.text2};
    }
    border-bottom: 1px solid ${(props) => props.theme.colors.text2};
  }
  & .body {
    padding: 0 12px;
  }
  & pre {
    overflow-x: scroll;
    padding: 12px 8px;
    background: ${(props) => props.theme.colors.background2};
  }
`
