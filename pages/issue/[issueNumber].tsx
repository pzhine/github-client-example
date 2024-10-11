import { GetServerSideProps } from 'next'
import Head from 'next/head'
import client from '@/lib/apolloClient'
import {
  GetIssueDetailDocument,
  GetIssueDetailQuery,
} from '@/graphql/__generated__/graphql'

export default function IssueDetailPage({
  initialData,
}: {
  initialData: GetIssueDetailQuery
}) {
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

  // // If the post is not found, return a 404
  // if (!post) {
  //   return {
  //     notFound: true,
  //   }
  // }
}
