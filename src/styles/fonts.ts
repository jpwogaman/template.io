import localFont from 'next/font/local'

const caviar_dreamsbold = localFont({
  src: './fonts/Caviar_Dreams_Bold-webfont.woff'
})

const caviar_dreamsbold_italic = localFont({
  src: './fonts/CaviarDreams_BoldItalic-webfont.woff'
})

const caviar_dreamsitalic = localFont({
  src: './fonts/CaviarDreams_Italic-webfont.woff'
})

const caviar_dreamsregular = localFont({
  src: './fonts/CaviarDreams-webfont.woff'
})

const camingocoderegular = localFont({
  src: './fonts/CamingoCode-Regular-webfont.woff'
})

const camingocodeitalic = localFont({
  src: './fonts/CamingoCode-Italic-webfont.woff'
})

const camingocodebold_italic = localFont({
  src: './fonts/CamingoCode-BoldItalic-webfont.woff'
})

const camingocodebold = localFont({
  src: './fonts/CamingoCode-Bold-webfont.woff'
})

const allFontsClassName = `${caviar_dreamsbold.className} ${caviar_dreamsbold_italic.className} ${caviar_dreamsitalic.className} ${caviar_dreamsregular.className} ${camingocoderegular.className} ${camingocodeitalic.className} ${camingocodebold_italic.className} ${camingocodebold.className}`

export { allFontsClassName }