export interface MatrixHeader extends Array<HeaderLayer> {}
export interface HeaderLayer extends Array<HeaderElement> {}

export type HeaderElement = string | HeaderObject | HeaderWholeObject;
export interface HeaderObject {
    vals: string[];
}
export interface HeaderWholeObject extends Array<string> { }
