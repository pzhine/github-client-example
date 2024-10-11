import { GetServerSideProps } from 'next'
import Head from 'next/head'
import client from '@/lib/apolloClient'
import {
  GetIssueDetailDocument,
  GetIssueDetailQuery,
} from '@/graphql/__generated__/graphql'
import { ApiError, processServerError } from '@/lib/errors'

export default function IssueDetailPage({
  initialData,
  apiError,
}: {
  initialData?: GetIssueDetailQuery
  apiError?: ApiError
}) {
  if (apiError) {
    return (
      <div>
        <h1>Error {apiError.code}</h1>
        <p>{apiError.message}</p>
      </div>
    )
  }
  return (
    <>
      <Head>
        <title>Issue</title>
      </Head>
      <h2>{initialData!.repository!.issue!.title}</h2>
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

    return {
      props: {
        initialData: data,
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
