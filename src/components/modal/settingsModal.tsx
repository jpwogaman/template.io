'use client'

import { type ChangeEvent, Fragment } from 'react'
import { useSelectedItem } from '@/components/context'
import { type Settings } from '@/components/backendCommands/backendCommands'
import { twMerge } from 'tailwind-merge'

export const SettingsModal = () => {
  const { settings, updateSettings } = useSelectedItem()

  type SettingsMenuOptions = Record<
    string,
    Partial<
      Record<
        keyof Settings,
        {
          label: string
          input: string
          max: number
        }
      >
    >
  >

  const SettingsMenuOptions: SettingsMenuOptions = {
    outputs: {
      vep_out_settings: {
        label: 'Number of VEP Outs',
        input: 'number',
        max: 256
      },
      smp_out_settings: {
        label: 'Number of Sampler Outs',
        input: 'number',
        max: 128
      }
    },
    counts: {
      default_range_count: {
        label: 'Default Number of Ranges for a New Track',
        input: 'number',
        max: 10
      },
      default_art_tog_count: {
        label: 'Default Number of Toggle Articulations for a New Track',
        input: 'number',
        max: 10
      },
      default_art_tap_count: {
        label: 'Default Number of Tap Articulations for a New Track',
        input: 'number',
        max: 10
      },
      default_art_layer_count: {
        label: 'Default Number of Articulation Layers for a New Track',
        input: 'number',
        max: 10
      },
      default_fad_count: {
        label: 'Default Number of Faders for a New Track',
        input: 'number',
        max: 10
      }
    },
    additions: {
      track_add_count: {
        label: 'Number of Tracks to Add at a Time',
        input: 'number',
        max: 10
      },
      sub_item_add_count: {
        label: 'Number of Ranges/Articulations/Faders to Add at a Time',
        input: 'number',
        max: 10
      }
    }
  }
  return (
    <div className='text-main relative top-12 w-full'>
      <h3 className='text-center text-2xl'>Settings</h3>
      <div className='text-main font-code mt-4 text-left text-base'>
        {Object.entries(SettingsMenuOptions).map(([key, item]) => {
          type subItemMap = [keyof Settings, (typeof item)[keyof Settings]][]

          return (
            <Fragment key={key}>
              <hr className='my-2' />

              {(Object.entries(item) as subItemMap).map(([subKey, subItem]) => {
                if (!subItem) return null

                const { label, input, max } = subItem

                return (
                  <div
                    key={subKey}
                    className='flex items-center'>
                    <label className='mr-4'>{`${label}:`}</label>
                    <div className='w-[60px]'>
                      {input === 'number' && (
                        <input
                          type='number'
                          id='contextMenuCountInput'
                          max={max}
                          min={1}
                          value={settings[subKey] as number}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            e.stopPropagation()
                            e.preventDefault()
                            const newValue = parseInt(e.target.value) || 1

                            void updateSettings({
                              key: subKey,
                              value: newValue
                            })
                          }}
                          className={twMerge(
                            'h-full w-full',
                            'hover:cursor-text',
                            'rounded-xs bg-inherit p-1 outline-hidden',
                            'focus-visible:cursor-text focus-visible:bg-white focus-visible:text-zinc-900 focus-visible:placeholder-zinc-500 focus-visible:ring-4 focus-visible:ring-indigo-600 focus-visible:outline-hidden'
                          )}
                        />
                      )}
                    </div>
                  </div>
                )
              })}
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}
