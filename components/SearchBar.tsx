import { KeyboardEventHandler, useCallback, useState } from 'react'

export function SearchBar({
  onSubmit,
  initialValue,
}: {
  onSubmit: (value: string) => void
  initialValue?: string
}) {
  const onKeyDown: KeyboardEventHandler<HTMLInputElement> = useCallback(
    (evt) => {
      if (evt.key === 'Enter') {
        evt.preventDefault()
        onSubmit(evt.currentTarget.value)
      }
    },
    [onSubmit]
  )

  return (
    <input
      data-test-id="searchBar:input"
      type="text"
      placeholder="Search for text in title or body..."
      onKeyDown={onKeyDown}
      defaultValue={initialValue}
    />
  )
}
