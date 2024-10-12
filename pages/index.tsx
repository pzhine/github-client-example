import { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import {
  SearchIssuesDocument,
  SearchIssuesQuery,
} from '@/graphql/__generated__/graphql'
import client from '@/lib/apolloClient'
import { ApiError, processServerError } from '@/lib/errors'
import { GetServerSideProps } from 'next'
import { IssueList } from '@/components/IssueList'
import { Error } from '@/components/Error'
import { SearchBar } from '@/components/SearchBar'
import { useRouter } from 'next/router'
import { Loading } from '@/components/Loading'

type IssueStateFilters = 'open' | 'closed' | 'any'

function buildSearchQuery(
  query: string,
  stateFilter: IssueStateFilters = 'any'
) {
  return `repo:facebook/react in:title in:body ${query}`
}

export default function Home({
  initialData,
  apiError,
}: {
  initialData?: SearchIssuesQuery
  apiError?: ApiError
}) {
  const router = useRouter()
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const queryFromRouter =
    typeof router.query?.q === 'string' && router.query?.q

  if (apiError) {
    return <Error>{apiError.message}</Error>
  }

  const { loading, error, data } = useQuery<SearchIssuesQuery>(
    SearchIssuesDocument,
    {
      skip: isInitialLoad,
      variables: {
        searchQuery: buildSearchQuery(queryFromRouter || ''),
      },
    }
  )

  if (error) {
    const apiError = processServerError(error)
    return <Error>{apiError.message}</Error>
  }

  // const handleRefresh = async () => {
  //   const result = await refetch()
  //   setData(result.data)
  // }

  const onSearchBarSubmit = (value: string) => {
    console.log('[onSearchBarSubmit]', value)
    router.push(
      {
        query: { q: value },
      },
      undefined,
      { shallow: true }
    )
    setIsInitialLoad(false)
  }

  return (
    <>
      <SearchBar
        onSubmit={onSearchBarSubmit}
        initialValue={router.query?.q as string}
        {...(queryFromRouter
          ? {
              key: queryFromRouter,
            }
          : {})}
      />
      {loading ? (
        <Loading />
      ) : (
        <IssueList
          issueEdges={
            isInitialLoad ? initialData!.search.edges : data?.search.edges
          }
        />
      )}
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  console.log('[getServerSideProps] context.query', context.query)
  try {
    const { data } = await client.query<SearchIssuesQuery>({
      query: SearchIssuesDocument,
      variables: {
        searchQuery: buildSearchQuery(context.query.q as string),
      },
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
