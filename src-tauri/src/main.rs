// src-tauri/src/main.rs
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{AppHandle};
use tauri_plugin_shell::ShellExt;
use std::fs;
use std::path::Path;

#[tauri::command]
fn folder_exists(path: String) -> bool {
    Path::new(&path).exists()
}

#[tauri::command]
fn create_expediente_folder(path: String) -> Result<String, String> {
    match fs::create_dir_all(&path) {
        Ok(_) => Ok("Directorio creado".into()),
        Err(e) => Err(format!("Error: {}", e)),
    }
}

#[tauri::command]
async fn open_pau_folder(app: AppHandle, path: String) -> Result<(), String> {
    let shell = app.shell();
    shell.open(path, None).map_err(|e| e.to_string())?;
    Ok(())
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_fs::init())     // <--- CONEXIÓN FS
        .plugin(tauri_plugin_dialog::init()) // <--- CONEXIÓN DIALOG
        .invoke_handler(tauri::generate_handler![
            folder_exists,
            create_expediente_folder,
            on_import_data, // Si lo implementaste en App.jsx
            open_pau_folder
        ])
        .run(tauri::generate_context!())
        .expect("Error al iniciar AXIOM VAULT");
}

// Handler vacío para evitar errores de compilación si no se usa
#[tauri::command]
fn on_import_data() {}