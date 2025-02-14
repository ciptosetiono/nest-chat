export interface Room {
    _id: string,
    name: string,
    members?:string[],
    created_at:Date,
    updated_at: Date
}