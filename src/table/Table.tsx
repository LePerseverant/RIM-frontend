import { useContext, useMemo, useState } from "react"
import {
  MRT_ColumnDef,
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnFiltersState,
  type MRT_PaginationState,
  type MRT_SortingState,
} from "material-react-table"
import { IconButton, Tooltip } from "@mui/material"
import RefreshIcon from "@mui/icons-material/Refresh"
import {
  keepPreviousData,
  useQuery,
} from "@tanstack/react-query"
import { ModalContext } from "../context"


type APIResponse = {
  data: {
    count: number
    next: URL
    previous: URL
    results: Array<any>
  }
}

type Table = {
  endpoint: string,
  columns: MRT_ColumnDef<any>[],
  token: string,
  setToken: (userToken: string) => void
}

const Table: React.FC<Table> = ({ endpoint, columns, token }) => {
  const _columns = useMemo<typeof columns>(() => columns, [])
  const { ID, setID, setOpen } = useContext(ModalContext)

  //manage our own state for stuff we want to pass to the API
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(
    [],
  )
  const [globalFilter, setGlobalFilter] = useState("")
  const [sorting, setSorting] = useState<MRT_SortingState>([])
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  })
  const [isFullScreen, setIsFullScreen] = useState(true)

  //consider storing this code in a custom hook (i.e useFetchUsers)
  const {
    data,//your data and api response will probably be different
    isError,
    isRefetching,
    isLoading,
    refetch,
  } = useQuery<APIResponse>({
    queryKey: [
      endpoint,
      ID,
      columnFilters, //refetch when columnFilters changes
      globalFilter, //refetch when globalFilter changes
      pagination.pageIndex, //refetch when pagination.pageIndex changes
      pagination.pageSize, //refetch when pagination.pageSize changes
      sorting, //refetch when sorting changes
    ],
    queryFn: async () => {
      const fetchURL = new URL(
        endpoint === "/customers" ? endpoint : `/customers/customer/${ID}/devices`,
        "http://localhost:5000"
      )

      //read our state and pass it to the API as query params
      fetchURL.searchParams.set("offset", `${pagination.pageIndex * pagination.pageSize}`)
      fetchURL.searchParams.set("limit", `${pagination.pageSize}`)
      fetchURL.searchParams.set("filters", JSON.stringify(columnFilters ?? []))
      fetchURL.searchParams.set("global_filter", globalFilter ?? "")
      fetchURL.searchParams.set("sorting", JSON.stringify(sorting ?? []))

      //use whatever fetch library you want, fetch, axios, etc
      const response = await fetch(fetchURL.href,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      const json = (await response.json()) as APIResponse
      return json
    },
    placeholderData: keepPreviousData, //don"t go to 0 rows when refetching or paginating to next page
  })

  const table = useMaterialReactTable({
    columns: _columns,
    data: data?.data.results ?? [],
    initialState: { showColumnFilters: true },
    manualFiltering: true, //turn on  built-in client-side filtering
    manualPagination: true, //turn on built-in client-side pagination
    manualSorting: true, //turn on built-in client-side sorting
    muiToolbarAlertBannerProps: isError
      ? {
        color: "error",
        children: "Error loading data",
      }
      : undefined,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    renderTopToolbarCustomActions: () => (
      <Tooltip arrow title="Refresh Data">
        <IconButton onClick={() => refetch()}>
          <RefreshIcon />
        </IconButton>
      </Tooltip>
    ),
    onIsFullScreenChange: setIsFullScreen,
    rowCount: data?.data.count ?? 0,
    state: {
      columnFilters,
      globalFilter,
      isLoading,
      isFullScreen: endpoint === "/customers" ? isFullScreen : false,
      pagination,
      showAlertBanner: isError,
      showProgressBars: isRefetching,
      sorting,
    },
    muiTableBodyRowProps: ({ row }) => ({
      onClick: (event) => {
        console.info(event, row.getValue("customer_id"))
        setID(row.getValue("customer_id"))
        setOpen(true)
      },
      sx: {
        cursor: "pointer", //you might want to change the cursor too when adding an onClick
      },
    })
  })

  return <MaterialReactTable table={table} />
}

export default Table
