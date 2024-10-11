import { useState } from 'react'
import Link from 'next/link'
import { ApolloError, useQuery } from '@apollo/client'
import {
  GetIssuesDocument,
  GetIssuesQuery,
} from '@/graphql/__generated__/graphql'
import type { ServerError } from '@apollo/client/link/utils/index.js'
import client from '@/lib/apolloClient'

function Results({ initialData }: { initialData: GetIssuesQuery }) {
  const [data, setData] = useState(initialData)

  // Use Apollo useQuery to fetch data on client-side
  const { loading, error, refetch } = useQuery<GetIssuesQuery>(
    GetIssuesDocument,
    {
      skip: true, // Skip automatic execution on page load
    }
  )

  const handleRefresh = async () => {
    const result = await refetch()
    setData(result.data)
  }

  if (!data) return <p>No data available</p>

  return (
    <div>
      <h1>Items List</h1>
      <button onClick={handleRefresh}>Refresh Data</button>

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}

      <div>
        {data.repository!.issues.edges!.map((item) => (
          <Link key={item?.node?.url} href={`issue/${item!.node!.number}`}>
            {item?.node?.title}
          </Link>
        ))}
      </div>
    </div>
  )
}

export default function Home({
  initialData,
  errorCode,
  errorMessage,
}: {
  initialData?: GetIssuesQuery
  errorCode?: number
  errorMessage?: string
}) {
  if (errorCode) {
    return (
      <div>
        <h1>Error {errorCode}</h1>
        <p>{errorMessage}</p>
      </div>
    )
  }

  return <Results initialData={initialData!} />
}

// Fetch data on the server-side
export async function getServerSideProps() {
  try {
    const { data } = await client.query<GetIssuesQuery>({
      query: GetIssuesDocument,
    })

    return {
      props: {
        initialData: data,
      },
    }
  } catch (error) {
    console.error(JSON.stringify(error, null))
    if (error instanceof ApolloError && error.networkError) {
      const serverError = error.networkError as ServerError
      switch (serverError.statusCode) {
        case 403:
          return {
            props: {
              errorCode: 403,
              errorMessage: 'Rate limit exceeded. Please try again later.',
            },
          }
        default: {
          return {
            props: {
              errorCode: serverError?.statusCode ?? 500,
              errorMessage: 'An unexpected network error occurred.',
            },
          }
        }
      }
    }
    return {
      props: {
        errorCode: 500,
        errorMessage: 'An unexpected GraphQL error occurred.',
      },
    }
  }
}
