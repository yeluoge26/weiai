declare module 'sql.js' {
  export interface QueryExecResult {
    columns: string[]
    values: any[][]
  }

  export interface Database {
    run(sql: string, params?: any[]): void
    exec(sql: string): QueryExecResult[]
    prepare(sql: string): Statement
    close(): void
    export(): Uint8Array
    getRowsModified(): number
  }

  export interface Statement {
    bind(params?: any[]): void
    step(): boolean
    get(): any[]
    getColumnNames(): string[]
    free(): void
  }

  export interface SqlJsStatic {
    Database: new (data?: ArrayLike<number>) => Database
  }

  export default function initSqlJs(config?: {
    locateFile?: (filename: string) => string
  }): Promise<SqlJsStatic>

  export { Database as SqlJsDatabase }
}
