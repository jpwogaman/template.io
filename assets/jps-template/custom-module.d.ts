// These types are inferred from the Open Stage Control source code

declare function loadJSON(
  url: string,
  errorCallback?: (error: Error) => void
): any

type Address = `/${string}`

declare function receive(
  address: Address,
  ...args: (string | number | Record<string, any>)[]
): void

//declare function receive(
//  host: string | undefined,
//  port: string | number | undefined,
//  address: string,
//  ...args: (string | number | Record<string, any>)[]
//): void

declare function send(
  host: string,
  port: string,
  address: string,
  ...args: number[]
): void

declare type OscFilterData = {
  address: string
  args: Record<string, any>[]
  host: string
  port: string | number | undefined
}
