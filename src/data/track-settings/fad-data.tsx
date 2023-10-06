import { type Dispatch, type FC, Fragment, type SetStateAction } from 'react'
import { TrackListProps } from '@/data/track-list/track-context'
import { FadSettingsRow } from './fad-settings-row'

interface FaderDataProps {
  selectedTrack: TrackListProps
  setFaders: Dispatch<SetStateAction<TrackListProps['fadList']>>
}

export const FaderData: FC<FaderDataProps> = ({ selectedTrack, setFaders }) => {
  const FaderList = selectedTrack?.fadList

  const removeFader = (fadId: string) => {
    if (fadId === FaderList[FaderList.length - 1]?.id) {
      console.log('it does')
    }

    if (FaderList.length !== 1) {
      setFaders(FaderList.filter((fader) => fader.id !== fadId))
    }
  }

  return (
    <Fragment>
      {FaderList.map((fader) => (
        <FadSettingsRow
          key={fader.id}
          id={fader.id}
          onDelete={() => removeFader(fader.id)}
        />
      ))}
    </Fragment>
  )
}
