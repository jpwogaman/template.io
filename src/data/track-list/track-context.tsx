import { createContext, ReactNode, useContext, type FC, useState } from 'react'

//check - import JSON from FILE LOCATION - check

const trackWorkFile = null
export interface TrackListProps {
  id: string
  locked: boolean
  name: string | undefined
  channel: number | undefined
  fullRange: {
    id: string
    name: string | undefined
    low: string | number | undefined
    high: string | number | undefined
    whiteKeysOnly: boolean | undefined
  }[]
  baseDelay: number | undefined
  avgDelay: number | undefined | null
  artList: {
    id: string
    name: string | undefined
    toggle: boolean
    codeType: string | undefined
    code: string | number | undefined
    on: number | undefined | null
    off: number | undefined | null
    range: {
      id: string | undefined | null
      name: string | undefined | null
      low: string | number | undefined | null
      high: string | number | undefined | null
      whiteKeysOnly: boolean | undefined | null
    }[]
    default: string | boolean
    delay: number
    changeType: boolean | undefined
  }[]
  fadList: {
    id: string
    name: string | undefined
    codeType: string | undefined
    code: string | number | undefined
    default: number | undefined
    changeType: boolean | undefined
  }[]
}

const defaultTrackData: TrackListProps[] = [
  {
    id: '01',
    locked: false,
    name: undefined,
    channel: 1,
    fullRange: [
      {
        id: '01',
        name: undefined,
        low: undefined,
        high: undefined,
        whiteKeysOnly: false
      }
    ],
    baseDelay: 0,
    avgDelay: undefined,
    artList: [
      {
        id: '01',
        name: undefined,
        toggle: true,
        codeType: undefined,
        code: undefined,
        on: undefined,
        off: undefined,
        range: [
          {
            id: null,
            name: null,
            low: null,
            high: null,
            whiteKeysOnly: null
          }
        ],
        default: 'on', //setting choice later
        delay: 0,
        changeType: undefined
      },
      {
        id: '02',
        name: undefined,
        toggle: false,
        codeType: undefined,
        code: undefined,
        on: undefined,
        off: undefined,
        range: [
          {
            id: '01',
            name: undefined,
            low: undefined,
            high: undefined,
            whiteKeysOnly: false
          }
        ],
        default: true,
        delay: 0,
        changeType: undefined
      }
    ],
    fadList: [
      {
        id: '01',
        name: undefined,
        codeType: undefined,
        code: undefined,
        default: undefined,
        changeType: undefined
      }
    ]
  }
]

const getDefaultTrackList = (argument: string | number) => {
  return defaultTrackData
}

const getDefaultSelectedTrack = () => {
  return defaultTrackData[0]
}

const getDefaultSelectedArtListAdd = (argument: boolean) => {
  return defaultTrackData[0]?.artList
}
const getDefaultSelectedArtListRemove = (argument: string) => {
  return defaultTrackData[0]?.artList
}

export const TrackList = createContext(defaultTrackData)
export const TrackListAdd = createContext(
  getDefaultTrackList as (argument: string | number) => TrackListProps[]
)
export const TrackListRemove = createContext(
  getDefaultTrackList as (argument: string | number) => TrackListProps[]
)
export const TrackListCount = createContext(defaultTrackData.length as number)
export const SelectedArtList = createContext(
  defaultTrackData[0]?.artList as TrackListProps['artList']
)
export const SelectedArtListAdd = createContext(
  getDefaultSelectedArtListAdd as (
    argument: boolean
  ) => TrackListProps['artList']
)
export const SelectedArtListRemove = createContext(
  getDefaultSelectedArtListRemove as (
    argument: string
  ) => TrackListProps['artList']
)

export const SelectedTrack = createContext(
  defaultTrackData[0] as TrackListProps
)
export const SelectedTrackUpdate = createContext(
  getDefaultSelectedTrack as (trackId: string) => TrackListProps
)

export function useTrackList() {
  return useContext(TrackList)
}
export function useTrackListAdd() {
  return useContext(TrackListAdd)
}
export function useTrackListRemove() {
  return useContext(TrackListRemove)
}
export function useTrackListCount() {
  return useContext(TrackListCount)
}

export function useSelectedArtList() {
  return useContext(SelectedArtList)
}
export function useSelectedArtListAdd() {
  return useContext(SelectedArtListAdd)
}
export function useSelectedArtListRemove() {
  return useContext(SelectedArtListRemove)
}

export function useSelectedTrack() {
  return useContext(SelectedTrack)
}

export function useSelectedTrackUpdate() {
  return useContext(SelectedTrackUpdate)
}

interface TrackListProviderProps {
  children: ReactNode
}

export const TrackListProvider: FC<TrackListProviderProps> = ({ children }) => {
  const [trackList, setTracks] = useState<TrackListProps[]>(defaultTrackData)
  const [selectedTrack, setSelectedTrack] = useState<TrackListProps>(
    trackList[0]
  )
  const [trackCount, setTrackCount] = useState<number>(trackList.length)

  const changeSelectedTrack = (trackId: string) => {
    if (selectedTrack === trackList.filter((Track) => Track.id === trackId)[0])
      return

    setSelectedTrack(
      trackList[
        trackList.indexOf(trackList.filter((Track) => Track.id === trackId)[0])
      ]
    )

    const selectedTrackElement: HTMLElement | null = document.getElementById(
      `trk_${trackId}`
    )
    const templateTrackSettings: HTMLElement | null = document.getElementById(
      'TemplateTrackSettings'
    )
    const templateTrackList: HTMLElement | null =
      document.getElementById('TemplateTracks')

    selectedTrackElement?.classList.replace('bg-zinc-300', 'bg-zinc-50')
    selectedTrackElement?.classList.replace(
      'dark:bg-stone-800',
      'dark:bg-stone-400'
    )

    for (var track in trackList) {
      const trackIdElement: HTMLElement | null = document.getElementById(
        `trk_${trackList[track]?.id}`
      )
      if (trackIdElement !== selectedTrackElement) {
        trackIdElement?.classList.replace('bg-zinc-50', 'bg-zinc-300')
        trackIdElement?.classList.replace(
          'dark:bg-stone-400',
          'dark:bg-stone-800'
        )
      }
    }

    if (templateTrackSettings?.classList.contains('MShide')) {
      templateTrackSettings?.classList.replace('MShide', 'MSshow')
      templateTrackList?.classList.replace(
        'MShideTemplateTracks',
        'MSshowTemplateTracks'
      )
    }
  }

  const removeTrack = (trackId: string) => {
    if (trackList.length !== 1) {
      setTracks(trackList.filter((Track) => Track.id !== trackId))
    }
    setTrackCount(trackList.length > 1 ? trackList.length - 1 : 1)
  }

  const addMultipleTracks = (addMltTrkInput: number) => {
    const lastTrackId = trackList[trackList.length - 1]?.id
    const newTrackIdStrArr: string[] = []

    if (addMltTrkInput > 200) {
      return alert('You can only add 200 tracks at a time.')
    }

    for (let i = 0; i < addMltTrkInput; i++) {
      const newTrackIdNumb: number = parseInt(lastTrackId) + 1 + i
      const newTrackIdStr: string = newTrackIdNumb.toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        useGrouping: false
      })
      newTrackIdStrArr.push(newTrackIdStr)
    }

    const NewTracks = newTrackIdStrArr.map((newTrackId) => ({
      id: newTrackId,
      locked: false,
      name: undefined,
      channel: 1,
      fullRange: [
        {
          id: '01',
          name: undefined,
          low: undefined,
          high: undefined,
          whiteKeysOnly: false
        }
      ],
      baseDelay: 0,
      avgDelay: undefined,
      artList: [
        {
          id: '01',
          name: undefined,
          toggle: true,
          codeType: undefined,
          code: undefined,
          on: undefined,
          off: undefined,
          range: [
            {
              id: null,
              name: null,
              low: null,
              high: null,
              whiteKeysOnly: null
            }
          ],
          default: 'on', //setting choice later
          delay: 0,
          changeType: undefined
        },
        {
          id: '02',
          name: undefined,
          toggle: false,
          codeType: undefined,
          code: undefined,
          on: undefined,
          off: undefined,
          range: [
            {
              id: '01',
              name: undefined,
              low: undefined,
              high: undefined,
              whiteKeysOnly: false
            }
          ],
          default: true,
          delay: 0,
          changeType: undefined
        }
      ],
      fadList: [
        {
          id: '01',
          name: undefined,
          codeType: undefined,
          code: undefined,
          default: undefined,
          changeType: undefined
        }
      ]
    }))

    setTracks(trackList.concat(NewTracks) as TrackListProps[])
    setTrackCount(trackList.length + NewTracks.length)
  }

  const [ArtList, setArts] = useState<TrackListProps['artList']>(
    selectedTrack.artList
  )

  const addArt = (toggle: boolean) => {
    const lastArtId = ArtList[ArtList.length - 1]?.id

    if (ArtList.length > 23) {
      return alert('Are you sure you need this many articulation buttons?')
    }

    const newArtIdNumb: number = parseInt(lastArtId) + 1
    const newArtIdStr: string = newArtIdNumb.toLocaleString('en-US', {
      minimumIntegerDigits: 2,
      useGrouping: false
    })
    const newArtToggle = {
      id: newArtIdStr,
      name: undefined,
      toggle: toggle,
      codeType: undefined,
      code: undefined,
      on: toggle ? undefined : null,
      off: toggle ? undefined : null,
      range: [
        {
          id: toggle ? '01' : null,
          name: toggle ? undefined : null,
          low: toggle ? undefined : null,
          high: toggle ? undefined : null,
          whiteKeysOnly: toggle ? false : null
        }
      ],
      default: toggle ? 'on' : false, //setting choice later
      delay: 0,
      changeType: undefined
    }

    setArts([...ArtList, newArtToggle])

    // const updatedTrack = {
    //     id: selectedTrack.id,
    //     locked: selectedTrack.locked,
    //     name: selectedTrack.name,
    //     channel: selectedTrack.channel,
    //     fullRange: selectedTrack.fullRange,
    //     baseDelay: selectedTrack.baseDelay,
    //     avgDelay: selectedTrack.avgDelay,
    //     artList: [...ArtList, newArtToggle],
    //     fadList: selectedTrack.fadList
    // }

    // const selectedTrackIndex = trackList.indexOf(selectedTrack)
    // const trackListFilter = trackList.splice(selectedTrackIndex, 1, updatedTrack)

    // setTracks(trackListFilter)
    // setSelectedTrack(updatedTrack)
  }

  const removeArt = (artId: string) => {
    if (ArtList.length !== 2) {
      setArts(ArtList.filter((art) => art.id !== artId))
    }
  }

  return (
    <TrackList.Provider value={trackList as unknown as TrackListProps[]}>
      <TrackListAdd.Provider
        value={addMultipleTracks as unknown as () => TrackListProps[]}>
        <TrackListRemove.Provider
          value={removeTrack as unknown as () => TrackListProps[]}>
          <TrackListCount.Provider value={trackCount as unknown as number}>
            <SelectedArtList.Provider
              value={ArtList as unknown as TrackListProps['artList']}>
              <SelectedArtListAdd.Provider
                value={
                  addArt as unknown as (
                    toggle: boolean
                  ) => TrackListProps['artList']
                }>
                <SelectedArtListRemove.Provider
                  value={
                    removeArt as unknown as (
                      artId: string
                    ) => TrackListProps['artList']
                  }>
                  <SelectedTrack.Provider
                    value={selectedTrack as unknown as TrackListProps}>
                    <SelectedTrackUpdate.Provider
                      value={
                        changeSelectedTrack as unknown as () => TrackListProps
                      }>
                      {children}
                    </SelectedTrackUpdate.Provider>
                  </SelectedTrack.Provider>
                </SelectedArtListRemove.Provider>
              </SelectedArtListAdd.Provider>
            </SelectedArtList.Provider>
          </TrackListCount.Provider>
        </TrackListRemove.Provider>
      </TrackListAdd.Provider>
    </TrackList.Provider>
  )
}
