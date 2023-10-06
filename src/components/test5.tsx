import { ChangeEvent, FC, Fragment, useEffect, useRef, useState, useCallback } from 'react'
import { HexColorPicker, HexColorInput } from 'react-colorful'
import { useSpring, animated } from '@react-spring/web'
import { useDrag } from '@use-gesture/react'
import { selectArrays, SelectList } from './select-arrays'
import { IconBtnToggle } from './icon-btn-toggle'
import localforage from 'localforage'

localforage.config({
    driver: localforage.INDEXEDDB,
    name: 'catalog.io',
    version: 1.0,
    storeName: 'file',
    description: ''
})
interface fileTypes {
    fileInfo: fileInfoTypes
    items: itemTypes[]
}
interface fileInfoTypes {
    fileName: string
    createdOn: string
    modifiedOn: string
    defaultColors: string[]
    layouts: { layout: string }[]
    vepTemplate: string
    dawTemplate: string
}
type select = string | number | null | undefined
type checkBox = boolean | number
interface itemTypes {
    id: string
    locked: checkBox
    name: string
    channel: select
    baseDelay: number | string | undefined | null
    avgDelay: number | string | undefined | null
    color: string
    fullRange: {
        id: string
        name: string
        low: select
        high: select
        whiteKeysOnly: checkBox
    }[]
    artListTog: {
        id: string
        name: string | undefined
        toggle: checkBox
        codeType: select
        code: select
        on: select
        off: select
        default: select | select
        delay: number | string | undefined | null
        changeType: select
        ranges: string[]
    }[]
    artListSwitch: {
        id: string
        name: string | undefined
        toggle: checkBox
        codeType: select
        code: select
        on: select
        off: select
        default: checkBox | select
        delay: number | string | undefined | null
        changeType: select
        ranges: string[]
    }[]
    fadList: {
        id: string
        name: string | undefined
        codeType: select
        code: select
        default: select | select
        changeType: select
    }[]
}
interface sortDataLevelOneProps {
    tableData: itemTypes[]
    sortKey: keyof itemTypes
    reverse: boolean
}
interface sortDataLevelTwoProps {
    tableData: itemTypes['fullRange'] | itemTypes['artListTog'] | itemTypes['fadList']
    sortKey: keyof itemTypes['fullRange'][number] | keyof itemTypes['artListTog'][number] | keyof itemTypes['fadList'][number]
    reverse: boolean
}
interface KeyTypes {
    className: string
    show: boolean
    key: sortDataLevelOneProps['sortKey'] | sortDataLevelTwoProps['sortKey']
    label: string | null
    selectArray: string | null
    input: undefined | 'text' | 'checkbox' | 'select' | 'select | checkbox'
}
interface levelOnekeyTypes {
    label: string
    keys: KeyTypes[]
}
interface levelTwoKeyTypes {
    title: string
    layout: string
    label: string
    keys: KeyTypes[]
}

const levelOneKeys: levelOnekeyTypes = {
    label: 'Tracks',
    keys: [
        { className: 'w-[10%]', show: true, key: 'id', input: undefined, selectArray: null, label: 'ID' },
        { className: 'w-[00%]', show: false, key: 'locked', input: undefined, selectArray: null, label: null },
        { className: 'w-[33%]', show: true, key: 'name', input: 'text', selectArray: null, label: 'Name' },
        { className: 'w-[12%]', show: true, key: 'channel', input: 'select', selectArray: 'chnMidiList', label: 'Channel' },
        { className: 'w-[10%]', show: true, key: 'baseDelay', input: 'text', selectArray: null, label: 'Base Delay' },
        { className: 'w-[10%]', show: true, key: 'avgDelay', input: undefined, selectArray: null, label: 'Avg. Delay' },
        { className: 'w-[00%]', show: false, key: 'color', input: undefined, selectArray: null, label: null }
    ]
}
const levelTwoKeys: levelTwoKeyTypes[] = [
    {
        title: 'Instrument Ranges',
        label: 'fullRange',
        layout: 'table',
        keys: [
            { className: 'w-[7.5%]', show: true, key: 'id', input: undefined, selectArray: null, label: 'ID' },
            { className: 'w-[16.5%]', show: true, key: 'name', input: 'text', selectArray: null, label: 'Name' },
            { className: 'w-[30.75%]', show: true, key: 'low', input: 'select', selectArray: 'allNoteList', label: 'Low' },
            { className: 'w-[30.75%]', show: true, key: 'high', input: 'select', selectArray: 'allNoteList', label: 'High' },
            { className: 'w-[9.5%]', show: true, key: 'whiteKeysOnly', input: 'checkbox', selectArray: null, label: 'WKO' }
        ]
    },
    {
        title: 'Articulations (Switch)',
        label: 'artListTog',
        layout: 'table',
        keys: [
            { className: 'w-[7.5%]', show: true, key: 'id', input: undefined, selectArray: null, label: 'ID' },
            { className: 'w-[16.5%]', show: true, key: 'name', input: 'text', selectArray: null, label: 'Name' },
            { className: 'w-[00%]', show: false, key: 'toggle', input: 'checkbox', selectArray: null, label: 'Toggle' },
            { className: 'w-[14%]', show: true, key: 'codeType', input: 'select', selectArray: 'valAddrList', label: 'Code Type' },
            { className: 'w-[9.5%]', show: true, key: 'code', input: 'select', selectArray: 'valMidiList', label: 'Code' },
            { className: 'w-[9.5%]', show: true, key: 'on', input: 'select', selectArray: 'valMidiList', label: 'On' },
            { className: 'w-[9.5%]', show: true, key: 'off', input: 'select', selectArray: 'valMidiList', label: 'Off' },
            { className: 'w-[9.5%]', show: true, key: 'default', input: 'select', selectArray: 'valDeftList', label: 'Default' },
            { className: 'w-[9.5%]', show: true, key: 'delay', input: 'text', selectArray: null, label: 'Delay' },
            { className: 'w-[9.5%]', show: true, key: 'changeType', input: 'select', selectArray: 'valChngList', label: 'Change' },
            { className: 'w-[9.5%]', show: true, key: 'ranges', input: 'select', selectArray: 'artRngsArray', label: 'Ranges' }
        ]
    },
    {
        title: 'Articulations (Toggle)',
        label: 'artListSwitch',
        layout: 'table',
        keys: [
            { className: 'w-[7.5%]', show: true, key: 'id', input: undefined, selectArray: null, label: 'ID' },
            { className: 'w-[16.5%]', show: true, key: 'name', input: 'text', selectArray: null, label: 'Name' },
            { className: 'w-[00%]', show: false, key: 'toggle', input: 'checkbox', selectArray: null, label: 'Toggle' },
            { className: 'w-[14%]', show: true, key: 'codeType', input: 'select', selectArray: 'valAddrList', label: 'Code Type' },
            { className: 'w-[9.5%]', show: true, key: 'code', input: 'select', selectArray: 'valMidiList', label: 'Code' },
            { className: 'w-[9.5%]', show: true, key: 'on', input: 'select', selectArray: 'valMidiList', label: 'On' },
            { className: 'w-[00%]', show: false, key: 'off', input: 'select', selectArray: 'valMidiList', label: 'Off' },
            { className: 'w-[19%]', show: true, key: 'default', input: 'checkbox', selectArray: 'valDeftList', label: 'Default' },
            { className: 'w-[9.5%]', show: true, key: 'delay', input: 'text', selectArray: null, label: 'Delay' },
            { className: 'w-[9.5%]', show: true, key: 'changeType', input: 'select', selectArray: 'valChngList', label: 'Change' },
            { className: 'w-[9.5%]', show: true, key: 'ranges', input: 'select', selectArray: 'artRngsArray', label: 'Ranges' }
        ]
    },
    {
        title: 'Faders',
        label: 'fadList',
        layout: 'table',
        keys: [
            { className: 'w-[7.5%]', show: true, key: 'id', input: undefined, selectArray: null, label: 'ID' },
            { className: 'w-[16.5%]', show: true, key: 'name', input: 'text', selectArray: null, label: 'Name' },
            { className: 'w-[14%]', show: true, key: 'codeType', input: 'select', selectArray: 'valAddrList', label: 'Code Type' },
            { className: 'w-[19.5%]', show: true, key: 'code', input: 'select', selectArray: 'valMidiList', label: 'Code' },
            { className: 'w-[29%]', show: true, key: 'default', input: 'select', selectArray: 'valMidiList', label: 'Default' },
            { className: 'w-[9.5%]', show: true, key: 'changeType', input: 'select', selectArray: 'valChngList', label: 'Change' }
        ]
    }
]
const initializeItem = (newId: number, obj?: itemTypes) => {
    let artCount = -1
    let rngCount = -1
    let fadCount = -1
    return {
        id: `T_${newId}`,
        locked: obj?.locked ? obj.locked : false,
        name: obj?.name ? obj.name : '',
        channel: obj?.channel ? obj.channel : 1,
        baseDelay: obj?.baseDelay ? obj.baseDelay : 0,
        avgDelay: obj?.avgDelay ? obj.avgDelay : '0.00',
        color: obj?.color ? obj.color : '#71717A',
        fullRange: obj?.fullRange
            ? obj?.fullRange.map((range) => {
                  rngCount++
                  return {
                      id: `T_${newId}_FR_${rngCount}`,
                      name: range.name,
                      low: range.low,
                      high: range.high,
                      whiteKeysOnly: range.whiteKeysOnly
                  }
              })
            : [
                  {
                      id: `T_${newId}_FR_${0}`,
                      name: '',
                      low: 'C-2',
                      high: 'B8',
                      whiteKeysOnly: false
                  }
              ],
        artListTog: obj?.artListTog
            ? obj?.artListTog.map((art) => {
                  artCount++
                  return {
                      id: `T_${newId}_AL_${artCount}`,
                      name: art.name,
                      toggle: art.toggle,
                      codeType: art.codeType,
                      code: art.code,
                      on: art.on,
                      off: art.off,
                      default: art.default,
                      delay: art.delay,
                      changeType: art.changeType,
                      ranges: art.ranges
                  }
              })
            : [
                  {
                      id: `T_${newId}_AL_${0}`,
                      name: '',
                      toggle: true,
                      codeType: '/control',
                      code: 0,
                      on: 0,
                      off: 0,
                      default: 'Off',
                      delay: 0,
                      changeType: 'Value 2',
                      ranges: [`T_${newId}_FR_${0}`]
                  }
              ],
        artListSwitch: obj?.artListSwitch
            ? obj?.artListSwitch.map((art) => {
                  artCount++
                  return {
                      id: `T_${newId}_AL_${artCount}`,
                      name: art.name,
                      toggle: art.toggle,
                      codeType: art.codeType,
                      code: art.code,
                      on: art.on,
                      off: art.off,
                      default: art.default,
                      delay: art.delay,
                      changeType: art.changeType,
                      ranges: art.ranges
                  }
              })
            : [
                  {
                      id: `T_${newId}_AL_${1}`,
                      name: '',
                      toggle: false,
                      codeType: '/control',
                      code: 0,
                      on: 0,
                      off: 0,
                      default: true,
                      delay: 0,
                      changeType: 'Value 2',
                      ranges: [`T_${newId}_FR_${0}`]
                  }
              ],
        fadList: obj?.fadList
            ? obj?.fadList.map((fad) => {
                  fadCount++
                  return {
                      id: `T_${newId}_FL_${fadCount}`,
                      name: fad.name,
                      codeType: fad.codeType,
                      code: fad.code,
                      default: fad.default,
                      changeType: fad.changeType
                  }
              })
            : [
                  {
                      id: `T_${newId}_FL_${0}`,
                      name: '',
                      codeType: '/control',
                      code: 0,
                      default: 0,
                      changeType: 'Value 2'
                  }
              ]
    } as itemTypes
}

const initializeFileInfo = () => {
    return {
        fileName: '',
        createdOn: '',
        modifiedOn: '',
        defaultColors: ['#71717A', '#cd9323', '#1a53d8', '#9a2151', '#0d6416', '#8d2808'],
        layouts: levelTwoKeys,
        vepTemplate: '',
        dawTemplate: ''
    } as fileInfoTypes
}

let lastid = 0
let optionElements: string | JSX.Element | undefined

export const Test5: FC = () => {
    const firstLoad = useRef(true)
    const useEffectCount = useRef(0)

    const [file, setFile] = useState<fileTypes>({ fileInfo: initializeFileInfo(), items: [initializeItem(0)] })
    const [fileInfo, setFileInfo] = useState<fileInfoTypes>(initializeFileInfo())
    const [items, setItems] = useState<itemTypes[]>([initializeItem(0)])
    const [NewSubItems, setNewSubItems] = useState<itemTypes[]>([initializeItem(0)])

    const [selectedItemIndex, setSelectedItemIndex] = useState(0)
    const [addMultipleItemsNumber, setMultipleItemsNumber] = useState(1)

    const [showColorSelector, setShowColorSelector] = useState(false)
    const [showColorPresetDelete, setShowColorPresetDelete] = useState(false)
    const [color, setColor] = useState(fileInfo.defaultColors[0])
    const [SelectedColor, setSelectedColor] = useState('')

    const [anchorPoint, setAnchorPoint] = useState<{ x: number; y: number }>({ x: 0, y: 0 })

    const artRngsArray: string[] = []
    for (let i = 0; i < items[selectedItemIndex].fullRange.length; i++) {
        artRngsArray.push(items[selectedItemIndex].fullRange[i].id)
    }

    const fileInfoChange = (event: ChangeEvent<HTMLInputElement>, key: string) => {
        const newInfo = { ...fileInfo, [key]: event.target.value }
        setFileInfo(newInfo)
    }

    const lockItemHelper = (thisIndex: number) => {
        const newValue = items.map((item) => {
            if (items.indexOf(item) !== thisIndex) return item
            return { ...item, locked: !item.locked }
        })
        setItems(newValue)
    }

    const changeLayoutsHelper = (layout: string, index: number) => {
        const newValue = fileInfo.layouts.map((originalLayout) => {
            if (fileInfo.layouts.indexOf(originalLayout) !== index) return originalLayout
            return { ...originalLayout, layout: layout }
        })
        setFileInfo({
            fileName: fileInfo.fileName,
            createdOn: fileInfo.createdOn,
            modifiedOn: fileInfo.modifiedOn,
            defaultColors: fileInfo.defaultColors,
            layouts: newValue,
            vepTemplate: fileInfo.vepTemplate,
            dawTemplate: fileInfo.dawTemplate
        })
    }

    const setMultipleItemsNumberHelper = (event: ChangeEvent<HTMLInputElement>) => {
        const input = event.target.value as unknown as number
        if (input > 1) {
            setMultipleItemsNumber(input as number)
        } else {
            setMultipleItemsNumber(1)
        }
    }

    const addItem = () => {
        let array = []
        for (let i = 0; i < parseInt(addMultipleItemsNumber.toString()); i++) {
            lastid++
            array.push(initializeItem(lastid))
        }
        array = [...items, ...array]
        setItems(array)
    }

    const findAverage = (obj: itemTypes, value: number) => {
        let allDelays = Number(obj.baseDelay)
        for (var i = 0; i < obj.artListTog.length; i++) {
            allDelays += Number(obj.artListTog[i].delay)
        }
        for (var i = 0; i < obj.artListSwitch.length; i++) {
            allDelays += Number(obj.artListSwitch[i].delay)
        }
        allDelays = Number(allDelays + value) / Number(obj.artListTog.length + obj.artListSwitch.length + 1)
        return allDelays.toFixed(2)
    }

    const addSubItem = (key: string) => {
        const newValue = items.map((obj) => {
            if (items.indexOf(obj) !== selectedItemIndex) {
                return obj as itemTypes
            }
            // type subItems = typeof obj["artList"] | typeof obj["fadList"] | typeof obj["fullRange"]
            // let count = obj[key as unknown as subItems].length // why doesn't this work?
            const count = obj[key as 'artListSwitch'].length
            const subKeys = Object.keys(obj[key as 'artListSwitch'][0])
            const newObject: itemTypes[keyof itemTypes] | {} = {}
            const values = initializeItem(0)[key as 'artListSwitch'][0]
            const descriptors = Object.getOwnPropertyDescriptors(obj[key as 'artListSwitch'][0])
            for (var i in subKeys) {
                if (subKeys[i] === 'id') continue
                if (subKeys[i] === 'default') continue
                if (subKeys[i] === 'delay') continue
                Object.defineProperty(newObject, subKeys[i], { value: values[subKeys[i] as 'id'], ...descriptors })
            }
            Object.defineProperty(newObject, 'id', { value: `T_${selectedItemIndex}_${key}_${count}`, ...descriptors })
            Object.defineProperty(newObject, 'default', { value: values['default'] === true ? false : 'Off', ...descriptors })
            Object.defineProperty(newObject, 'delay', { value: obj.baseDelay, ...descriptors })
            return {
                ...obj,
                avgDelay: findAverage(obj, 0),
                [key as 'artListTog']: [...obj[key as 'artListTog'], newObject]
            } as itemTypes
        })
        setNewSubItems(newValue)
    }

    const removeItem = (index: number, key?: string) => {
        let timer: NodeJS.Timeout
        if (!key) {
            if (items[index].locked) return alert(`Locked items cannot be deleted.`)
            if (items.length === 1) return alert(`There must be at least one item.`)
            if (items.length - 1 !== index) {
                return setItems(items.filter((item) => items.indexOf(item) !== index))
            }
            timer = setTimeout(() => {
                setSelectedItemIndex(items.length - 2)
                return setItems(items.filter((item) => items.indexOf(item) !== index))
            }, 100)
        }
        if (items[selectedItemIndex].locked) return alert(`Subitems of locked items cannot be deleted.`)
        if (items[selectedItemIndex][key as 'artListTog'].length === 1) return alert(`There must be at least one subitem per subsection.`)
        const newValue = items.map((obj) => {
            if (items.indexOf(obj) !== selectedItemIndex) {
                return obj
            }
            return {
                ...obj,
                avgDelay: findAverage(obj, 0),
                [key as 'fullRange']: items[selectedItemIndex][key as 'fullRange'].filter((subItem) => items[selectedItemIndex][key as 'fullRange'].indexOf(subItem) !== index)
            } as itemTypes
        })
        setItems(newValue)
    }

    const duplicateItem = (index: number) => {
        lastid++
        const obj = items.filter((item) => items.indexOf(item) === index)[0]
        const newValue = initializeItem(lastid, obj)
        const beforeObj = items.slice(0, index)
        const afterObj = items.slice(index + 1, items.length)
        setItems([...beforeObj, obj, newValue, ...afterObj])
    }

    const renumberItems = () => {
        if (!window.confirm('CAREFUL!\n\nThis may disrupt any third-party synchronization with your data.')) return
        let newId = -1
        const newValue = items.map((obj) => {
            newId++
            return initializeItem(newId, obj)
        })
        setItems(newValue)
        lastid = newValue.length - 1
    }

    const valueChange = (event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement> | ChangeEvent<HTMLButtonElement>, key: string, subKey?: string, index?: number) => {
        const newValue = items.map((obj) => {
            if (items.indexOf(obj) !== selectedItemIndex) {
                return obj
            }
            if (typeof obj[key as 'locked'] === 'boolean') {
                return { ...obj, [key]: !obj[key as 'locked'] }
            }
            if (key === 'baseDelay') {
                return {
                    ...obj,
                    avgDelay: findAverage(obj, parseInt(event.target.value)),
                    baseDelay: event.target.value,
                    artListTog: obj.artListTog.map((subObj) => {
                        if (subObj.delay !== obj.baseDelay) return subObj
                        return { ...subObj, delay: event.target.value }
                    }),
                    artListSwitch: obj.artListSwitch.map((subObj) => {
                        if (subObj.delay !== obj.baseDelay) return subObj
                        return { ...subObj, delay: event.target.value }
                    })
                }
            }
            if (!subKey) {
                return { ...obj, [key]: event.target.value }
            }
            if (subKey === 'ranges') {
                event = event as ChangeEvent<HTMLSelectElement>
                const selectedOptions = event.currentTarget.selectedOptions
                const ranges: string[] = []
                for (let i = 0; i < selectedOptions.length; i++) {
                    ranges.push(selectedOptions[i].value)
                }
                console.log(ranges)
                return {
                    ...obj,
                    [key]: obj[key as 'artListTog'].map((subObj) => {
                        if (obj[key as 'artListTog'].indexOf(subObj) !== index) {
                            return subObj
                        }
                        return { ...subObj, ranges: ranges }
                    })
                }
            }

            if (subKey === 'delay') {
                return {
                    ...obj,
                    avgDelay: findAverage(obj, Number(parseInt(event.target.value) - parseInt(obj[key as 'artListTog'][index as unknown as number]?.delay as string))),
                    [key]: obj[key as 'artListTog'].map((subObj) => {
                        if (obj[key as 'artListTog'].indexOf(subObj) !== index) {
                            return subObj
                        }
                        return { ...subObj, delay: event.target.value }
                    })
                }
            }
            return {
                ...obj,
                [key]: obj[key as 'fullRange'].map((subObj) => {
                    if (obj[key as 'fullRange'].indexOf(subObj) !== index) {
                        return subObj
                    }
                    if (typeof subObj[subKey as 'whiteKeysOnly'] === 'boolean') {
                        return {
                            ...subObj,
                            [subKey]: !subObj[subKey as 'whiteKeysOnly']
                        }
                    }
                    return { ...subObj, [subKey]: event.target.value }
                })
            }
        })
        setItems(newValue)
    }

    const showColorSelectorHelper = (index: number) => {
        if (index === selectedItemIndex && showColorSelector) return setShowColorSelector(false)
        setShowColorSelector(true)
    }

    const setPresetColor = (presetColor: any) => {
        if (presetColor === color) {
            const newValue = items.map((obj) => {
                if (items.indexOf(obj) !== selectedItemIndex) {
                    return obj
                }
                return { ...obj, color: presetColor }
            })
            setItems(newValue)
        }
        setColor(presetColor)
    }

    const deletePresetColor = () => {
        if (!fileInfo.defaultColors.includes(SelectedColor)) return
        setFileInfo({
            fileName: fileInfo.fileName,
            createdOn: fileInfo.createdOn,
            modifiedOn: fileInfo.modifiedOn,
            defaultColors: fileInfo.defaultColors.filter((color) => color !== SelectedColor),
            layouts: fileInfo.layouts,
            vepTemplate: fileInfo.vepTemplate,
            dawTemplate: fileInfo.dawTemplate
        })
    }

    const addColor = () => {
        if (fileInfo.defaultColors.includes(color)) return
        setFileInfo({
            fileName: fileInfo.fileName,
            createdOn: fileInfo.createdOn,
            modifiedOn: fileInfo.modifiedOn,
            defaultColors: [...fileInfo.defaultColors, color],
            layouts: fileInfo.layouts,
            vepTemplate: fileInfo.vepTemplate,
            dawTemplate: fileInfo.dawTemplate
        })
    }

    const testResults = () => {
        console.log('file', file)
    }
    //clear console, refresh page, wipe IndexDB
    const clearResults = () => {
        console.clear()
        window.location.reload()
        localforage
            .clear()
            .then(() => {
                console.log('localForage cleared')
            })
            .catch((e) => {
                console.log(e)
            })
    }
    //stringify file and create download link
    const exportData = () => {
        const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(file))}`
        const link = document.createElement('a')
        link.href = jsonString
        link.download = `${file.fileInfo.fileName}.json`
        link.click()
    }
    //parse JSON and setFile to result
    const importData = (event: ChangeEvent<HTMLInputElement>) => {
        const fileReader = new FileReader()
        fileReader.readAsText(event!.target!.files![0], 'UTF-8')
        fileReader.onload = (event) => {
            const importedData: fileTypes = JSON.parse(event!.target!.result as unknown as string)
            setFile(importedData)
        }
    }
    //close custom "contextMenu" for color picker
    useEffect(() => {
        if (showColorPresetDelete) {
            document.addEventListener('click', handleClick)
        }
        return () => {
            document.removeEventListener('click', handleClick)
        }
    })
    //get data from IndexDB and setFile as data
    useEffect(() => {
        if (!firstLoad.current) {
            localforage
                .getItem('file')
                .then((data) => {
                    if (data) {
                        setFile(data as fileTypes)
                    }
                })
                .catch((e) => {
                    console.log(e)
                })
        }
        return () => {
            firstLoad.current = false
            useEffectCount.current = useEffectCount.current + 1
        }
    }, [])
    //Keep track of useGesture "useDrag"
    useEffect(() => {
        const handler = (event: { preventDefault: () => any }) => event.preventDefault()
        document.addEventListener('gesturestart', handler)
        document.addEventListener('gesturechange', handler)
        document.addEventListener('gestureend', handler)
        return () => {
            document.removeEventListener('gesturestart', handler)
            document.removeEventListener('gesturechange', handler)
            document.removeEventListener('gestureend', handler)
        }
    }, [])
    //this is for "addSubItem"
    useEffect(() => {
        if (useEffectCount.current > 1) {
            const newValue = NewSubItems!.map((obj) => {
                const newId = parseInt(obj.id.split('_')[1])
                return initializeItem(newId, obj)
            })
            setItems(newValue)
            lastid = newValue.length - 1
        }
    }, [NewSubItems])
    //setItems and fileInfo from data
    useEffect(() => {
        if (!firstLoad.current) {
            setItems(file.items)
            setFileInfo(file.fileInfo)
        }
    }, [file])
    //newFileInfo to IndexDB and setFile
    useEffect(() => {
        let timer: NodeJS.Timeout
        if (useEffectCount.current > 1) {
            timer = setTimeout(() => {
                const newFileInfo = {
                    fileInfo: fileInfo,
                    items: items
                }
                setFile(newFileInfo) //this doesn't appear to be causing an infinite loop but I'm not sure why not ?? then I started having a bug where refreshing would wipe out the page and now commenting this out seems to be helping ??
                localforage
                    .setItem('file', newFileInfo)
                    .then()
                    .catch((e) => {
                        console.log(e)
                    })
            }, 100)
        }
        if (useEffectCount.current === 1) {
            useEffectCount.current = useEffectCount.current + 1
        }
        return () => {
            clearTimeout(timer)
        }
    }, [fileInfo, items])
    //set item color
    useEffect(() => {
        let timer: NodeJS.Timeout
        if (useEffectCount.current > 1) {
            timer = setTimeout(() => {
                const newValue = items.map((obj) => {
                    if (items.indexOf(obj) !== selectedItemIndex) {
                        return obj
                    }
                    return { ...obj, color: color }
                })
                setItems(newValue)
            }, 10)
        }

        return () => {
            clearTimeout(timer)
        }
    }, [color])
    //for color picker / useDrag
    const handleClick = useCallback(() => (showColorPresetDelete ? setShowColorPresetDelete(false) : null), [showColorPresetDelete])
    //for color picker / useDrag
    const popUp = useCallback(
        (event: any, color: any) => {
            event.preventDefault()
            event.stopPropagation()
            setAnchorPoint({ x: event.pageX, y: event.pageY })
            setSelectedColor(color)
            setShowColorPresetDelete(true)
        },
        [setAnchorPoint, setShowColorPresetDelete]
    )
    //default configuration for useGesture "useSpring"
    const [style, api] = useSpring(() => ({ x: 0, y: 0, scale: 1, rotateZ: 0 }))
    //useGesture "useDrag"
    const bind = useDrag(({ down, offset: [ox, oy] }) => api.start({ x: ox, y: oy, immediate: down }), {
        bounds: { left: -1000, right: 1000 }
    })

    const trackTh = `
        bg-zinc-400 dark:bg-zinc-500
        font-caviarBold dark:font-normal
        p-1
       `

    const trackTr = `bg-zinc-300  
        dark:bg-zinc-600 
        hover:bg-zinc-500 
        dark:hover:bg-zinc-400       
	    hover:text-zinc-50 
        dark:hover:text-zinc-50        
       `

    const trackTd = ``

    return (
        <Fragment>
            {showColorPresetDelete ? (
                <button
                    style={{ top: anchorPoint.y - 15, left: anchorPoint.x + 25 }}
                    onClick={deletePresetColor}
                    className='cursor-pointer flex gap-2 items-center justify-center rounded-lg absolute z-[1010] h-[50px] w-[140px] border border-zinc-200 bg-zinc-800 text-main-invert text-center p-2'>
                    <i className='fa-solid fa-xmark' />
                    <p>Remove Color</p>
                </button>
            ) : null}
            <div className='max-w-[90vw] mx-auto py-6 px-1 h-[calc(100vh-60px)] overflow-hidden'>
                <div className='w-1/2'>
                    <h1 className='text-2xl font-caviarBold '>
                        <input
                            type='text'
                            className='p-1 w-full bg-white dark:bg-zinc-100'
                            onChange={(event) => fileInfoChange(event, 'fileName')}
                            value={fileInfo.fileName}
                            placeholder={fileInfo.fileName ? fileInfo.fileName : 'Project Name'}
                        />
                    </h1>
                    <div className='w-full flex gap-1 mt-1'>
                        <input
                            type='text'
                            className='p-1 bg-white dark:bg-zinc-100'
                            onChange={(event) => fileInfoChange(event, 'vepTemplate')}
                            value={fileInfo.vepTemplate}
                            placeholder={fileInfo.vepTemplate ? fileInfo.vepTemplate : 'VEP Template'}
                        />
                        <input
                            type='text'
                            className='p-1 bg-white dark:bg-zinc-100'
                            onChange={(event) => fileInfoChange(event, 'dawTemplate')}
                            value={fileInfo.dawTemplate}
                            placeholder={fileInfo.dawTemplate ? fileInfo.dawTemplate : 'DAW Template'}
                        />
                    </div>
                    <div className='w-full flex gap-1 mt-1'>
                        <button onClick={testResults} className='border border-zinc-900 dark:border-zinc-200 p-1'>
                            Console
                        </button>
                        <button onClick={clearResults} className='border border-zinc-900 dark:border-zinc-200 p-1'>
                            Clear
                        </button>
                        <button onClick={exportData} className='border border-zinc-900 dark:border-zinc-200 p-1'>
                            Export JSON
                        </button>
                        <input type='file' accept='text/json' className='border border-zinc-900 dark:border-zinc-200 p-1' onChange={(event) => importData(event)} />
                    </div>
                </div>

                <div className='flex gap-2 h-full w-full'>
                    {showColorSelector && !items[selectedItemIndex].locked ? (
                        <animated.div
                            className='w-min p-2 z-[1000] text-main-invert rounded-lg absolute will-change-transform cursor-grab touch-none select-none'
                            style={{ ...style, backgroundColor: `${items[selectedItemIndex].color}` }}>
                            <div className='flex justify-between'>
                                <p>{items[selectedItemIndex].id}</p>
                                <button className='float-right mb-2 h-6 w-6 flex items-center justify-center' onClick={() => setShowColorSelector(false)}>
                                    <i className='fa-solid fa-xmark' />
                                </button>
                            </div>
                            <div className='customColorPickerContainer'>
                                <HexColorPicker color={items[selectedItemIndex].color} onChange={setColor} />
                            </div>
                            <div className='flex my-1 flex-wrap gap-[5px]'>
                                <button className='w-[24px] h-[24px]' onClick={addColor}>
                                    <i className='fa-solid fa-plus' />
                                </button>
                                {fileInfo.defaultColors.map((presetColor: any) => (
                                    <button
                                        key={presetColor}
                                        className='w-[24px] h-[24px] border-none p-0 rounded cursor-pointer outline-1 outline outline-zinc-200'
                                        style={{ background: presetColor }}
                                        onClick={() => setPresetColor(presetColor)}
                                        onContextMenu={(event) => popUp(event, presetColor)}
                                    />
                                ))}
                            </div>
                            <p className='mb-1'>{items[selectedItemIndex].color}</p>
                            <HexColorInput prefixed onChange={setColor} className='p-1 w-full text-main' />
                        </animated.div>
                    ) : null}
                    <div className='w-6/12 max-h-[85%]'>
                        <div className='h-full overflow-y-scroll mt-4'>
                            <div className='flex bg-main gap-2 z-50 sticky top-[0px]'>
                                <h2 className='font-caviarBold text-base'>{`${levelOneKeys.label} (${items.length})`}</h2>
                            </div>
                            <table className='table-fixed border-separate border-spacing-0 text-left text-xs w-full'>
                                <thead>
                                    <tr>
                                        <td className={`w-[20px] ${trackTh} z-50 sticky top-[24px]`} />
                                        <td className={`w-[5%] ${trackTh} z-50 sticky top-[24px]`} />
                                        {levelOneKeys.keys.map((key) => {
                                            if (!key.show) return
                                            return (
                                                <td key={key.key} className={`${trackTh} z-50 sticky top-[24px] ${key.className}`} title={key.key}>
                                                    {key.key === 'id' ? (
                                                        <div className='flex gap-1'>
                                                            <p>{key.label}</p>
                                                            <button onClick={renumberItems} title={`Renumber ${levelOneKeys.label}`}>
                                                                <i className='fa-solid fa-arrow-down-1-9' />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        key.label
                                                    )}
                                                </td>
                                            )
                                        })}
                                        <td className={`${trackTh} w-[5%] z-50 sticky top-[24px]`}>Arts.</td>
                                        <td className={`${trackTh} p-0.5 w-[10%] z-50 sticky top-[24px]`}>
                                            <button onClick={addItem} className='w-1/2 min-h-[20px]'>
                                                <i className='fa-solid fa-plus' />
                                            </button>
                                            <input
                                                value={addMultipleItemsNumber}
                                                className='w-1/2 min-h-[20px] px-1 bg-white dark:bg-zinc-100 text-zinc-900'
                                                onChange={setMultipleItemsNumberHelper}></input>
                                        </td>
                                        <td className={`${trackTh} w-[5%] z-50 sticky top-[24px]`}>{/* <i className="fa-solid fa-copy" /> */}</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item) => {
                                        const thisIndex = items.indexOf(item)
                                        return (
                                            <tr
                                                key={thisIndex}
                                                onClick={() => setSelectedItemIndex(thisIndex)}
                                                className={`${trackTr} cursor-pointer ${
                                                    selectedItemIndex === thisIndex ? 'bg-red-300 dark:bg-red-400 text-zinc-50 hover:bg-zinc-600 dark:hover:bg-zinc-300 dark:hover:text-zinc-800' : ''
                                                } relative`}>
                                                <td className={`${trackTd} p-0.5`}>
                                                    <button
                                                        onClick={() => showColorSelectorHelper(thisIndex)}
                                                        style={{ backgroundColor: `${item.color}` }}
                                                        className='w-full h-[25px] rounded-sm'></button>
                                                </td>
                                                <td className={`${trackTd} text-center p-0.5`}>
                                                    <IconBtnToggle
                                                        classes={item.locked ? '' : ''}
                                                        titleA='Lock Item'
                                                        titleB='Unlock Item'
                                                        id='lockItem'
                                                        a='fa-solid fa-lock-open'
                                                        b='fa-solid fa-lock'
                                                        defaultIcon={item.locked ? 'b' : 'a'} //this isn't saving the correct icon on refresh
                                                        onToggleA={() => lockItemHelper(thisIndex)}
                                                        onToggleB={() => lockItemHelper(thisIndex)}></IconBtnToggle>
                                                </td>
                                                {levelOneKeys.keys.map((key) => {
                                                    const disabled = key.input === 'checkbox' ? false : item.locked ? true : key.key === 'id' ? true : false
                                                    for (const array in selectArrays) {
                                                        if (key.selectArray === selectArrays[array].name) {
                                                            optionElements = selectArrays[array].array
                                                        }
                                                    }
                                                    if (!key.show) return
                                                    return (
                                                        <td key={key.key} className={`${trackTd} p-0.5`} title={''}>
                                                            <div className={`${key.input === 'checkbox' ? 'w-[20px] mx-auto' : 'w-full'}`}>
                                                                {!key.input ? (
                                                                    <p className='p-1'>{item[key.key as 'id']}</p>
                                                                ) : key.input === 'select' ? (
                                                                    <select
                                                                        className={`w-full p-[5px] cursor-pointer overflow-scroll text-zinc-900 ${
                                                                            disabled ? `cursor-not-allowed bg-zinc-300` : `bg-white dark:bg-zinc-100`
                                                                        } `}
                                                                        value={!disabled ? (item[key.key as unknown as 'channel'] as unknown as string) : undefined}
                                                                        disabled={disabled}
                                                                        onChange={(event) => valueChange(event, key.key)}>
                                                                        {/* {!disabled ? optionElements : selectArrays.valNoneList.array} */}
                                                                        {optionElements}
                                                                    </select>
                                                                ) : (
                                                                    <input
                                                                        checked={item.locked as boolean}
                                                                        disabled={disabled}
                                                                        type={key.input}
                                                                        className={` p-1 w-full text-zinc-900
                                                                        ${key.input === 'checkbox' ? 'cursor-pointer' : ``}
                                                                        ${disabled ? 'cursor-not-allowed bg-zinc-300' : 'bg-white dark:bg-zinc-100'}`}
                                                                        onChange={(event) => valueChange(event, key.key)}
                                                                        value={item[key.key as 'id']}
                                                                    />
                                                                )}
                                                            </div>
                                                        </td>
                                                    )
                                                })}
                                                <td className={`${trackTd} p-0.5`}>
                                                    {/* {`${item.artListTog.length} / ${item.artListSwitch.length}`} */}
                                                    {`${item.artListTog.length + item.artListSwitch.length}`}
                                                </td>
                                                <td className={`${trackTd} p-0.5 text-center`}>
                                                    <button onClick={() => removeItem(thisIndex)}>
                                                        <i className='fa-solid fa-minus' />
                                                    </button>
                                                </td>
                                                <td className={`${trackTd} p-0.5 text-center`}>
                                                    <button onClick={() => duplicateItem(thisIndex)}>
                                                        <i className='fa-solid fa-copy' />
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className='w-6/12 max-h-[85%] overflow-y-scroll'>
                        {levelTwoKeys.map((level) => {
                            const levelIndex = levelTwoKeys.indexOf(level)
                            // const section = items[selectedItemIndex][level.label as keyof itemTypes] stupid error "length not a property of..."
                            const section = items[selectedItemIndex][level.label as unknown as 'artListSwitch']
                            const table = fileInfo.layouts[levelIndex].layout === 'table'
                            return (
                                <Fragment key={level.label}>
                                    <div className='mt-4 flex justify-between'>
                                        <h2 className='font-caviarBold text-base'>{`${level.title} (${section.length})`}</h2>
                                        <IconBtnToggle
                                            classes=''
                                            titleA=''
                                            titleB=''
                                            id='changeLayout'
                                            a='fa-solid fa-table-cells-large'
                                            b='fa-solid fa-table-columns'
                                            defaultIcon={table ? 'a' : 'b'} //this isn't saving the correct icon on refresh
                                            onToggleA={() => changeLayoutsHelper('cards', levelIndex)}
                                            onToggleB={() => changeLayoutsHelper('table', levelIndex)}></IconBtnToggle>
                                    </div>
                                    {table ? (
                                        <div className=''>
                                            <table className='table-fixed border-separate border-spacing-0 text-left text-xs w-full '>
                                                <thead>
                                                    <tr>
                                                        {level.keys.map((key) => {
                                                            if (!key.show) return
                                                            return (
                                                                <td key={key.key} title={key.key} className={`${trackTh} ${key.className} z-50 sticky top-0`}>
                                                                    {key.label}
                                                                </td>
                                                            )
                                                        })}
                                                        <td className={`${trackTh} text-center w-[5%] z-50 sticky top-0`}>
                                                            <button onClick={() => addSubItem(level.label)}>
                                                                <i className='fa-solid fa-plus' />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {section.map((subSection) => {
                                                        const thisIndex = section.indexOf(subSection)
                                                        return (
                                                            <tr key={thisIndex} className={`${trackTr}`}>
                                                                {level.keys.map((key) => {
                                                                    let multiple: boolean = false
                                                                    let selected: boolean = false
                                                                    const disabled = items[selectedItemIndex].locked ? true : key.key === 'id' ? true : false
                                                                    for (const array in selectArrays) {
                                                                        if (key.selectArray === 'artRngsArray') {
                                                                            // optionElements = <SelectList numbers={artRngsArray} />
                                                                            multiple = true
                                                                            optionElements = (
                                                                                <Fragment>
                                                                                    {artRngsArray.map((number: string | number) => (
                                                                                        <option
                                                                                            key={number}
                                                                                            // selected={subSection.ranges.includes(number as string) ? true : false}
                                                                                            value={number}>
                                                                                            {number}
                                                                                        </option>
                                                                                    ))}
                                                                                </Fragment>
                                                                            )
                                                                        }
                                                                        if (key.selectArray === selectArrays[array].name) {
                                                                            optionElements = selectArrays[array].array
                                                                        }
                                                                    }
                                                                    if (!key.show) return
                                                                    return (
                                                                        <td key={key.key} title={subSection[key.key as 'id'].toString()} className={`${trackTd} p-0.5`}>
                                                                            {!key.input ? (
                                                                                <p className='p-1'>{subSection[key.key as 'id']}</p>
                                                                            ) : key.input === 'select' && !multiple ? (
                                                                                <select
                                                                                    className={`w-full p-[4.5px] cursor-pointer overflow-scroll text-zinc-900
                                                                                    ${disabled ? `cursor-not-allowed bg-zinc-300` : `bg-white dark:bg-zinc-100`} `}
                                                                                    value={!disabled ? (subSection[key.key as unknown as 'name'] as unknown as string) : undefined}
                                                                                    disabled={disabled}
                                                                                    onChange={(event) => valueChange(event, level.label, key.key, thisIndex)}>
                                                                                    {/* {!disabled ? optionElements : selectArrays.valNoneList.array} */}
                                                                                    {optionElements}
                                                                                </select>
                                                                            ) : key.input === 'select' && multiple ? (
                                                                                // <details>
                                                                                <select
                                                                                    className={`w-full p-[4.5px] cursor-pointer overflow-scroll text-zinc-900
                                                                                        ${disabled ? `cursor-not-allowed bg-zinc-300` : `bg-white dark:bg-zinc-100`} `}
                                                                                    value={undefined}
                                                                                    multiple
                                                                                    disabled={disabled}
                                                                                    onChange={(event) => valueChange(event, level.label, key.key, thisIndex)}>
                                                                                    {optionElements}
                                                                                </select>
                                                                            ) : (
                                                                                // </details>
                                                                                <input
                                                                                    checked={subSection[key.key as 'changeType'] as unknown as boolean}
                                                                                    disabled={disabled}
                                                                                    type={key.input}
                                                                                    className={`p-1 w-full text-zinc-900
                                                                                    ${key.input === 'checkbox' ? 'cursor-pointer' : ``}
                                                                                    ${disabled ? 'cursor-not-allowed bg-zinc-300' : 'bg-white dark:bg-zinc-100'}`}
                                                                                    onChange={(event) => valueChange(event, level.label, key.key, thisIndex)}
                                                                                    value={subSection[key.key as 'id']}
                                                                                />
                                                                            )}
                                                                        </td>
                                                                    )
                                                                })}
                                                                <td className={`${trackTd} text-center`}>
                                                                    <button onClick={() => removeItem(thisIndex, level.label)}>
                                                                        <i className='fa-solid fa-minus' />
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        )
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <div className='flex gap-1 overflow-x-scroll'>
                                            {section.map((subSection) => {
                                                const thisIndex = section.indexOf(subSection)
                                                return (
                                                    <table key={subSection.id} className='table-auto border-separate border-spacing-0 text-left text-xs w-max'>
                                                        <thead>
                                                            <tr>
                                                                <td className={`${trackTh} w-1/2`}>{subSection.id}</td>
                                                                <td className={`${trackTh} flex justify-between`}>
                                                                    <button onClick={() => removeItem(thisIndex, level.label)}>
                                                                        <i className='fa-solid fa-minus' />
                                                                    </button>
                                                                    <button onClick={() => addSubItem(level.label)}>
                                                                        <i className='fa-solid fa-plus' />
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {level.keys.map((key) => {
                                                                let multiple: boolean = false
                                                                const disabled = items[selectedItemIndex].locked ? true : key.key === 'id' ? true : false
                                                                for (const array in selectArrays) {
                                                                    if (key.selectArray === 'artRngsArray') {
                                                                        optionElements = <SelectList numbers={artRngsArray} />
                                                                        multiple = true
                                                                    }
                                                                    if (key.selectArray === selectArrays[array].name) {
                                                                        optionElements = selectArrays[array].array
                                                                    }
                                                                }
                                                                if (!key.show) return
                                                                return (
                                                                    <tr key={key.key} className={`${trackTr}`}>
                                                                        <td className={`${trackTd} p-0.5`}>{key.label}</td>
                                                                        <td className={`${trackTd} p-0.5`}>
                                                                            {!key.input ? (
                                                                                <p className='p-1'>{subSection[key.key as 'id']}</p>
                                                                            ) : key.input === 'select' && !multiple ? (
                                                                                <select
                                                                                    className={`w-full p-[4.5px] cursor-pointer overflow-scroll 
                                                                                    ${disabled ? `cursor-not-allowed bg-zinc-300` : `bg-white dark:bg-zinc-100`} `}
                                                                                    value={!disabled ? (subSection[key.key as unknown as 'name'] as unknown as string) : undefined}
                                                                                    disabled={disabled}
                                                                                    onChange={(event) => valueChange(event, level.label, key.key, thisIndex)}>
                                                                                    {/* {!disabled ? optionElements : selectArrays.valNoneList.array} */}
                                                                                    {optionElements}
                                                                                </select>
                                                                            ) : key.input === 'select' && multiple ? (
                                                                                <details>
                                                                                    <select
                                                                                        className={`w-full p-[4.5px] cursor-pointer overflow-scroll 
                                                                                        ${disabled ? `cursor-not-allowed bg-zinc-300` : `bg-white dark:bg-zinc-100`} `}
                                                                                        value={undefined}
                                                                                        multiple
                                                                                        disabled={disabled}
                                                                                        onChange={(event) => valueChange(event, level.label, key.key, thisIndex)}>
                                                                                        {optionElements}
                                                                                    </select>
                                                                                </details>
                                                                            ) : (
                                                                                <input
                                                                                    checked={subSection[key.key as 'changeType'] as unknown as boolean}
                                                                                    disabled={disabled}
                                                                                    type={key.input}
                                                                                    className={`p-1 
                                                                                    ${key.input === 'checkbox' ? 'cursor-pointer' : `w-full`}
                                                                                    ${disabled ? 'cursor-not-allowed bg-zinc-300' : 'bg-white dark:bg-zinc-100'}`}
                                                                                    onChange={(event) => valueChange(event, level.label, key.key, thisIndex)}
                                                                                    value={subSection[key.key as 'id']}
                                                                                />
                                                                            )}
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            })}
                                                        </tbody>
                                                    </table>
                                                )
                                            })}
                                        </div>
                                    )}
                                </Fragment>
                            )
                        })}
                    </div>
                </div>
            </div>
        </Fragment>
    )
}
