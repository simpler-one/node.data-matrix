export type DataMatrixHeader = HeaderLayer[];
type HeaderLayer = HeaderElement[];
type HeaderElement = string | string[];

export type DataGroup = DataUnit[];
type DataUnit = DataElement[];
type DataElement = {};
