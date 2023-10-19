export const downloadDataAsJSON = (data: any) => {
  const json = JSON.stringify(data)
  const blob = new Blob([json], { type: 'application/json' })
  const href = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = href
  link.download = 'template-io-track-data.json'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
