import { type SelectValuesKeys } from '@/components/context'
import { type FileItem } from '@/components/backendCommands/backendCommands'

export type TrackListTableKeys = {
  label: 'Tracks'
  keys: {
    className?: string
    show: boolean
    key: keyof FileItem
    input?:
      | 'text'
      | 'select'
      | 'checkbox'
      | 'checkbox-switch'
      | 'select-multiple'
      | 'text-rich'
      | 'color-picker'
    selectArray?: SelectValuesKeys
    label?: string
  }[]
}

export const TrackListTableKeys: TrackListTableKeys = {
  label: 'Tracks',
  keys: [
    {
      className: 'w-[6%]',
      show: true,
      key: 'id',
      input: undefined,
      selectArray: undefined,
      label: 'ID'
    },
    {
      className: undefined,
      show: false,
      key: 'locked',
      input: undefined,
      selectArray: undefined,
      label: undefined
    },
    {
      className: 'w-[32%]',
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
      key: 'vep_instance',
      input: 'select',
      selectArray: 'vepInstList',
      label: 'VEP Instance'
    },
    {
      className: 'w-[8%]',
      show: true,
      key: 'vep_out',
      input: 'select',
      selectArray: 'vepOutsList',
      label: 'VEP Outs'
    },
    {
      className: 'w-[4%]',
      show: true,
      key: 'smp_number',
      input: 'text',
      selectArray: undefined,
      label: 'Sampler No.'
    },
    {
      className: 'w-[8%]',
      show: true,
      key: 'smp_out',
      input: 'select',
      selectArray: 'smpOutsList',
      label: 'Sampler Outs'
    },
    {
      className: 'w-[10%]',
      show: true,
      key: 'base_delay',
      input: 'text',
      selectArray: undefined,
      label: 'Base Delay'
    },
    {
      className: 'w-[10%]',
      show: true,
      key: 'avg_delay',
      input: undefined,
      selectArray: undefined,
      label: 'Avg. Delay'
    },
    {
      className: undefined,
      show: false,
      key: 'color',
      input: 'color-picker',
      selectArray: undefined,
      label: undefined
    },
    {
      className: undefined,
      show: false,
      key: 'notes',
      input: 'text-rich',
      selectArray: undefined,
      label: undefined
    }
  ]
}
