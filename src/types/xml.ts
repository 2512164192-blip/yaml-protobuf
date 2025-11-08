export interface XmlAttributes {
  [key: string]: string;
}

export interface XmlObject {
  '@attrs'?: XmlAttributes;
  [key: string]: XmlObject[] | XmlAttributes | string | undefined;
}
