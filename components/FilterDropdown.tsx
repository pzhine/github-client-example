import { ChangeEventHandler } from 'react'
import { DropdownMenu } from './_primitives'
import styled from 'styled-components'

export type IssueStateFilter = 'open' | 'closed' | 'any'

export const FilterDropdown = styled(
  ({
    selected,
    onChange,
    className,
  }: {
    selected: IssueStateFilter
    onChange: (value: IssueStateFilter) => void
    className?: string
  }) => {
    const onDropdownMenuChange: ChangeEventHandler<HTMLSelectElement> = (
      evt
    ) => {
      onChange(evt.target.value as IssueStateFilter)
    }

    return (
      <div className={className}>
        <DropdownMenu
          value={selected ?? 'any'}
          onChange={onDropdownMenuChange}
          $width="150px"
          data-test-id="filter:select"
        >
          <option value="any">All issues</option>
          <option value="open">Open issues</option>
          <option value="closed">Closed issues</option>
        </DropdownMenu>
      </div>
    )
  }
)`
  border: 1px solid ${(props) => props.theme.colors.text2};
  border-radius: 5px;
  height: 2.2rem;
  justify-content: center;

  & select {
    border: none;
  }
`
