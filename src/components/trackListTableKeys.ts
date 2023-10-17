import { LayoutKeys } from '@/utils/template-io-track-data-schema'

const TrackListTableKeys = {
  label: 'Tracks',
  keys: [
    {
      className: 'w-[10%]',
      show: true,
      key: 'itemId',
      input: undefined,
      selectArray: undefined,
      label: 'ID'
    },
    {
      className: 'w-[00%]',
      show: false,
      key: 'locked',
      input: undefined,
      selectArray: undefined,
      label: undefined
    },
    {
      className: 'w-[33%]',
      show: true,
      key: 'name',
      input: 'text',
      selectArray: undefined,
      label: 'Name'
    },
    {
      className: 'w-[12%]',
      show: true,
      key: 'channel',
      input: 'select',
      selectArray: 'chnMidiList',
      label: 'Channel'
    },
    {
      className: 'w-[10%]',
      show: true,
      key: 'baseDelay',
      input: 'text',
      selectArray: undefined,
      label: 'Base Delay'
    },
    {
      className: 'w-[10%]',
      show: true,
      key: 'avgDelay',
      input: undefined,
      selectArray: undefined,
      label: 'Avg. Delay'
    },
    {
      className: 'w-[00%]',
      show: false,
      key: 'color',
      input: undefined,
      selectArray: undefined,
      label: undefined
    }
  ] as LayoutKeys[]
}

export default TrackListTableKeys
