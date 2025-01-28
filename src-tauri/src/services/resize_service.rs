// credit -> https://github.com/dolev146 in https://github.com/tauri-apps/tauri/issues/6394#issuecomment-2353218042

use tauri::{ App, Manager, PhysicalPosition, PhysicalSize };

pub fn init(app: &App) -> tauri::Result<()> {
  // Get available monitors
  let win = app.get_webview_window("main").unwrap();
  let available_monitors = win
    .available_monitors()
    .expect("Failed to get monitors");

  if available_monitors.len() > 1 {
    // compare the x of each monitor with the maxX and
    // if the new X is bigger than the current maxX then replace it and modify the destination monitor id
    let mut destination_monitor_id = 0;
    let mut max_x = available_monitors[destination_monitor_id].position().x;
    for (index, monitor) in available_monitors.iter().enumerate() {
      if monitor.position().x > max_x {
        max_x = monitor.position().x;
        destination_monitor_id = index;
      }
    }

    let monitor = &available_monitors[destination_monitor_id];
    let monitor_position = monitor.position();
    let monitor_size = monitor.size();

    // Move window to the selected monitor
    win
      .set_position(
        PhysicalPosition::new(monitor_position.x - 5, monitor_position.y + 5)
      )
      .expect("Failed to move window");

    // Optionally resize the window to fit the new monitor
    win
      //.set_size(PhysicalSize::new(monitor_size.width, monitor_size.height)).expect("Failed to resize window");
      .set_size(PhysicalSize::new(1400, monitor_size.height - 40))
      .expect("Failed to resize window");
    //win.maximize().expect("Failed to maximize window");
  } else {
    eprintln!("Monitor 2 not found!");
  }

  // Show the window after positioning
  win.show().expect("Failed to show window");

    Ok(())
}
