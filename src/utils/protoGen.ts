import { Template } from './storage'
import yaml from 'js-yaml'

// 定义 YAML 解析后的数据类型
interface YamlData {
  [key: string]: YamlValue
}

type YamlValue = 
  | string 
  | number 
  | boolean 
  | YamlData
  | null
  | undefined

export function generateProto(tpl: Template | null): string {
  if (!tpl || !tpl.content) return ''
  try {
    const yamlContent = yaml.load(tpl.content) as YamlData
    return generateProtoFromYaml(yamlContent)
  } catch (err) {
    console.error('Failed to parse YAML:', err)
    return '// Error: Invalid YAML content'
  }
}

function generateProtoFromYaml(data: YamlData): string {
  let output = 'syntax = "proto3";\n\n'

  // 处理顶层对象
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'object' && value !== null) {
      const message = processMessage(key, value as YamlData, 0)
      output += message + '\n'
    }
  }

  return output
}

function processMessage(name: string, data: YamlData, depth = 0): string {
  const indent = '  '.repeat(depth)
  let output = `${indent}message ${capitalize(sanitize(name))} {\n`
  let fieldIndex = 1
  const nestedMessages: string[] = []

  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'object' && value !== null) {
      // 收集嵌套消息定义
      const nestedMessage = processMessage(key, value as YamlData, depth + 1)
      nestedMessages.push(nestedMessage)
      // 添加字段引用
      output += `${indent}  ${capitalize(sanitize(key))} ${sanitize(key)} = ${fieldIndex++};\n`
    } else {
      // 基本类型字段
      const type = getProtoType(value)
      output += `${indent}  ${type} ${sanitize(key)} = ${fieldIndex++};\n`
    }
  }

  // 在message结束前添加嵌套消息定义
  if (nestedMessages.length > 0) {
    output += '\n'
    for (const nestedMsg of nestedMessages) {
      output += nestedMsg + '\n'
    }
  }

  output += `${indent}}\n`
  return output
}

function getProtoType(value: YamlValue): string {
  if (typeof value === 'string') {
    if (value.match(/^\d{4}-\d{2}-\d{2}.*$/)) return 'google.protobuf.Timestamp'
    return 'string'
  }
  if (typeof value === 'number') {
    if (Number.isInteger(value)) return 'int32'
    return 'double'
  }
  if (typeof value === 'boolean') return 'bool'
  if (value === null || value === undefined) return 'string' // 处理空值
  return 'string' // 默认类型
}

function sanitize(n: string): string {
  return n.replace(/[^a-zA-Z0-9_]/g, '_')
}

function capitalize(str: string): string {
  if (!str) return str
  return str.charAt(0).toUpperCase() + str.slice(1)
}
