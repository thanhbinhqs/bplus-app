
export interface AppPaginator {
    page?: number;
    limit?: number;
    total?: number;
    limitOptions?: number[]
    search?:string
}