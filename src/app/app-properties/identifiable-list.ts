import { Guid } from "../types/guid";

export class IdentifiableList<Element extends { id: Guid }> implements Iterable<Element> {

  private keyedValues: Record<string, Element>;

  public constructor(keyedValues: Record<string, Element>) {
    this.keyedValues = keyedValues;
  }

  public get(key: Guid): Element | null {
    if (key.guidString in this.keyedValues)
      return this.keyedValues[key.guidString];
    return null;
  }

  public set(key: Guid, value: Element) {
    this.keyedValues[key.guidString] = value;
  }

  public remove(key: Guid) {
    if (key.guidString in this.keyedValues)
      delete this.keyedValues[key.guidString];
  }

  public [Symbol.iterator](): IdentifiableListIterator<Element> {
    return new IdentifiableListIterator(this.keyedValues);
  }

  public filter(predicate: (value: Element, index: number, array: Element[]) => value is Element, thisArg?: any): IdentifiableList<Element> {
    const keyedValues: Record<string, Element> = {};
    for (const entry of Object.entries(this.keyedValues).filter((value, index, array) => predicate(value[1], index, array.map(entry => entry[1])), thisArg))
      keyedValues[entry[0]] = entry[1];
    return new IdentifiableList(keyedValues);
  }
  public map<T>(callbackfn: (value: Element, index: number, array: Element[]) => T, thisArg?: any): T[] {
    return Object.values(this.keyedValues).map(callbackfn, thisArg);
  }
}

export class IdentifiableListIterator<Element> implements Iterator<Element> {

  private iterator: Iterator<Element>;

  public constructor(keyedValues: Record<string, Element>) {
    this.iterator = Object.values(keyedValues)[Symbol.iterator]();
  }

  public next(): IteratorResult<Element> {
    return this.iterator.next();
  }
}
