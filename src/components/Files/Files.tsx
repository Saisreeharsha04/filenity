import { useInfiniteQuery } from '@tanstack/react-query'
import { TanstackTable } from '../core/TanstackTable'
import { FileFilter } from './FileFilter'
import { EllipsisVertical } from 'lucide-react'
import { Route as filesRoute } from '~/routes/_header/files/index'
import { columns, getFileIcon } from './FilesColumn'
import { GetFilesAPI } from '~/http/services/files'
import { useRef, useEffect } from 'react'

function Spinner({ size = 6 }: { size?: number }) {
  return (
    <div className="flex items-center justify-center">
      <div
        className={`w-${size} h-${size} border-2 border-t-blue-500 border-gray-200 rounded-full animate-spin`}
      ></div>
    </div>
  )
}

export function Files() {
  const search = filesRoute.useSearch()
  const navigate = filesRoute.useNavigate()
  const viewMode = search.viewMode
  const limit = 10

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['files', viewMode],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await GetFilesAPI({ page: pageParam, limit })
      return {
        files: res?.data?.filesData ?? [],
        nextPage: res?.data?.pagination_info?.next_page ?? undefined,
      }
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  })

  const allFiles = data?.pages.flatMap((page) => page.files) ?? []

  const loaderRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { threshold: 1 }
    )
    if (loaderRef.current) observer.observe(loaderRef.current)
    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current)
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  if (status === 'pending')
    return (
      <div className="flex items-center justify-center h-[calc(100vh-120px)]">
        <Spinner size={8} />
        <p className="ml-2 text-gray-500">Loading files...</p>
      </div>
    )

  if (status === 'error')
    return (
      <div className="flex items-center justify-center h-[calc(100vh-120px)] text-red-500">
        Error loading files: {(error as any)?.message}
      </div>
    )

  return (
    <div className="bg-white flex flex-col gap-4 w-[99%] rounded-md mx-auto">
      <FileFilter
        viewMode={viewMode}
        setViewMode={(mode) =>
          navigate({ search: (old) => ({ ...old, viewMode: mode }) })
        }
      />


      {viewMode === 'list' ? (
        <TanstackTable data={allFiles} columns={columns} height="calc(100vh - 120px)" />
      ) : (
        <div className="px-4 grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-4 h-[calc(100vh-120px)] overflow-auto">
          {allFiles.map((item: any, index: number) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center border rounded-sm bg-[#F1F1F1] cursor-pointer w-34"
            >
              <div className="h-18 flex items-center">
                {getFileIcon(item.type)}
              </div>
              <div className="bg-white w-full rounded-b-lg p-1">
                <p className="text-[#4F4F4F] text-ellipsis text-[13px] 3xl:!text-base font-normal leading-[150%] overflow-hidden self-stretch">
                  {item.name || '--'}
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-[#888] text-xs 3xl:!text-sm font-normal leading-[100%]">
                    {item.size || '--'} MB
                  </p>
                  <EllipsisVertical strokeWidth={1} className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Infinite Scroll Loader */}
      <div ref={loaderRef} className="h-12 flex justify-center items-center">
        {isFetchingNextPage ? (
          <div className="flex items-center gap-2">
            <Spinner size={5} />
            <span className="text-gray-500 text-sm">Loading more files...</span>
          </div>
        ) : !hasNextPage ? (
          <span className="text-gray-400 text-sm">No more files</span>
        ) : null}
      </div>
    </div>
  )
}
