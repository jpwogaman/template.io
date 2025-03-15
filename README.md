# Template.io

<img src="./src-tauri/icons/icon.png" width="150">

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/jpwogaman/template.io/blob/main/LICENSE)

# Table of Contents

1. [How To Use Template.io Standalone](#how-to-use-templateio-standalone)

   1. [Install Template.io](#1-install-templateio)
      - [Option A. Download the Binary (coming soon)](#option-a-download-the-binary-coming-soon)
      - [Option B. Build Template.io from Source](#option-b-build-templateio-from-source)
   2. [Launch Template.io](#2-launch-templateio)
   3. [Explanation of Layout](#3-explanation-of-layout)
   4. [Editing Tracks](#4-editing-tracks)
      - [Main Track Information](#1-main-track-information)
      - [Context Menu](#2-context-menu)
   5. [Editing Sub-Items](#5-editing-sub-items)
      - [Instrument Ranges Information](#1-instrument-ranges-information)
      - [Articulations (Toggle) Information](#2-articulations-toggle-information)
      - [Articulations (Tap) Information](#3-articulations-tap-information)
      - [Additional Layers Information](#4-additional-layers-information)
      - [Faders Information](#5-faders-information)
      - [Context Menu](#6-context-menu)
   6. [Editing Settings](#6-editing-settings)
   7. [Import/Export/Flush DB](#7-importexportflush-db)

2. [How To Use Template.io with Open Stage Control and Cubase](#how-to-use-templateio-with-open-stage-control-and-cubase)
   1. [Follow the Instructions Above to Download and Setup Template.io](#1-follow-the-instructions-above-to-download-and-setup-templateio)
   2. [Setup MIDI Ports](#2-setup-midi-ports)
   3. [Download the Custom Module and Generic Remote Files](#3-download-the-custom-module-and-generic-remote-files)
   4. [Setup Open Stage Control](#4-setup-open-stage-control)
   5. [Setup Cubase](#5-setup-cubase)
   6. [Build Your Template! (eventually...)](#6-build-your-template-eventually)
   7. [Custom Module in Action](#7-custom-module-in-action)

# How To Use Template.io Standalone

## 1. Install Template.io

### Option A. Download the Binary (coming soon)

#### 1. Download the binary for your system from the releases page (coming soon).

### Option B. Build Template.io from Source

#### 1. Configure Requirements (Windows)

Requirements 1-3 are pulled from [**Tauri Prerequisites**](https://v2.tauri.app/start/prerequisites/).

1. [**Microsoft C++ Build Tools**](https://visualstudio.microsoft.com/visual-cpp-build-tools/)

   a. Download the Microsoft C++ Build Tools installer and open it to begin installation.

   b. During installation check the “Desktop development with C++” option.

2. [**WebView2**](https://developer.microsoft.com/en-us/microsoft-edge/webview2/#download-section)

   a. already installed on Windows 10 (from version 1803 onward) and later versions of Windows.

3. [**Rust**](https://www.rust-lang.org/tools/install)

4. [**Git**](https://git-scm.com/downloads)

5. [**Node.js**](https://nodejs.org/en/download/) - **_Only version 18.20.x currently works_**

6. [**pnpm**](https://pnpm.io/installation) - **_Only version 9.15.x currently works_**

#### 2. Build Template.io

In a command prompt or terminal, navigate to the directory where you would like to download the repository and run the following commands:

1.  ```
    git clone https://github.com/jpwogaman/template.io.git
    ```
2.  ```
    cd template.io
    ```
3.  ```
    pnpm install
    ```
4.  ```
    pnpm tauri build
    ```

The binary should build relative to the repository:

**_C:\PATH\TO\template.io\src-tauri\target\release\template-io.exe_**

#### 3. Update Template.io from Source

If you have already cloned the repository and would like to update it, navigate to the root of the repository in a command prompt or terminal and run the following commands:

1.  ```
    git pull
    ```
2.  ```
    pnpm install
    ```
3.  ```
    pnpm tauri build
    ```

## 2. Launch Template.io

1. Navigate to where you downloaded template-io.exe, or to where you built it from source, and launch the app.
2. Upon the very first startup, Template.io will generate a new directory relative to your systems' home directory (_on Windows, this will be C:\Users\USERNAME\template.io_) containing two files:
   1. settings.json
   2. database.sqlite
3. Do not move or delete these files while Template.io is running, as this will cause the app to crash. If you do, simply restart the app and it will generate new files. However, if you do delete these files, you will lose all of your data.

![Application Folder](./assets/Images/application-folder.png)

## 3. Explanation of Layout

Now that we've successfully launched Template.io, let's go over the layout of the app. This is what you will see when you first open the app:

![Template.io Init](./assets/Images/template-io-init.png)

The app is divided into two sections:

1. **Track List** on the left side - This is where you will see all of your tracks. You can add, edit, and delete tracks from this list.
2. **Track Details** on the right side - This is where you will see all of the details for the selected track. The Track Details are split into five sub-sections and the default number of sub-items for a new track can be adjusted in the settings.

   1. Instrument Ranges
   2. Articulations (Toggle)
   3. Articulations (Tap)
   4. Additional Layers
   5. Faders

The sub-items in the Track Details can be displayed as either a table or as cards by clicking on the icon above the section.

![Sub-Items Tables or Cards](./assets/Images/template-io-sub-items-cards.png)

## 4. Editing Tracks

### 1. Main Track Information

- `color: string` track color
- `locked: boolean` prevents editing or deleting the track
- `id: T_{number}` unique and not editable
- `name: string`
- `channel: number` 1-16, corresponds to a MIDI channel
- `vep_instance: string` the name of the instance if using VEP,
  - _TBD ADJUSTABLE IN SETTINGS_
- `vep_out: string` the set of main outputs in VEP if using VEP, the number of available outputs can be adjusted in the settings
- `smp_number: string` the number of the sampler if using VEP
  - _TBD ADJUSTABLE IN SETTINGS_
- `smp_out: string` the set of outputs in the sampler if using VEP, the number of available outputs can be adjusted in the settings
- `base_delay: number` the positive or negative track delay in ms
- `avg_delay: number` not editable, average of all articulation delays (in ms) if they differ from the base delay
- `arts: number` not editable and not part of actual schema, this is a count of all of the articulations in the Track Details
- `notes: string` editable in the Track Details

![Template.io Main Information](./assets/Images/template-io-main-info.png)

### 2. Context Menu

#### - _Move a Track Up (coming soon)_

#### - _Move a Track Down (coming soon)_

#### - _Add Tracks Above Currently Selected Track (coming soon)_

#### - _Add Tracks Below Currently Selected Track (coming soon)_

#### - Add Tracks At End of Track List

To add a track, right-click on a track in the list and select "Add # Track At End". To change the number of tracks you want to add, adjust the number in the input box. This can also be adjusted in the settings.

![Track Context Menu](./assets/Images/track-context-menu.png)

#### - _Duplicate Track Above Currently Selected Track (coming soon)_

#### - _Duplicate Track Below Currently Selected Track (coming soon)_

#### - _Duplicate Track At End of Track List (coming soon)_

#### - Copy Track Settings

#### - _Paste Track SetTings (coming soon)_

#### - Clear a Track

#### - Delete a Track

## 5. Editing Sub-Items

### 1. Instrument Ranges Information

- `id: T_{number}_FR_{number}` unique and not editable
- `name: string`
- `low: string` note names, with "Middle C" being C3
  - _TBD ADJUSTABLE IN SETTINGS_, but "Middle C" is always Note 60
- `high: number` note names, with "Middle C" being C3
  - _TBD ADJUSTABLE IN SETTINGS_, but "Middle C" is always Note 60
- `white_keys_only: boolean`

![Instrument Ranges Information](./assets/Images/ranges-info.png)

### 2. Articulations (Toggle) Information

- `id: T_{number}_AT_{number}` unique and not editable
- `name: string`
- `code_type: string` these correlate to Open Stage Control addresses
- `code: number`

  - _TBD number ranges will change depending on code_type_, currently:
    - if `code_type = /control`, then `code: 0-127`
    - if `code_type = /note`, then `code: 0-127`

- `on: number` 0-127

- `off: number` 0-127
- `default: string`
- `delay: number` the track delay (in ms) when this articulation is active
- `change_type: string`
  - _TBD actually employing this logic in the Open Stage Control custom module._ Current logic is the Value 2 logic but the options would be:
    - Value 1 = the ON and OFF values relate to the CODE itself (i.e. ON = CC18, OFF = CC35)
    - Value 2 = the ON and OFF values relate to the CODE's second Value (i.e. CODE = C#3, ON = Velocity 20, OFF = Velocity 21)
- `ranges: string` list of Instrument Range ids, there must always be one Instrument Range linked to every Articulation (Tap or Toggle)
- `art_layers_on: string` list of Additional Layer ids, these will fire all together in the Open Stage Control custom module
- `art_layers_off: string` list of Additional Layer ids, these will fire all together in the Open Stage Control custom module

![Articulations (Toggle) Information](./assets/Images/articulations-toggle-info.png)

![Articulations (Toggle) Ranges Selection](./assets/Images/art-tog-ranges.png)

![Articulations (Toggle) Layers Selection](./assets/Images/art-tog-layers.png)

### 3. Articulations (Tap) Information

- `id: T_{number}_AT_{number}` unique and not editable, the count will always start after the last Toggle Articulation
- `name: string`
- `code_type: string` these correlate to Open Stage Control addresses
- `code: number`
  - _TBD number ranges will change depending on code_type_, currently:
    - if `code_type = /control`, then `code: 0-127`
    - if `code_type = /note`, then `code: 0-127`
- `on: number` 0-127
- `default: boolean` only one Tap Articulation may be default
- `delay: number` the track delay (in ms) when this articulation is active
- `change_type: string`
  - _TBD actually employing this logic in the Open Stage Control custom module._ Current logic is the Value 2 logic but the options would be:
    - Value 1 = the ON value relates to the CODE itself (e.g. ON = CC18)
    - Value 2 = the ON value relates to the CODE's second Value (e.g. CODE = C#3, ON = Velocity 20)
- `ranges: string` list of Instrument Range ids, there must always be one Instrument Range linked to every Articulation (Tap or Toggle)
- `art_layers: string` list of Additional Layer ids
- `layers_together: boolean` whether Additional Layers fire all together or one-at-a-time in the custom module.
- `default_layer: string` default Additional Layer if the layers fire one-at-a-time, only one layer may be default. If no default layer is selected, the Open Stage Control custom module will use the first layer in the list for the default.

![Articulations (Tap) Information](./assets/Images/articulations-tap-info.png)

![Articulations (Tap) Range Selection](./assets/Images/art-tap-ranges.png)

![Articulations (Tap) Layers Selection](./assets/Images/art-tap-layers.png)

### 4. Additional Layers Information

- `id: T_{number}_AL_{number}` unique and not editable
- `name: string`
- `code_type: string` these correlate to Open Stage Control addresses
- `code: number`
  - _TBD number ranges will change depending on code_type_, currently:
    - if `code_type = /control`, then `code: 0-127`
    - if `code_type = /note`, then `code: 0-127`
- `on: number` 0-127

![Additional Layers Information](./assets/Images/additional-layers-info.png)

### 5. Faders Information

- `id: T_{number}_FL_{number}` unique and not editable
- `name: string`
- `code_type: string` these correlate to Open Stage Control addresses
- `code: number`
  - _TBD number ranges will change depending on code_type_, currently:
    - if `code_type = /control`, then `code: 0-127`
    - if `code_type = /note`, then `code: 0-127`
- `default: number` 0-127
- `change_type: string`
  - _TBD actually employing this logic in the Open Stage Control custom module._ Current logic is the Value 2 logic but the options would be:
    - Value 1 = the DEFAULT value relates to the CODE itself (e.g. DEFAULT = CC11)
    - Value 2 = the DEFAULT value relates to the CODE's second Value (e.g. CODE = C#3, DEFAULT = Velocity 20)

![Faders Information](./assets/Images/faders-info.png)

### 6. Context Menu

#### - _Move a Sub-Item Up (coming soon)_

#### - _Move a Sub-Item Down (coming soon)_

#### - _Add Sub-Items Above Currently Selected Sub-Item (coming soon)_

#### - _Add Sub-Items Below Currently Selected Sub-Item (coming soon)_

#### - Add Sub-Items At End of Sub-Items List

To add a sub-item, right-click on a sub-item and follow the same procedure as above for tracks. The number input for adding sub-items is independent from the number input for adding tracks, and can also be adjusted in the settings.

![Sub-Item Context Menu](./assets/Images/sub-item-context-menu.png)

#### - _Duplicate Sub-Item Above Currently Selected Sub-Item (coming soon)_

#### - _Duplicate Sub-Item Below Currently Selected Sub-Item (coming soon)_

#### - _Duplicate Sub-Item At End of Sub-Item List (coming soon)_

#### - Copy Sub-Item Settings

#### - _Paste Sub-Item SetTings (coming soon)_

#### - _Clear a Sub-Item (coming soon)_

#### - Delete a Sub-Item

## 6. Editing Settings

![Template.io Settings](./assets/Images/template-io-settings.png)

## 7. Import/Export/Flush DB

Template.io imports and exports JSON files with this schema (TBD).

**_Importing a new track list will overwrite the database.sqlite file referenced above. Clicking "Flush DB / Clear All", and it will also clear the database.sqlite file, and will go back to the initial 1 track and the settings-defined default number of sub-items._**

![Template.io Import/Export/Flush DB](./assets/Images/template-io-import-export-flush.png)

# How To Use Template.io with Open Stage Control and Cubase

_Note: to my knowledge, this only works in real-time in Cubase._

## 1. Follow the Instructions Above to Download and Setup Template.io

## 2. Setup MIDI Ports

1. If on MAC, use your IAC driver to create 4 virtual MIDI ports named OSC1, OSC2, OSC3, and OSC4
2. If on PC, download [**loopMIDI**](https://www.tobias-erichsen.de/software/loopmidi.html) and create the same 4 virtual MIDI ports

   <!--![loopMIDI Setup](./assets/Images/loopMIDI.png)-->
   <img src="./assets/Images/loopMIDI.png" width="450">

## 3. Download the Custom Module and Generic Remote Files

These files are already setup in the repository:

1. template.io/assets/for-osc/template-io-workfile.json
2. template.io/assets/for-osc/template-io-custom-module.js
3. template.io/assets/for-cubase/template-io-generic-remote.xml
4. template.io/assets/for-cubase/template-io-empty-tracks.cpr

## 4. Setup Open Stage Control

Download and launch [**Open Stage Control**](https://github.com/jean-emmanuel/open-stage-control.git). Add the locations for the **template-io-workfile.json** and the **template-io-custom-module.js** files in the 'load' and 'custom-module' inputs, respectively.

Add the MIDI ports that we created above by pasting the following into the MIDI input:

```JS
OSC1:null,OSC1 OSC2:OSC2,OSC2 OSC3:OSC3,OSC3 OSC4:null,OSC4
```

```JS
//port1:input,output port2:input,output
```

The in/out configuration works like this:

| Open Stage Control |        | Cubase   | Cubase "In All MIDI" |
| ------------------ | ------ | -------- | -------------------- |
| **OSC1**           | **→**  | **OSC1** | No                   |
| **OSC2**           | **↔** | **OSC2** | No                   |
| **OSC3**           | **↔** | **OSC3** | Yes                  |
| **OSC4**           | **→**  | **OSC4** | Yes                  |

_Note: if you are already using Open Stage Control and have a your own ports, custom-module, workfile, etc. setup, I still recommend going through these steps to see how the system works._

_Also, if you use a touchscreen that is connect via USB (as opposed to a tablet using WIFI), I recommend that you add the following to the 'client-options' input:_

```
nofocus=1
```

![Open Stage Control Setup](./assets/Images/osc-launcher.png)

## 5. Setup Cubase

Now in Cubase, setup your MIDI ports to match the scheme above, create a new Generic Remote, and import **template-io-generic-remote.xml**. This tells Cubase to transmit Control Code 126 at Value 1 on Channel 1 on Port OSC3 every time a MIDI track is selected. Because of our custom-module, every time Open Stage Control receives this exact MIDI signal, it will send Control Code 127 at Value 127 on Channel 1 on Port OSC4 back to Cubase.

![Cubase Ports Setup](./assets/Images/cubase-port-setup.png)

![Generic Remote Setup](./assets/Images/template-io-generic-remote.png)

## 6. Build Your Template! (eventually...)

_Note: Unfortunately, for the time being, since there is no MIDI send feature on instrument tracks, audio tracks, or any other track other than MIDI tracks, your template will have to primarily use MIDI tracks routed to instrument tracks or a hosting companion such as Vienna Ensemble Pro._

Create empty MIDI tracks and start naming and routing them as you would normally, however, be sure to add a transformer on the MIDI sends for the track. This will receive the signal that Open Stage Control just sent (in response to the signal Cubase sent when the track was selected) and return a Polyphonic Key Pressure signal on port OSC3 that is completely unique to every track.

I know this seems like a hassle, so I took the liberty of setting up these transformers on over 300 empty MIDI tracks so you wouldn't have to! These tracks are available in the **template-io-empty-tracks.cpr** file and are all disabled for you to activate anytime you wish to add a new instrument. I recommend you import these into your template, or use the file to start a new one.

![transformer setup](./assets/Images/cubase-transformer.png)

## 7. Custom Module in Action

![custom module in action](./assets/Images/custom-module-in-action.gif)
