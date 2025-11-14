export interface Item {
    id: number;
    name: string;
    //2: 🟦 藍色
    //3: 🟪 紫色 - 中上選擇
    //4: 🟧 金色 - 稀有價值
    //5: 🟥 紅色 - 超高價值
    quality: number;
    displayName: string;
    description: string;
    maxStackCount: number;
    icon: string;
    priceEach: string;
    tags: string[];
}

// export interface ItemPrefab {
//     id: number;
//     // name: string;
//     //2: 🟦 藍色
//     //3: 🟪 紫色 - 中上選擇
//     //4: 🟧 金色 - 稀有價值
//     //5: 🟥 紅色 - 超高價值
//     quality: number;
//     displayName: string;
//     // description: string;
//     maxStackCount: number;
//     icon: string;
//     weight: number;
//     value: string;
//     tags: string[];
// }

export type KeyValue = {
    [key: string]: string;
};

export type UnityReference = {
    fileID: number;
    guid: string;
    type: number;
}

interface ConstantCollection {
    entries: Constant[];
}

interface Constant {
    key: string;
    dataType: number;
    data: string; // 或者根据dataType解析为具体类型
    // display?: number;
}

interface BaseItemMonoBehaviour {
    typeID: number;
    // order?: number;
    // displayName?: string;
    maxStackCount: number;
    value: number;
    quality: number;
    // display_quality?: number;
    weight: number;
    tags: string[];
    icon: string;
    displayName: string;
    // agent_utilities?: AgentUtilities;
    // item_graphic?: FileID;
    // stats?: FileID;
    // slots?: FileID;
    // modifiers?: FileID;
    // variables?: VariableCollection;
    constants: ConstantCollection;
    // inventory?: FileID;
    // effects?: Effect[];
    // usage_utilities?: FileID;
    // sound_key?: string;
}

interface SlotItem {
    key: string;
    // display?: number;
    // baseValue?: number;
}

export interface AttributeItem {
    key: string;
    display?: number;
    baseValue?: number;
}

interface ItemSlotsMonoBehaviour {
    m_Name?: string;
    list: SlotItem[];
}
interface ItemSlotsMonoBehaviour {
    m_Name?: string;
    list: SlotItem[];
}

export interface ItemAttributeMonoBehaviour {
    m_Name?: string;
    list: AttributeItem[];
}

export interface PrefabItem {
    base?: BaseItemMonoBehaviour;
    slots?: ItemSlotsMonoBehaviour;
    attributes?: ItemAttributeMonoBehaviour;
}