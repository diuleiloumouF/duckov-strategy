use serde::{Deserialize, Serialize};
use serde_json::Value;
use std::collections::HashMap;
use std::fs;
use std::ptr::write;
use log::info;
use crate::archived::{EconomyData, Inventory, MasterKey, GameClock, QuestData, StashData, ItemTreeData};
use crate::format::fix_json_format;

// 基础类型包装器
#[derive(Debug, Deserialize, Serialize)]
struct TypedValue<T> {
    #[serde(rename = "__type")]
    type_name: String,
    value: T,
}

pub type MasterKeyData = Vec<MasterKey>;

// 版本信息
#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct VersionData {
    pub main_version: i32,
    pub sub_version: i32,
    pub build_version: i32,
    pub suffix: String,
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
// #[derive(Debug, Deserialize, Serialize)]
// #[serde(rename_all = "camelCase")]
// struct ItemTreeData {
//     root_instance_id: i32,
//     entries: Vec<ItemEntry>,
// }

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
pub struct SaveData {
    #[serde(flatten)]
    pub data: HashMap<String, Value>,
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
    
    pub fn get_master_keys(&self) -> Option<Vec<MasterKey>> {
        self.data
            .get("MasterKeys")
            .and_then(|v| serde_json::from_value::<TypedValue<Vec<MasterKey>>>(v.clone()).ok())
            .map(|t| t.value)
    }
    pub fn get_death_list(&self) -> Option<Vec<StashData>> {
        self.data
            .get("DeathList")
            .and_then(|v| serde_json::from_value::<TypedValue<Vec<StashData>>>(v.clone()).ok())
            .map(|t| t.value)
    }
    pub fn get_save_time(&self) -> Option<i32> {
        self.data
            .get("SaveTime")
            .and_then(|v| serde_json::from_value::<TypedValue<i32>>(v.clone()).ok())
            .map(|t| t.value)
    }
    
    pub fn get_player_storage(&self) -> Option<Inventory> {
        self.data
            .get("Inventory/PlayerStorage")
            .and_then(|v| serde_json::from_value::<TypedValue<Inventory>>(v.clone()).ok())
            .map(|t| t.value)
    }
    pub fn get_inventory_safe(&self) -> Option<Inventory> {
        self.data
            .get("Inventory/Inventory_Safe")
            .and_then(|v| serde_json::from_value::<TypedValue<Inventory>>(v.clone()).ok())
            .map(|t| t.value)
    }
    
    pub fn get_game_lock(&self) -> Option<GameClock> {
        self.data
            .get("GameClock")
            .and_then(|v| serde_json::from_value::<TypedValue<GameClock>>(v.clone()).ok())
            .map(|t| t.value)
    }
    pub fn get_health(&self) -> Option<f32> {
        self.data
            .get("MainCharacterHealth")
            .and_then(|v| serde_json::from_value::<TypedValue<f32>>(v.clone()).ok())
            .map(|t| t.value)
    }
    
    pub fn get_character_items(&self) -> Option<ItemTreeData> {
        self.data
            .get("Item/MainCharacterItemData")
            .and_then(|v| serde_json::from_value::<TypedValue<ItemTreeData>>(v.clone()).ok())
            .map(|t| t.value)
    }
    
    // 获取自定义外观
    pub fn get_custom_face(&self) -> Option<CustomFaceSettingData> {
        self.data
            .get("CustomFace_MainCharacter")
            .and_then(|v| serde_json::from_value::<TypedValue<CustomFaceSettingData>>(v.clone()).ok())
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
    pub fn get_currency(&self) -> Option<EconomyData> {
        self.data
            .get("EconomyData")
            .and_then(|v| serde_json::from_value::<TypedValue<EconomyData>>(v.clone()).ok())
            .map(|t| t.value)
    }
    
    // 获取任务
    pub fn get_quests(&self) -> Option<QuestData> {
        self.data
            .get("QuestData")
            .and_then(|v| serde_json::from_value::<TypedValue<QuestData>>(v.clone()).ok())
            .map(|t| t.value)
    }
    
    // 获取经验
    pub fn get_exp(&self) -> Option<i32> {
        self.data
            .get("EXP_Value")
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

    // 导出为JSON
    pub fn to_json(&self) -> Result<String, serde_json::Error> {
        serde_json::to_string_pretty(&self.data)
    }
}