import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface DecorationItem {
    id: bigint;
    typ: DecorationType;
    name: string;
    description: string;
    imageUrl: string;
    category: Category;
    price: bigint;
}
export enum Category {
    Birthday = "Birthday",
    Marriage = "Marriage",
    Funeral = "Funeral"
}
export enum DecorationType {
    Flower = "Flower",
    Balloon = "Balloon"
}
export interface backendInterface {
    getAllItems(): Promise<Array<DecorationItem>>;
    getItem(id: bigint): Promise<DecorationItem>;
    getItemsByCategory(category: Category): Promise<Array<DecorationItem>>;
}
