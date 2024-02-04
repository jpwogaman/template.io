const TrackListTableKeys = {
  label: 'Tracks',
  keys: [
    {
      className: 'w-[5%]',
      show: true,
      key: 'id',
      input: undefined,
      selectArray: undefined,
      label: 'ID'
    },
    {
      className: null,
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
      className: 'w-[6%]',
      show: true,
      key: 'channel',
      input: 'select',
      selectArray: 'chnMidiList',
      label: 'Ch.'
    },
    {
      className: 'w-[8%]',
      show: true,
      key: 'vepInstance',
      input: 'select',
      selectArray: 'vepInstList',
      label: 'VEP Instance'
    },
    {
      className: 'w-[8%]',
      show: true,
      key: 'vepOut',
      input: 'select',
      selectArray: 'vepOutsList',
      label: 'VEP Outs'
    },
    {
      className: 'w-[4%]',
      show: true,
      key: 'smpNumber',
      input: 'text',
      selectArray: undefined,
      label: 'Sampler No.'
    },
    {
      className: 'w-[8%]',
      show: true,
      key: 'smpOut',
      input: 'select',
      selectArray: 'smpOutsList',
      label: 'Sampler Outs'
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
      className: null,
      show: false,
      key: 'color',
      input: 'color-picker',
      selectArray: undefined,
      label: undefined
    },
    {
      className: null,
      show: false,
      key: 'notes',
      input: 'text-rich',
      selectArray: undefined,
      label: undefined
    }
  ]
} as const

export default TrackListTableKeys
