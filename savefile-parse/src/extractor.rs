mod archived;

use serde::{Deserialize, Serialize};
use serde_json::Value;
use std::collections::HashMap;
use std::fs;
use std::ptr::write;
use crate::archived::fix_json_format;

// 基础类型包装器
#[derive(Debug, Deserialize, Serialize)]
struct TypedValue<T> {
    #[serde(rename = "__type")]
    type_name: String,
    value: T,
}

// 版本信息
#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
struct VersionData {
    main_version: i32,
    sub_version: i32,
    build_version: i32,
    suffix: String,
}

// 颜色数据
#[derive(Debug, Deserialize, Serialize)]
struct Color {
    r: f32,
    g: f32,
    b: f32,
    a: f32,
}

// 头部设置
#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
struct HeadSetting {
    main_color: Color,
    head_scale_offset: f32,
    forehead_height: f32,
    forehead_round: f32,
}

// 外观部件信息
#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
struct PartInfo {
    radius: f32,
    color: Color,
    height: f32,
    height_offset: f32,
    scale: f32,
    twist: f32,
    distance_angle: f32,
    left_right_angle: f32,
}

// 自定义外观数据
#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
struct CustomFaceSettingData {
    saved_setting: bool,
    head_setting: HeadSetting,
    hair_id: i32,
    hair_info: PartInfo,
    eye_id: i32,
    eye_info: PartInfo,
    eyebrow_id: i32,
    eyebrow_info: PartInfo,
    mouth_id: i32,
    mouth_info: PartInfo,
    tail_id: i32,
    tail_info: PartInfo,
    foot_id: i32,
    foot_info: PartInfo,
    wing_id: i32,
    wing_info: PartInfo,
}

// 物品变量
#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
struct ItemVariable {
    key: String,
    data_type: i32,
    data: String, // Base64编码的数据
    display: bool,
}

// 槽位内容
#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
struct SlotContent {
    slot: String,
    instance_id: i32,
}

// 背包位置
#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
struct InventoryItem {
    position: i32,
    instance_id: i32,
}

// 物品条目
#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
struct ItemEntry {
    instance_id: i32,
    type_id: i32,
    variables: Vec<ItemVariable>,
    slot_contents: Vec<SlotContent>,
    inventory: Vec<InventoryItem>,
    inventory_sort_locks: Vec<Value>,
}

// 物品树数据
#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
struct ItemTreeData {
    root_instance_id: i32,
    entries: Vec<ItemEntry>,
}

// 商店库存
#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
struct StockItem {
    item_type_id: i32,
    stock: i32,
}

// 商店数据
#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
struct StockShopData {
    last_time_refreshed_stock: i64,
    stock_counts: Vec<StockItem>,
}

// 主存档结构
#[derive(Debug, Deserialize, Serialize)]
struct SaveData {
    #[serde(flatten)]
    data: HashMap<String, Value>,
}

impl SaveData {
    // 解析存档文件
    pub fn from_json(json_str: &str) -> Result<Self, serde_json::Error> {
        serde_json::from_str(json_str)
    }

    // 获取游戏版本
    pub fn get_version(&self) -> Option<VersionData> {
        self.data
            .get("CreatedWithVersion")
            .and_then(|v| serde_json::from_value::<TypedValue<VersionData>>(v.clone()).ok())
            .map(|t| t.value)
    }

    // 获取自定义外观
    pub fn get_custom_face(&self) -> Option<CustomFaceSettingData> {
        self.data
            .get("CustomFace_MainCharacter")
            .and_then(|v| serde_json::from_value::<TypedValue<CustomFaceSettingData>>(v.clone()).ok())
            .map(|t| t.value)
    }

    // 获取物品数据
    pub fn get_item_tree(&self) -> Option<ItemTreeData> {
        self.data
            .get("Item/MainCharacterItemData")
            .and_then(|v| serde_json::from_value::<TypedValue<ItemTreeData>>(v.clone()).ok())
            .map(|t| t.value)
    }

    // 获取击杀统计
    pub fn get_kill_stats(&self) -> HashMap<String, i32> {
        let mut stats = HashMap::new();
        for (key, value) in &self.data {
            if key.starts_with("Count/Kills/") {
                if let Ok(typed_value) = serde_json::from_value::<TypedValue<i32>>(value.clone()) {
                    let enemy_name = key.strip_prefix("Count/Kills/").unwrap_or(key);
                    stats.insert(enemy_name.to_string(), typed_value.value);
                }
            }
        }
        stats
    }

    // 获取已访问的场景
    pub fn get_visited_scenes(&self) -> Vec<String> {
        let mut scenes = Vec::new();
        for (key, value) in &self.data {
            if key.starts_with("MultiSceneCore_Visited_") {
                if let Ok(typed_value) = serde_json::from_value::<TypedValue<bool>>(value.clone()) {
                    if typed_value.value {
                        let scene_name = key.strip_prefix("MultiSceneCore_Visited_").unwrap_or(key);
                        scenes.push(scene_name.to_string());
                    }
                }
            }
        }
        scenes
    }

    // 获取货币
    pub fn get_currency(&self) -> Option<i32> {
        self.data
            .get("Currency/Money")
            .and_then(|v| serde_json::from_value::<TypedValue<i32>>(v.clone()).ok())
            .map(|t| t.value)
    }

    // 获取建造站点状态
    pub fn get_construction_sites(&self) -> HashMap<String, bool> {
        let mut sites = HashMap::new();
        for (key, value) in &self.data {
            if key.starts_with("ConstructionSite_") {
                if let Ok(typed_value) = serde_json::from_value::<TypedValue<bool>>(value.clone()) {
                    let site_name = key.strip_prefix("ConstructionSite_").unwrap_or(key);
                    sites.insert(site_name.to_string(), typed_value.value);
                }
            }
        }
        sites
    }

    // 修改货币
    pub fn set_currency(&mut self, amount: i32) {
        let currency_value = serde_json::json!({
            "__type": "int",
            "value": amount
        });
        self.data.insert("Currency/Money".to_string(), currency_value);
    }

    // 导出为JSON
    pub fn to_json(&self) -> Result<String, serde_json::Error> {
        serde_json::to_string_pretty(&self.data)
    }
}

fn main() {
    let args: Vec<String> = std::env::args().collect();

    if args.len() < 2 {
        eprintln!("用法: {} <存档文件路径> [命令]", args[0]);
        eprintln!("\n命令:");
        eprintln!("  info          - 显示基本信息");
        eprintln!("  kills         - 显示击杀统计");
        eprintln!("  scenes        - 显示已访问场景");
        eprintln!("  items         - 显示物品信息");
        eprintln!("  face          - 显示角色外观");
        eprintln!("  currency      - 显示货币");
        eprintln!("  construction  - 显示建造站点状态");
        eprintln!("  export <file> - 导出为JSON");
        std::process::exit(1);
    }

    let save_path = &args[1];
    let command = args.get(2).map(|s| s.as_str()).unwrap_or("info");

    // 读取存档
    let json_content = std::fs::read_to_string(save_path)
        .expect("无法读取存档文件");

    // println!("{}", json_content);

    fs::write("./save.json", &fix_json_format(&json_content));

    let save_data = SaveData::from_json(&fix_json_format(&json_content))
        .expect("无法解析存档文件");

    match command {
        "info" => {
            println!("=== 游戏存档信息 ===\n");
            if let Some(version) = save_data.get_version() {
                println!("游戏版本: {}.{}.{}{}",
                         version.main_version,
                         version.sub_version,
                         version.build_version,
                         version.suffix
                );
            }
            if let Some(currency) = save_data.get_currency() {
                println!("货币: {}", currency);
            }
            let scenes = save_data.get_visited_scenes();
            println!("已访问场景数: {}", scenes.len());

            let kill_stats = save_data.get_kill_stats();
            let total_kills: i32 = kill_stats.values().sum();
            println!("总击杀数: {}", total_kills);
        }

        "kills" => {
            println!("=== 击杀统计 ===\n");
            let mut stats: Vec<_> = save_data.get_kill_stats().into_iter().collect();
            stats.sort_by(|a, b| b.1.cmp(&a.1));
            for (enemy, count) in stats {
                println!("{}: {}", enemy, count);
            }
        }

        "scenes" => {
            println!("=== 已访问场景 ===\n");
            let scenes = save_data.get_visited_scenes();
            for scene in scenes {
                println!("- {}", scene);
            }
        }

        "items" => {
            println!("=== 物品信息 ===\n");
            if let Some(item_tree) = save_data.get_item_tree() {
                println!("根物品ID: {}", item_tree.root_instance_id);
                println!("物品条目数: {}", item_tree.entries.len());
                println!("\n物品列表:");
                for entry in &item_tree.entries {
                    println!("\n物品 #{} (类型: {})", entry.instance_id, entry.type_id);
                    for var in &entry.variables {
                        println!("  - {}: {} (类型: {})", var.key, var.data, var.data_type);
                    }
                }
            }
        }

        "face" => {
            println!("=== 角色外观 ===\n");
            if let Some(face) = save_data.get_custom_face() {
                println!("头部颜色: RGB({:.2}, {:.2}, {:.2})",
                         face.head_setting.main_color.r,
                         face.head_setting.main_color.g,
                         face.head_setting.main_color.b
                );
                println!("发型ID: {}", face.hair_id);
                println!("眼睛ID: {}", face.eye_id);
                println!("眉毛ID: {}", face.eyebrow_id);
                println!("嘴巴ID: {}", face.mouth_id);
                println!("尾巴ID: {}", face.tail_id);
                println!("脚ID: {}", face.foot_id);
                println!("翅膀ID: {}", face.wing_id);
            }
        }

        "currency" => {
            if let Some(currency) = save_data.get_currency() {
                println!("当前货币: {}", currency);
            } else {
                println!("未找到货币信息");
            }
        }

        "construction" => {
            println!("=== 建造站点状态 ===\n");
            let sites = save_data.get_construction_sites();
            for (site, built) in sites {
                println!("{}: {}", site, if built { "已建造" } else { "未建造" });
            }
        }

        "export" => {
            if args.len() < 4 {
                eprintln!("请指定导出文件路径");
                std::process::exit(1);
            }
            let output_path = &args[3];
            let json = save_data.to_json().expect("无法序列化存档");
            std::fs::write(output_path, json).expect("无法写入文件");
            println!("已导出到: {}", output_path);
        }

        _ => {
            eprintln!("未知命令: {}", command);
            std::process::exit(1);
        }
    }
}