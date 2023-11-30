const SettingsTableKeys = {
  label: 'Settings',
  keys: [
    {
      className: '',
      show: true,
      key: 'vepOutSettings',
      input: 'text',
      selectArray: undefined,
      label: 'Number of VEP Outs'
    },
    {
      className: '',
      show: true,
      key: 'smpOutSettings',
      input: 'text',
      selectArray: undefined,
      label: 'Number of Sampler Outs'
    }
  ]
} as const

export default SettingsTableKeys
