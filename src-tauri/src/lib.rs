// src-tauri/src/lib.rs
use std::fs;
use std::path::{Path, PathBuf};
use std::process::Command;

#[tauri::command]
fn save_database(base_path: String, data_json: String) -> Result<String, String> {
    if base_path.is_empty() { return Err("Ruta no configurada".into()); }
    let mut path = PathBuf::from(&base_path);
    path.push("vault_master.json");
    fs::write(path, data_json).map_err(|e| e.to_string())?;
    Ok("Sincronización completada".into())
}

#[tauri::command]
fn load_database(base_path: String) -> Result<String, String> {
    let mut path = PathBuf::from(base_path);
    path.push("vault_master.json");
    if !path.exists() { return Err("Archivo no encontrado".into()); }
    let content = fs::read_to_string(path).map_err(|e| e.to_string())?;
    Ok(content)
}

#[tauri::command]
fn create_expediente_folders(base_path: String, numero_expediente: String, nombre_expediente: String) -> Result<String, String> {
    if base_path.is_empty() { return Err("Ruta base vacía".into()); }
    
    let mut path = PathBuf::from(&base_path);
    // Prefijo obligatorio: [Nº EXP] - [NOMBRE]
    let folder_name = format!("{} - {}", numero_expediente, nombre_expediente);
    let clean_name: String = folder_name.chars()
        .map(|c| if "/\\?%*:|\"<>".contains(c) { '-' } else { c })
        .collect();
    
    path.push(clean_name);

    let tecnico = path.join("TECNICO");
    let administrativo = path.join("ADMINISTRATIVO");

    // Forzamos creación recursiva
    fs::create_dir_all(&tecnico).map_err(|e| e.to_string())?;
    fs::create_dir_all(&administrativo).map_err(|e| e.to_string())?;

    Ok(format!("Directorios creados en: {:?}", path))
}

#[tauri::command]
fn open_vault_folder(folder_path: String) -> Result<(), String> {
    let path = Path::new(&folder_path);
    if !path.exists() { return Err("La carpeta todavía no existe en el servidor".into()); }

    #[cfg(target_os = "windows")]
    { Command::new("explorer").arg(folder_path).spawn().map_err(|e| e.to_string())?; }
    #[cfg(target_os = "macos")]
    { Command::new("open").arg(folder_path).spawn().map_err(|e| e.to_string())?; }
    
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            save_database, 
            load_database, 
            create_expediente_folders, 
            open_vault_folder
        ])
        .run(tauri::generate_context!())
        .expect("error running application");
}