import styled from 'styled-components'
import { Button, Row } from './_primitives'

const StyledRow = styled(Row)`
  justify-content: space-between;
`

export function Paginator({
  showingCount,
  totalCount,
  onLoadMore,
  isLoading,
}: {
  showingCount: number
  totalCount: number
  onLoadMore: () => void
  isLoading: boolean
}) {
  return (
    <StyledRow>
      <div>
        {totalCount > showingCount && (
          <Button
            onClick={onLoadMore}
            disabled={isLoading}
            data-test-id="paginator:next-page"
          >
            {isLoading ? 'Loading...' : 'Show more results'}
          </Button>
        )}
      </div>
      <div data-test-id="paginator:result-count">
        Showing {showingCount} of {totalCount}
      </div>
    </StyledRow>
  )
}
