import { useMemo, useState } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_ColumnFiltersState,
  type MRT_PaginationState,
  type MRT_SortingState,
} from 'material-react-table';
import { IconButton, Tooltip } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import {
  QueryClient,
  QueryClientProvider,
  keepPreviousData,
  useQuery,
} from '@tanstack/react-query'; //note: this is TanStack React Query V5
import { ThemeProvider, useTheme } from '@mui/material';
import theme from './theme';


enum DeviceStatus {
  ACTIVE = "ACTIVE",
  NOT_ACTIVE = "NOT ACTIVE",
  DISABLED = "DISABLED"
}

enum DeviceCategory {
  ROUTER = "ROUTER",
  SWITCH = "SWITCH",
  BRIDGE = "BRIDGE",
  REPEATER = "REPEATER",
  WIRELESS_ACCESS_POINT = "WIRELESS ACCESS POINT",
  NETWORK_INTERFACE_CARD = "NETWORK INTERFACE CARD",
  FIREWALL = "FIREWALL",
  HUB = "HUB",
  MODEM = "MODEM",
  GATEWAY = "GATEWAY"
}

type Device = {
  device_id: number
  device_mac_address: string
  device_ip_v4_address: string
  device_category: DeviceCategory
  device_status: DeviceStatus
  created_at: Date
  updated_at: Date
}

type Customer = {
  customer_id: number
  customer_name: string
  devices: Device[]
  created_at: Date
  updated_at: Date
}

type CustomerAPIResponse = {
  data: {
    count: number
    next: URL
    previous: URL
    results: Customer[]
  }
}

type Example = {
  token: string,
  setToken: (userToken: string) => void
}

const Example: React.FC<Example> = ({ token, setToken }) => {
  const theme = useTheme();

  const columns = useMemo<MRT_ColumnDef<Customer>[]>(
    () => [
      {
        accessorKey: 'customer_id',
        header: 'Customer ID',
        size: 150,
      },
      {
        accessorKey: 'customer_name',
        header: 'Customer Name',
        size: 150,
      },
      {
        accessorKey: 'devices',
        accessorFn: (row: Customer) => <span>{row.devices.length}</span>,
        header: 'Devices',
        size: 150
      },
      {
        accessorKey: 'created_at',
        // accessorFn: (row: Customer) => <span>{row.updated_at.toUTCString()}</span>,
        header: 'Created At',
        // cell: (props: MRT_Cell<Customer, Date>) => <span>{props.getValue().toUTCString()}</span>,
        size: 150,
      },
      {
        accessorKey: 'updated_at',
        // accessorFn: (row: Customer) => <span>{row.updated_at.toUTCString()}</span>,
        header: 'Updated At',
        // cell: (props: MRT_Cell<Customer, Date>) => <span>{props.getValue().toUTCString()}</span>,
        size: 150,
      }
    ],
    []
  );

  //manage our own state for stuff we want to pass to the API
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(
    [],
  );
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });
  const [isFullScreen, setIsFullScreen] = useState(true)

  //consider storing this code in a custom hook (i.e useFetchUsers)
  const {
    data,//your data and api response will probably be different
    isError,
    isRefetching,
    isLoading,
    refetch,
  } = useQuery<CustomerAPIResponse>({
    queryKey: [
      'table-data',
      columnFilters, //refetch when columnFilters changes
      globalFilter, //refetch when globalFilter changes
      pagination.pageIndex, //refetch when pagination.pageIndex changes
      pagination.pageSize, //refetch when pagination.pageSize changes
      sorting, //refetch when sorting changes
    ],
    queryFn: async () => {
      const fetchURL = new URL(
        '/customers',
        'http://localhost:5000'
      );

      //read our state and pass it to the API as query params
      fetchURL.searchParams.set('offset', `${pagination.pageIndex * pagination.pageSize}`);
      fetchURL.searchParams.set('limit', `${pagination.pageSize}`);
      fetchURL.searchParams.set('filters', JSON.stringify(columnFilters ?? []));
      fetchURL.searchParams.set('global_filter', globalFilter ?? '');
      fetchURL.searchParams.set('sorting', JSON.stringify(sorting ?? []));

      //use whatever fetch library you want, fetch, axios, etc
      const response = await fetch(fetchURL.href,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      const json = (await response.json()) as CustomerAPIResponse;
      return json;
    },
    placeholderData: keepPreviousData, //don't go to 0 rows when refetching or paginating to next page
  });

  const table = useMaterialReactTable({
    columns,
    data: data?.data.results ?? [],
    initialState: { showColumnFilters: true },
    manualFiltering: true, //turn on  built-in client-side filtering
    manualPagination: true, //turn on built-in client-side pagination
    manualSorting: true, //turn on built-in client-side sorting
    muiToolbarAlertBannerProps: isError
      ? {
        color: 'error',
        children: 'Error loading data',
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
      isFullScreen,
      pagination,
      showAlertBanner: isError,
      showProgressBars: isRefetching,
      sorting,
    }
  });

  return <MaterialReactTable table={table} />;
};

const queryClient = new QueryClient();

type ExampleWithReactQueryProviderProps = {
  token: string,
  setToken: (userToken: string) => void
}

const ExampleWithReactQueryProvider: React.FC<ExampleWithReactQueryProviderProps> = ({ token, setToken }) => (
  //App.tsx or AppProviders file. Don't just wrap this component with QueryClientProvider! Wrap your whole App!
  <QueryClientProvider client={queryClient}>
    <ThemeProvider theme={theme}>
      <Example token={token} setToken={setToken} />
    </ThemeProvider>
  </QueryClientProvider>
);

export default ExampleWithReactQueryProvider;
