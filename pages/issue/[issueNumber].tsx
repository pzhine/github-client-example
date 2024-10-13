import { GetServerSideProps } from 'next'
import Head from 'next/head'
import client from '@/lib/apolloClient'
import {
  GetIssueDetailDocument,
  GetIssueDetailQuery,
} from '@/graphql/__generated__/graphql'
import { ApiError, processServerError } from '@/lib/errors'
import { IssueHead } from '@/components/IssueHead'
import { Error } from '@/components/Error'
import { IssueComment } from '@/components/IssueComment'

export type IssueDetail = NonNullable<
  NonNullable<GetIssueDetailQuery['repository']>['issue']
>

export type IssueContent =
  | IssueDetail
  | NonNullable<NonNullable<IssueDetail['comments']['nodes']>[number]>

export default function IssueDetailPage({
  initialData,
  apiError,
}: {
  initialData: IssueDetail
  apiError?: ApiError
}) {
  if (apiError) {
    return <Error>{apiError.message}</Error>
  }
  return (
    <>
      <Head>
        <title>Issue</title>
      </Head>
      <IssueHead issueDetail={initialData} />
      <IssueComment issueContent={initialData} />
      {!!initialData.comments.nodes?.length &&
        initialData.comments.nodes.map(
          (comment) =>
            !!comment && (
              <IssueComment
                key={comment.createdAt
                  .toString()
                  .concat(comment.author?.login ?? '')}
                issueContent={comment}
              />
            )
        )}
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { issueNumber } = context.params!

  // validate params
  if (typeof issueNumber !== 'string' || issueNumber.match(/[^0-9]/)) {
    return {
      notFound: true,
    }
  }

  try {
    const { data } = await client.query<GetIssueDetailQuery>({
      query: GetIssueDetailDocument,
      variables: {
        issueNumber: parseInt(issueNumber as string, 10),
      },
    })

    if (!data?.repository?.issue) {
      return {
        notFound: true,
      }
    }

    return {
      props: {
        initialData: data.repository.issue,
      },
    }
  } catch (error) {
    const apiError = processServerError(error)
    if (apiError.code === 404) {
      return {
        notFound: true,
      }
    }
    return {
      props: {
        apiError,
      },
    }
  }
}
