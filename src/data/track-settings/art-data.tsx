import { Dispatch, FC, Fragment, SetStateAction } from 'react'
import { ArtSettingsRow } from './art-settings-row'
import { useSelectedArtList } from '@/data/track-list/track-context'

interface ArtDataProps {
  setAvgDelAvail: Dispatch<SetStateAction<boolean>>
  baseDelay: number
}

export const ArtToggleData: FC<ArtDataProps> = ({
  baseDelay,
  setAvgDelAvail
}) => {
  const ArtList = useSelectedArtList()

  return (
    <Fragment>
      {ArtList?.map((art) =>
        art.toggle ? (
          <ArtSettingsRow
            setAvgDelAvail={setAvgDelAvail}
            key={art.id}
            id={art.id}
            toggle
            baseDelay={baseDelay}
          />
        ) : null
      )}
    </Fragment>
  )
}

export const ArtSwitchData: FC<ArtDataProps> = ({
  baseDelay,
  setAvgDelAvail
}) => {
  const ArtList = useSelectedArtList()

  return (
    <Fragment>
      {ArtList?.map((art) =>
        !art.toggle ? (
          <ArtSettingsRow
            setAvgDelAvail={setAvgDelAvail}
            key={art.id}
            id={art.id}
            baseDelay={baseDelay}
          />
        ) : null
      )}
    </Fragment>
  )
}
