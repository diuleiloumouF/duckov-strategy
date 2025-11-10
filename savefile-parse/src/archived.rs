use std::collections::HashMap;
use log::info;
use serde::{Deserialize, Serialize};
use serde_json::Value;


#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct QuestSaveData {
    #[serde(rename = "__type")]
    pub type_name: String,
    pub id: u32,
    pub complete: bool,
    #[serde(rename = "needInspection")]
    pub need_inspection: bool,
    #[serde(rename = "questGiverID")]
    pub quest_giver_id: u32,
    // #[serde(rename = "taskStatus")]
    // pub task_status: Vec<TaskStatusEntry>,
    // #[serde(rename = "rewardStatus")]
    // pub reward_status: Vec<RewardStatusEntry>,
}

#[derive(Debug, Deserialize, Serialize, Clone, Default)]
pub struct GameClock {
    pub days: i32,
    #[serde(rename = "realTimePlayedTicks")]
    pub seconds_of_day: i64,
    #[serde(rename = "secondsOfDay")]
    pub real_time_played_ticks: f64,
}

#[derive(Debug, Deserialize, Serialize, Clone, Default)]
pub struct QuestData {
    #[serde(rename = "activeQuestsData")]
    pub active_quests: Vec<QuestSaveData>,
    #[serde(rename = "historyQuestsData")]
    pub history_quests: Vec<QuestSaveData>,
    #[serde(rename = "everInspectedQuest")]
    pub ever_inspected: Vec<i32>,
}

#[derive(Debug, Deserialize, Serialize, Clone, Default)]
pub struct EconomyData {
    pub money: i32,
    #[serde(rename = "unlockedItems")]
    pub unlocked_items: Vec<i32>,
    #[serde(rename = "unlockesWaitingForConfirm")]
    pub unlockes_waiting_for_confirm: Vec<i32>,
}

#[derive(Debug, Deserialize, Serialize, Clone, Default)]
pub struct MasterKey{
    pub id: i32,
    pub active: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct StashData {
    pub valid: bool,
    #[serde(rename = "raidID")]
    pub raid_id: i32,
    #[serde(rename = "subSceneID")]
    pub sub_scene_id: String,
    pub world_position: WorldPosition,
    pub item_tree_data: ItemTreeData,
    pub spawned: bool,
    pub touched: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WorldPosition {
    pub x: f32,
    pub y: f32,
    pub z: f32,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ItemTreeData {
    #[serde(rename = "rootInstanceID")]
    pub root_instance_id: i32,
    pub entries: Vec<ItemEntry>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ItemEntry {
    #[serde(rename = "instanceID")]
    pub instance_id: i32,
    #[serde(rename = "typeID")]
    pub type_id: i32,
    pub variables: Vec<ItemVariable>,
    pub slot_contents: Vec<SlotContent>,
    pub inventory: Vec<InventoryItem>,
    pub inventory_sort_locks: Vec<serde_json::Value>, // 空数组，类型待定
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ItemVariable {
    pub key: String,
    pub data_type: i32,
    pub data: String, // Base64编码的数据
    pub display: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SlotContent {
    pub slot: String,
    #[serde(rename = "instanceID")]
    pub instance_id: i32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct InventoryItem {
    pub position: i32,
    #[serde(rename = "instanceID")]
    pub instance_id: i32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct InventoryItemData {
    pub inventory_position: i32,
    pub item_tree_data: ItemTreeData,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Inventory{
    pub capacity : i32,
    pub entries: Vec<InventoryItemData>,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
struct Kill {
    #[serde(rename = "masterName")]
    monster_name: String,
    count: i64,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
pub struct Archive{
    pub version: String,// 版本号
    pub level: i32,
    pub exp: i32,
    pub health: f32,
    #[serde(rename = "gameClock")]
    pub game_lock: GameClock,
    #[serde(rename = "economyData")]
    pub economy_data: EconomyData,
    #[serde(rename = "masterKeys")]
    pub master_key: Vec<MasterKey>,
    #[serde(rename = "deathList")]
    pub death_list: Vec<StashData>,// 死亡列表？
    pub quests: QuestData,
    pub inventory: Vec<i16>,
    pub kills: Vec<Kill>, // 击杀
    pub save_time: i32,// 保存时间
    #[serde(rename = "playerStorage")]
    pub player_storage: Inventory,// 仓库
    #[serde(rename = "inventorySafe")]
    pub inventory_safe: Inventory, // 背包
    #[serde(rename = "characterItemData")]
    pub character_item_data: ItemTreeData, // Item/MainCharacterItemData
    // 获取技能等级解锁/GameObject/LevelManager/_boundGraphSerialization
}

impl Archive {
    pub fn extract_kill_counts(&mut self, data: &HashMap<String, Value>) {
        let kills = data.iter()
            .filter(|(key, _)| key.starts_with("Count/Kills/"))
            .filter_map(|(key, value)| {
                // 提取敌人类型名称 (例如: "Count/Kills/Cname_Prison" -> "Cname_Prison")
                let enemy_type = key.strip_prefix("Count/Kills/")?;
                // 获取 count 值
                let count = value.get("value")?.as_i64()?;
                Some(Kill {
                    monster_name: enemy_type.to_string(),
                    count,
                })
            })
            .collect();

        self.kills = kills;
    }
}

