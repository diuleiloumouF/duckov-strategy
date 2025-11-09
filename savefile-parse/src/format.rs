use regex::Regex;

/// 修复Unity存档中的JSON格式错误
pub fn fix_json_format(content: &str) -> String {
    let mut result = content.to_string();

    // 修复 "__type" : "bool"false 格式
    let bool_re = Regex::new(r#""__type"\s*:\s*"bool"(true|false)"#).unwrap();
    result = bool_re.replace_all(&result, r#""__type": "bool", "value": $1"#).to_string();

    // 修复 "__type" : "int"数字 格式（包括负数）
    let int_re = Regex::new(r#""__type"\s*:\s*"int"(-?\d+)"#).unwrap();
    result = int_re.replace_all(&result, r#""__type": "int", "value": $1"#).to_string();

    // 修复 "__type" : "float"数字 格式
    let float_re = Regex::new(r#""__type"\s*:\s*"float"([\d.]+)"#).unwrap();
    result = float_re.replace_all(&result, r#""__type": "float", "value": $1"#).to_string();

    result
}