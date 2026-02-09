// AXIOM VAULT - NÚCLEO NATIVO v7.1
use std::process::Command;
use std::path::Path;
use std::fs;

#[tauri::command]
fn folder_exists(path: String) -> bool {
    Path::new(&path).exists() && Path::new(&path).is_dir()
}

#[tauri::command]
fn create_expediente_folder(base_path: String, folder_name: String) -> Result<String, String> {
    let path = Path::new(&base_path).join(&folder_name);
    if path.exists() {
        return Ok("Carpeta ya existente".into());
    }
    match fs::create_dir_all(&path) {
        Ok(_) => Ok(format!("Carpeta creada")),
        Err(e) => Err(format!("Error: {}", e)),
    }
}

#[tauri::command]
fn open_pau_folder(path: String) -> Result<(), String> {
    if !Path::new(&path).exists() { return Err("Ruta no existe".into()); }
    #[cfg(target_os = "macos")] { Command::new("open").arg(&path).spawn().map_err(|e| e.to_string())?; }
    #[cfg(target_os = "windows")] { Command::new("explorer").arg(&path).spawn().map_err(|e| e.to_string())?; }
    Ok(())
}

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![open_pau_folder, folder_exists, create_expediente_folder])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}