import yaml from 'js-yaml'
import { XmlObject } from '../types/xml'

export function parseContent(text: string): Record<string, unknown> {
  if (!text) return {}
  if (text.trim().startsWith('<')) {
    const doc = new DOMParser().parseFromString(text, 'text/xml')
    const result = xmlToObj(doc.documentElement)
    return typeof result === 'string' ? { value: result } : result
  }
  const result = yaml.load(text)
  return result as Record<string, unknown>
}

function xmlToObj(node: Element): XmlObject | string {
  if (node.children.length === 0) {
    return node.textContent || ''
  }

  const obj: XmlObject = {}

  if (node.attributes.length) {
    obj['@attrs'] = {}
    for (const attr of Array.from(node.attributes)) {
      obj['@attrs'][attr.name] = attr.value
    }
  }

  const children = Array.from(node.children)
  children.forEach(child => {
    if (!obj[child.tagName]) {
      obj[child.tagName] = []
    }
    const childObj = xmlToObj(child)
    ;(obj[child.tagName] as XmlObject[]).push(childObj as XmlObject)
  })

  return obj
}
