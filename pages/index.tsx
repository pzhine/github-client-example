import { useCallback, useEffect, useRef, useState } from 'react'
import { useQuery } from '@apollo/client'
import {
  SearchIssuesDocument,
  SearchIssuesQuery,
} from '@/graphql/__generated__/graphql'
import client from '@/lib/apolloClient'
import { ApiError, processServerError } from '@/lib/errors'
import { GetServerSideProps } from 'next'
import { IssueList, IssueNode } from '@/components/IssueList'
import { Error } from '@/components/Error'
import { SearchBar } from '@/components/SearchBar'
import { useRouter } from 'next/router'
import {
  FilterDropdown,
  IssueStateFilter,
} from '@/components/FilterDropdown'
import { Row } from '@/components/_primitives'
import { ParsedUrlQuery } from 'querystring'
import { Paginator } from '@/components/Paginator'

const issuesPerPage = parseInt(process.env.NEXT_PUBLIC_ISSUES_PER_PAGE!)

interface QueryVariables {
  searchQuery: string
  first: number
  after?: string
}

// using parameters from the url query, build a variables object for the GQL query
function buildSearchVariables(
  query: ParsedUrlQuery,
  after: string | null
): QueryVariables {
  const queryString = typeof query?.q === 'string' ? query?.q : ''
  const stateFilter = query?.status as IssueStateFilter
  const searchQuery = `repo:facebook/react is:issue in:title in:body${
    stateFilter === 'closed' ? ' is:closed' : ''
  }${stateFilter === 'open' ? ' is:open' : ''} ${queryString}`
  // console.log('[buildSearchQuery]', searchQuery, after)

  const first =
    // only use first from query string for SSR,
    // where we won't ever have 'after' specified
    !after &&
    typeof query?.first === 'string' &&
    !query.first.match(/[^0-9]/)
      ? parseInt(query.first)
      : // default to issuesPerPage
        issuesPerPage

  return {
    searchQuery,
    first,
    ...(after ? { after } : {}),
  }
}

// transform GQL results to flat issues list
function issueNodesFromQueryData(
  queryData?: SearchIssuesQuery
): IssueNode[] {
  if (!queryData?.search.edges) {
    return []
  }
  return queryData.search.edges
    .map((edge) => {
      if (!edge?.node) {
        return null
      }
      return edge.node as IssueNode
    })
    .filter((item) => !!item)
}

function queryVariablesAreIdentical(
  vars1: QueryVariables,
  vars2: QueryVariables
) {
  return (
    vars1.searchQuery === vars2.searchQuery && vars1.after === vars2.after
  )
}

export default function IssueBrowser({
  initialData,
  apiError,
}: {
  initialData?: SearchIssuesQuery
  apiError?: ApiError
}) {
  const router = useRouter()
  const [issueNodes, setIssueNodes] = useState<IssueNode[]>(
    initialData ? issueNodesFromQueryData(initialData) : []
  )
  const startCursorRef = useRef<string | null>(null)
  const variablesFromRoute = buildSearchVariables(
    router.query,
    startCursorRef.current
  )
  const prevQueryVariablesRef = useRef<QueryVariables>(variablesFromRoute)
  const searchQueryRef = useRef<{
    data?: SearchIssuesQuery
    variables: QueryVariables
  }>({
    data: initialData,
    variables: variablesFromRoute,
  })

  if (apiError) {
    return <Error>{apiError.message}</Error>
  }

  // if query has changed, reset cursor
  if (
    prevQueryVariablesRef.current.searchQuery !==
    variablesFromRoute.searchQuery
  ) {
    variablesFromRoute.after = undefined
    startCursorRef.current = null
  }

  // console.log('[render] variables', variablesFromRoute)

  // client-side query
  const { loading, error, data } = useQuery<SearchIssuesQuery>(
    SearchIssuesDocument,
    {
      // skip when the query variables haven't changed from the SSR initialData
      skip: queryVariablesAreIdentical(
        variablesFromRoute,
        searchQueryRef.current.variables
      ),
      variables: variablesFromRoute,
    }
  )
  // if data is populated, put a snapshot of it and the query variables in the route
  // we'll use these next when deciding how to update the issue list in local state
  if (data) {
    searchQueryRef.current.data = data
    searchQueryRef.current.variables = variablesFromRoute
  }

  // update issue list in local state
  useEffect(() => {
    // flatten GQL response to a simple list
    const nextIssueNodes = issueNodesFromQueryData(
      searchQueryRef.current?.data
    )
    if (
      // query has changed
      prevQueryVariablesRef.current.searchQuery !==
      searchQueryRef.current.variables.searchQuery
    ) {
      // replace the issues
      // console.log('[update] replace')
      setIssueNodes(nextIssueNodes)
    } else if (
      // page cursor has changed
      searchQueryRef.current.variables.after! !==
      prevQueryVariablesRef.current.after!
    ) {
      // append the issues
      // console.log('[update] append')
      setIssueNodes((prev) => prev.concat(nextIssueNodes))
    }
    prevQueryVariablesRef.current = { ...searchQueryRef.current.variables }
  }, [searchQueryRef.current.data, router.query])

  // BEGIN event handlers

  const onSearchBarSubmit = useCallback(
    (value: string) => {
      console.log('[onSearchBarSubmit]', value)
      router.push(
        {
          query: { ...router.query, q: value, first: issuesPerPage },
        },
        undefined,
        { shallow: true }
      )
    },
    [router, setIssueNodes]
  )

  const onFilterChanged = useCallback(
    (value: IssueStateFilter) => {
      console.log('[onFilterChanged]', value)
      router.push(
        {
          query: { ...router.query, status: value, first: issuesPerPage },
        },
        undefined,
        { shallow: true }
      )
    },
    [router]
  )

  const onLoadMore = useCallback(() => {
    console.log('[onLoadMore]')
    // update start cursor ref so next query fetches more issues
    startCursorRef.current =
      searchQueryRef.current.data?.search.pageInfo.endCursor ?? null
    // update the route to trigger a re-render and persist the page for nav
    router.replace(
      {
        query: {
          ...router.query,
          first: issueNodes.length + issuesPerPage,
        },
      },
      undefined,
      { shallow: true }
    )
  }, [startCursorRef, router, issueNodes])

  // END hooks

  // BEGIN conditional response

  if (error) {
    const apiError = processServerError(error)
    return <Error>{apiError.message}</Error>
  }

  return (
    <>
      <Row>
        <SearchBar
          onSubmit={onSearchBarSubmit}
          initialValue={router.query?.q as string}
          key={
            typeof router.query?.q === 'string'
              ? router.query.q
              : undefined
          }
        />
        <FilterDropdown
          selected={router.query?.status as IssueStateFilter}
          onChange={onFilterChanged}
        />
      </Row>
      <IssueList issueNodes={issueNodes} isLoading={loading} />
      <Paginator
        isLoading={loading}
        onLoadMore={onLoadMore}
        showingCount={issueNodes.length}
        totalCount={searchQueryRef.current.data?.search.issueCount ?? 0}
      />
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  console.log('[getServerSideProps] context.query', context.query)
  try {
    const { data } = await client.query<SearchIssuesQuery>({
      query: SearchIssuesDocument,
      variables: buildSearchVariables(context.query, null),
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
