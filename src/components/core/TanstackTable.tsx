import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'

export type Person = {
  firstName: string
  lastName: string
  age: number
  visits: number
  status: string
  progress: number
}

export function TanstackTable({columns, data, height}:any) {
    const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    columnResizeMode: 'onChange',
  })

  return (
    <div className="px-4 w-full">
      <div className='overflow-auto' style={{height: height}}>
      <table className='w-full h-full'>
        <thead className='sticky top-0 z-30 text-left h-9 bg-[#F0F0F2] font-normal rounded'>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id} colSpan={header.colSpan} style={{ width: header.getSize() }} className='text-[#5D5D5D] text-[13px] 3xl:!text-base font-normal leading-[100%]'>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id} className='border-b border-[#F1F1F1] h-10'>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} style={{ width: cell.column.getSize() }} className='text-[#5D5D5D] text-[13px] 3xl:!text-base font-normal leading-[100%]'>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table> 
      </div> 
    </div>
  )
}