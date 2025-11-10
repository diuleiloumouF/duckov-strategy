
export interface QuestSaveData {
  __type: string;
  id: number;
  complete: boolean;
  needInspection: boolean;
  questGiverID: number;
  // taskStatus: TaskStatusEntry[];
  // rewardStatus: RewardStatusEntry[];
}

export interface QuestData {
  activeQuestsData: QuestSaveData[]
  historyQuestsData: QuestSaveData[]
  everInspectedData: number[]
}

export interface MasterKey {
  id: number
  active: boolean
}

export interface WorldPosition {
  x: number
  y: number
  z: number
}

export interface ItemVariable {
  key: string
  dataType: number
  data: string
  display: boolean
}

export interface SlotContent {
  slot: string
  instanceID: number
}

export interface InventoryItem {
  position: number
  instanceID: number
}

export interface ItemEntry {
  instanceID: number
  typeID: number
  variables: ItemVariable[]
  slotContents: SlotContent[]
  inventory: InventoryItem[]
  // inventorySortLocks: any[]
}

export interface ItemTreeData {
  rootInstanceID: number
  entries: ItemEntry[]
}

export interface StashData {
  valid: boolean
  raidID: number
  subSceneID: string
  worldPosition: WorldPosition
  itemTreeData: ItemTreeData
  spawned: boolean
  touched: boolean
}

export interface InventoryItemData {
  inventoryPosition: number
  itemTreeData: ItemTreeData
}

export interface Inventory {
  capacity: number
  entries: InventoryItemData[]
}

export interface Kill {
  masterName: string
  count: number
}

export interface EconomyData {
  money: number,
  unlockedItems: number[],
  unlockesWaitingForConfirm: number[],
}

export interface GameLock {
  days: number;
}

export interface Archive {
  version: string
  level: number
  exp: number
  health: number
  gameClock: GameLock
  economyData: EconomyData
  masterKeys: MasterKey[]
  deathList: StashData[]
  quests: QuestData
  inventory: number[]
  kills: Kill[]
  save_time: number
  playerStorage: Inventory
  inventorySafe: Inventory
  characterItemData: ItemTreeData
}