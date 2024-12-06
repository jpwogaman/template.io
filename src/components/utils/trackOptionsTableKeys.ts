const TrackOptionsTableKeys = [
  {
    title: 'Instrument Ranges',
    label: 'full_ranges',
    layout: 'table',
    keys: [
      {
        className: 'w-[7.5%]',
        show: true,
        key: 'id',
        input: undefined,
        selectArray: null,
        label: 'ID'
      },
      {
        className: 'w-[16.5%]',
        show: true,
        key: 'name',
        input: 'text',
        selectArray: null,
        label: 'Name'
      },
      {
        className: 'w-[30.75%]',
        show: true,
        key: 'low',
        input: 'select',
        selectArray: 'allNoteList',
        label: 'Low'
      },
      {
        className: 'w-[30.75%]',
        show: true,
        key: 'high',
        input: 'select',
        selectArray: 'allNoteList',
        label: 'High'
      },
      {
        className: 'w-[9.5%]',
        show: true,
        key: 'white_keys_only',
        input: 'checkbox',
        selectArray: null,
        label: 'WKO'
      }
    ]
  },
  {
    title: 'Articulations (Toggle)',
    label: 'art_list_tog',
    layout: 'table',
    keys: [
      {
        className: 'w-[7.5%]',
        show: true,
        key: 'id',
        input: undefined,
        selectArray: null,
        label: 'ID'
      },
      {
        className: 'w-[16.5%]',
        show: true,
        key: 'name',
        input: 'text',
        selectArray: null,
        label: 'Name'
      },
      {
        className: 'w-[00%]',
        show: false,
        key: 'toggle',
        input: 'checkbox',
        selectArray: null,
        label: 'Toggle'
      },
      {
        className: 'w-[14%]',
        show: true,
        key: 'code_type',
        input: 'select',
        selectArray: 'valAddrList',
        label: 'Code Type'
      },
      {
        className: 'w-[9.5%]',
        show: true,
        key: 'code',
        input: 'select',
        selectArray: 'valMidiList',
        label: 'Code'
      },
      {
        className: 'w-[9.5%]',
        show: true,
        key: 'on',
        input: 'select',
        selectArray: 'valMidiList',
        label: 'On'
      },
      {
        className: 'w-[9.5%]',
        show: true,
        key: 'off',
        input: 'select',
        selectArray: 'valMidiList',
        label: 'Off'
      },
      {
        className: 'w-[9.5%]',
        show: true,
        key: 'default',
        input: 'select',
        selectArray: 'valDeftList',
        label: 'Default'
      },
      {
        className: 'w-[9.5%]',
        show: true,
        key: 'delay',
        input: 'text',
        selectArray: null,
        label: 'Delay'
      },
      {
        className: 'w-[9.5%]',
        show: true,
        key: 'change_type',
        input: 'checkbox-switch',
        selectArray: 'valChngList',
        label: 'Change'
      },
      {
        className: 'w-[9.5%]',
        show: true,
        key: 'ranges',
        input: 'select-multiple',
        selectArray: 'artRngsArray',
        label: 'Ranges'
      },
      {
        className: 'w-[9.5%]',
        show: true,
        key: 'art_layers',
        input: 'select-multiple',
        selectArray: 'artLayersArray',
        label: 'Layers'
      }
    ]
  },
  {
    title: 'Articulations (Tap)',
    label: 'art_list_tap',
    layout: 'table',
    keys: [
      {
        className: 'w-[7.5%]',
        show: true,
        key: 'id',
        input: undefined,
        selectArray: null,
        label: 'ID'
      },
      {
        className: 'w-[16.5%]',
        show: true,
        key: 'name',
        input: 'text',
        selectArray: null,
        label: 'Name'
      },
      {
        className: 'w-[00%]',
        show: false,
        key: 'toggle',
        input: 'checkbox',
        selectArray: null,
        label: 'Toggle'
      },
      {
        className: 'w-[14%]',
        show: true,
        key: 'code_type',
        input: 'select',
        selectArray: 'valAddrList',
        label: 'Code Type'
      },
      {
        className: 'w-[9.5%]',
        show: true,
        key: 'code',
        input: 'select',
        selectArray: 'valMidiList',
        label: 'Code'
      },
      {
        className: 'w-[9.5%]',
        show: true,
        key: 'on',
        input: 'select',
        selectArray: 'valMidiList',
        label: 'On'
      },
      {
        className: 'w-[00%]',
        show: false,
        key: 'off',
        input: 'select',
        selectArray: 'valMidiList',
        label: 'Off'
      },
      {
        className: 'w-[19%]',
        show: true,
        key: 'default',
        input: 'checkbox',
        selectArray: 'valDeftList',
        label: 'Default'
      },
      {
        className: 'w-[9.5%]',
        show: true,
        key: 'delay',
        input: 'text',
        selectArray: null,
        label: 'Delay'
      },
      {
        className: 'w-[9.5%]',
        show: true,
        key: 'change_type',
        input: 'checkbox-switch',
        selectArray: 'valChngList',
        label: 'Change'
      },
      {
        className: 'w-[9.5%]',
        show: true,
        key: 'ranges',
        input: 'select-multiple',
        selectArray: 'artRngsArray',
        label: 'Ranges'
      },
      {
        className: 'w-[9.5%]',
        show: true,
        key: 'art_layers',
        input: 'select-multiple',
        selectArray: 'artLayersArray',
        label: 'Layers'
      }
    ]
  },
  {
    title: 'Additional Layers',
    label: 'art_layers',
    layout: 'table',
    keys: [
      {
        className: 'w-[7.5%]',
        show: true,
        key: 'id',
        input: undefined,
        selectArray: null,
        label: 'ID'
      },
      {
        className: 'w-[16.5%]',
        show: true,
        key: 'name',
        input: 'text',
        selectArray: null,
        label: 'Name'
      },
      {
        className: 'w-[14%]',
        show: true,
        key: 'code_type',
        input: 'select',
        selectArray: 'valAddrList',
        label: 'Code Type'
      },
      {
        className: 'w-[9.5%]',
        show: true,
        key: 'code',
        input: 'select',
        selectArray: 'valMidiList',
        label: 'Code'
      },
      {
        className: 'w-[9.5%]',
        show: true,
        key: 'on',
        input: 'select',
        selectArray: 'valMidiList',
        label: 'On'
      },
      {
        className: 'w-[9.5%]',
        show: true,
        key: 'off',
        input: 'select',
        selectArray: 'valMidiList',
        label: 'Off'
      },
      {
        className: 'w-[19%]',
        show: true,
        key: 'default',
        input: 'select',
        selectArray: 'valDeftList',
        label: 'Default'
      },
      {
        className: 'w-[9.5%]',
        show: true,
        key: 'change_type',
        input: 'checkbox-switch',
        selectArray: 'valChngList',
        label: 'Change'
      }
    ]
  },
  {
    title: 'Faders',
    label: 'fad_list',
    layout: 'table',
    keys: [
      {
        className: 'w-[7.5%]',
        show: true,
        key: 'id',
        input: undefined,
        selectArray: null,
        label: 'ID'
      },
      {
        className: 'w-[16.5%]',
        show: true,
        key: 'name',
        input: 'text',
        selectArray: null,
        label: 'Name'
      },
      {
        className: 'w-[14%]',
        show: true,
        key: 'code_type',
        input: 'select',
        selectArray: 'valAddrList',
        label: 'Code Type'
      },
      {
        className: 'w-[19.5%]',
        show: true,
        key: 'code',
        input: 'select',
        selectArray: 'valMidiList',
        label: 'Code'
      },
      {
        className: 'w-[29%]',
        show: true,
        key: 'default',
        input: 'select',
        selectArray: 'valMidiList',
        label: 'Default'
      },
      {
        className: 'w-[9.5%]',
        show: true,
        key: 'change_type',
        input: 'checkbox-switch',
        selectArray: 'valChngList',
        label: 'Change'
      }
    ]
  }
] as const

export default TrackOptionsTableKeys
