import React, { type FC } from 'react'

const example: number[] = [0, 1, 2, 3, 4, 5, 6, 7]

interface SelectListProps {
  numbers?: string[] | number[]
  valName?: string[]
}

export const SelectList: FC<SelectListProps> = ({ numbers, valName }) => {  
  return (
    <>
      {numbers?.map((number: string | number) => (
        <option
          key={number}
          value={number}>
          {number}
        </option>
      ))}
    </>
  )
}

export const selectArrays: {
  [index: string]: {
    name: string
    array?: React.JSX.Element | string[] | number[]
  }
} = {
  example: {
    name: 'example',
    array: <SelectList numbers={example} />
  },
  valNoneList: { name: 'valNoneList', array: <option>N/A</option> }
}
