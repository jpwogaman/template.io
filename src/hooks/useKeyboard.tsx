import { useEffect, type Dispatch, type SetStateAction } from 'react'

type useKeyboardProps = {
  previousItemId: string
  nextItemId: string
  selectedItemRangeCount: number
  selectedItemArtCount: number
  selectedItemFadCount: number
  selectedItemId: string | null
  setSelectedItemId: Dispatch<SetStateAction<string | null>>
}

const useKeyboard = ({
  previousItemId,
  nextItemId,
  selectedItemRangeCount: rangeCount,
  selectedItemArtCount: artCount,
  selectedItemFadCount: fadCount,
  selectedItemId,
  setSelectedItemId
}: useKeyboardProps) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      const selectedInput = window.document.activeElement as HTMLInputElement

      const isButton = selectedInput?.tagName === 'BUTTON'
      const isSelect = selectedInput?.tagName === 'SELECT'

      const selectedInputIsInTrackOptions =
        selectedInput?.id.includes('_FR_') ||
        selectedInput?.id.includes('_AL_') ||
        selectedInput?.id.includes('_FL_')

      const optionType = selectedInput?.id.split('_')[2]
      const optionNumber = selectedInput?.id.split('_')[3]
      const optionField = selectedInput?.id.split('_')[4]

      if (e.key === 'ArrowUp') {
        e.preventDefault()

        if (selectedInputIsInTrackOptions) {
          const nextNumber = parseInt(optionNumber ?? '0') - 1
          let newInput =
            selectedItemId +
            '_' +
            optionType +
            '_' +
            nextNumber +
            '_' +
            optionField
          if (optionType === 'FR' && nextNumber < 0) {
            return
          }
          if (optionType === 'AL' && nextNumber < 0) {
            newInput =
              selectedItemId + '_FR_' + (rangeCount - 1) + '_' + optionField
          }
          if (optionType === 'FL' && nextNumber < 0) {
            newInput =
              selectedItemId + '_AL_' + (artCount - 1) + '_' + optionField
          }

          const nextInput = window.document.getElementById(newInput ?? '')

          nextInput?.focus()
          return
        }

        if (previousItemId === '') return

        const newInput = selectedInput?.id.replace(
          selectedItemId ?? '',
          previousItemId
        )
        const previousInput = window.document.getElementById(newInput ?? '')

        selectedInput?.blur()
        previousInput?.focus()
        setSelectedItemId(previousItemId)
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault()

        if (selectedInputIsInTrackOptions) {
          const nextNumber = parseInt(optionNumber ?? '0') + 1
          let newInput =
            selectedItemId +
            '_' +
            optionType +
            '_' +
            nextNumber +
            '_' +
            optionField
          if (optionType === 'FR' && nextNumber > rangeCount - 1) {
            newInput = selectedItemId + '_AL_0_' + optionField
          }
          if (optionType === 'AL' && nextNumber > artCount - 1) {
            newInput = selectedItemId + '_FL_0_' + optionField
          }
          if (optionType === 'FL' && nextNumber > fadCount) return

          const nextInput = window.document.getElementById(newInput ?? '')

          nextInput?.focus()
          return
        }

        if (nextItemId === '') return

        const newInput = selectedInput?.id.replace(
          selectedItemId ?? '',
          nextItemId
        )
        const nextInput = window.document.getElementById(newInput ?? '')

        nextInput?.focus()
        setSelectedItemId(nextItemId)
      }

      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        if (isSelect) e.preventDefault()
      }

      if (e.ctrlKey && e.key === 'ArrowRight') {
        if (selectedInputIsInTrackOptions) return
        e.preventDefault()
        const trackOptionsNameInput = window.document.getElementById(
          selectedItemId + '_FR_0_name'
        )
        trackOptionsNameInput?.focus()
      }
      if (e.ctrlKey && e.key === 'ArrowLeft') {
        if (!selectedInputIsInTrackOptions) return
        e.preventDefault()
        const trackListNameInput = window.document.getElementById(
          selectedItemId + '_name'
        )
        trackListNameInput?.focus()
      }
    }

    window.addEventListener('keydown', handleEsc)
    return () => {
      window.removeEventListener('keydown', handleEsc)
    }
  }, [setSelectedItemId, selectedItemId])

  return {}
}

export default useKeyboard