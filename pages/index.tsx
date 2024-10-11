import { useState } from 'react'
import Link from 'next/link'
import { useQuery } from '@apollo/client'
import {
  GetIssuesDocument,
  GetIssuesQuery,
} from '@/graphql/__generated__/graphql'
import client from '@/lib/apolloClient'
import { ApiError, processServerError } from '@/lib/errors'

function Results({ initialData }: { initialData: GetIssuesQuery }) {
  const [data, setData] = useState(initialData)

  const { loading, error, refetch } = useQuery<GetIssuesQuery>(
    GetIssuesDocument,
    {
      skip: true,
    }
  )

  let apiError: ApiError | null = null
  if (error) {
    apiError = processServerError(error)
  }

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
      {!!apiError && <p>Error: {apiError.message}</p>}

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
  apiError,
}: {
  initialData?: GetIssuesQuery
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
    return {
      props: {
        apiError: processServerError(error),
      },
    }
  }
}
