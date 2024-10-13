import { ChangeEventHandler } from 'react'
import { DropdownMenu } from './_primitives'

export type IssueStateFilter = 'open' | 'closed' | 'any'

export function FilterDropdown({
  selected,
  onChange,
}: {
  selected: IssueStateFilter
  onChange: (value: IssueStateFilter) => void
}) {
  const onDropdownMenuChange: ChangeEventHandler<HTMLSelectElement> = (
    evt
  ) => {
    onChange(evt.target.value as IssueStateFilter)
  }

  return (
    <DropdownMenu
      value={selected ?? 'any'}
      onChange={onDropdownMenuChange}
    >
      <option value="any">All issues</option>
      <option value="open">Open issues</option>
      <option value="closed">Closed issues</option>
    </DropdownMenu>
  )
}
