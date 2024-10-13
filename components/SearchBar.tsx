import { KeyboardEventHandler, useCallback } from 'react'
import styled from 'styled-components'

const StyledInput = styled.input`
  display: flex;
  height: ${(props) => props.theme.sizes.controlHeight};
  flex-grow: 1;
  margin-right: 8px;
  border: 1px solid ${(props) => props.theme.colors.text2};
  background: transparent;
  padding: 5px 6px;
  color: ${(props) => props.theme.colors.text};
  font-size: ${(props) => props.theme.typeography.medium};
  border-radius: 5px;
`

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
    <StyledInput
      data-test-id="searchBar:input"
      type="text"
      placeholder="Search for text in title or body..."
      onKeyDown={onKeyDown}
      defaultValue={initialValue}
    />
  )
}
