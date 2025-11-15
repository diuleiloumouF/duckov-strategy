import { ItemVariable } from '@/app/[locale]/archived/types';

export function parseVariable(variable: ItemVariable) {
    const { dataType, data } = variable;

    const dataStr = `${data}`

    // 判断数据格式
    let bytes: Uint8Array;

    // 如果是十六进制字符串（偶数长度，只包含0-9a-f）
    if (/^[0-9a-fA-F]+$/.test(dataStr) && dataStr.length % 2 === 0) {
        bytes = new Uint8Array(dataStr.length / 2);
        for (let i = 0; i < dataStr.length; i += 2) {
            bytes[i / 2] = parseInt(dataStr.substr(i, 2), 16);
        }
    } else {
        // base64 格式
        try {
            const binaryString = atob(data);
            bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            // eslint-disable-next-line
        } catch (_) {
            return `${data}`
        }
    }

    switch (dataType) {
        case 1: // Float
            return new Float32Array(bytes.buffer)[0];
        case 2: // Int32
            return new Int32Array(bytes.buffer)[0];
        case 3: // Boolean
            return bytes[0] === 1;
        case 4: // String
            // 将字节数组转换为字符串
            return new TextDecoder('utf-8').decode(bytes);
        default:
            return null;
    }
}
