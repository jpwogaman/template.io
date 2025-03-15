# Template.io 

<img src="./src-tauri/icons/icon.png" width="150">

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/jpwogaman/template.io/blob/main/LICENSE) 

# Disclaimer: 

*This app is not complete and there are no binaries available yet. I am currently working on the app and will release binaries as soon as I can.*

# Table of Contents
1. [How To Use Template.io Standalone](#how-to-use-templateio-standalone)
    1. [Install Template.io](#1-install-templateio)
        1. [Option A. Download the Binary (coming soon)](#option-a-download-the-binary-coming-soon)
        2. [Option B. Build Template.io from Source](#option-b-build-templateio-from-source)
    2. [Setup Template.io](#2-setup-templateio)
    3. [Add Your Tracks](#3-add-your-tracks)
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
1. Download the binary for your system from the releases page (coming soon).

### Option B. Build Template.io from Source
1) [**Tauri Prerequisites**](https://v2.tauri.app/start/prerequisites/) - this includes downloading Rust, as well as configuring your PATH. 

2)  ```
    git clone https://github.com/jpwogaman/template.io.git
    ```
3)  ```
    cd template.io
    ```
4)  ```
    pnpm tauri build
    ```

The binary should be automatically built relative to the repository:

***C:\PATH\TO\template.io\src-tauri\target\release\template.io.exe***

## 2. Launch Template.io

1. Navigate to where you downloaded Template.io, or to where you built it from source, and launch the app.
2. Upon startup, Template.io will generate a new directory relative to your systems' home directory (*on Windows, this will be C:\Users\USERNAME\template.io*) containing two files:
    1. settings.json
    2. database.sqlite
3. Do not move or delete these files while Template.io is running, as this will cause the app to crash. If you do, simply restart the app and it will generate new files. However, if you do delete these files, you will lose all of your data.

![Application Folder](./assets/Images/application-folder.png)

## 3. Add Your Tracks

TBD




# How To Use Template.io with Open Stage Control and Cubase

*Note: to my knowledge, this only works in real-time in Cubase.*

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

| Open Stage Control |       | Cubase        | Cubase "In All MIDI" |
| ------------------ | ----- | ------------- | -------------------- |
| **OSC1**           | **→** | **OSC1**      | No                   |
| **OSC2**           | **↔** | **OSC2**      | No                   |
| **OSC3**           | **↔** | **OSC3**      | Yes                  |
| **OSC4**           | **→** | **OSC4**      | Yes                  |


*Note: if you are already using Open Stage Control and have a your own ports, custom-module, workfile, etc. setup, I still recommend going through these steps to see how the system works.*

*Also, if you use a touchscreen that is connect via USB (as opposed to a tablet using WIFI), I recommend that you add the following to the 'client-options' input:*
```
nofocus=1
```
![Open Stage Control Setup](./assets/Images/osc-launcher.png)

## 5. Setup Cubase

Now in Cubase, setup your MIDI ports to match the scheme above, create a new Generic Remote, and import **template-io-generic-remote.xml**. This tells Cubase to transmit Control Code 126 at Value 1 on Channel 1 on Port OSC3 every time a MIDI track is selected. Because of our custom-module, every time Open Stage Control receives this exact MIDI signal, it will send Control Code 127 at Value 127 on Channel 1 on Port OSC4 back to Cubase. 

![Cubase Ports Setup](./assets/Images/cubase-port-setup.png)

![Generic Remote Setup](./assets/Images/template-io-generic-remote.png)

## 6. Build Your Template! (eventually...)

*Note: Unfortunately, for the time being, since there is no MIDI send feature on instrument tracks, audio tracks, or any other track other than MIDI tracks, your template will have to primarily use MIDI tracks routed to instrument tracks or a hosting companion such as Vienna Ensemble Pro.*

Create empty MIDI tracks and start naming and routing them as you would normally, however, be sure to add a transformer on the MIDI sends for the track. This will receive the signal that Open Stage Control just sent (in response to the signal Cubase sent when the track was selected) and return a Polyphonic Key Pressure signal on port OSC3 that is completely unique to every track. 

I know this seems like a hassle, so I took the liberty of setting up these transformers on over 300 empty MIDI tracks so you wouldn't have to! These tracks are available in the **template-io-empty-tracks.cpr** file and are all disabled for you to activate anytime you wish to add a new instrument. I recommend you import these into your template, or use the file to start a new one. 

![transformer setup](./assets/Images/cubase-transformer.png)

## 7. Custom Module in Action
![custom module in action](./assets/Images/custom-module-in-action.gif)