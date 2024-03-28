import { MRT_ColumnDef } from "material-react-table"
import { Customer, Device } from "./types"
import DevicesTable from "../components/Modal"
import { useContext, useState } from "react"
import { ModalContext } from "../context"

export const devicesColumns: MRT_ColumnDef<Device>[] = [
  {
    accessorKey: "device_id",
    header: "Device ID",
    size: 150,
  },
  {
    accessorKey: "device_mac_address",
    header: "MAC Address",
    size: 150,
  },
  {
    accessorKey: "device_ip_v4_address",
    header: "IP Address",
    size: 150,
  },
  {
    accessorKey: "device_category",
    header: "Category",
    size: 150,
  },
  {
    accessorKey: "device_status",
    header: "Status",
    size: 150,
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    size: 150,
  },
  {
    accessorKey: "updated_at",
    header: "Updated At",
    size: 150,
  }
]

export const useCustomersColumns = (): MRT_ColumnDef<Customer>[] => {

  return [
    {
      accessorKey: "customer_id",
      header: "Customer ID",
      size: 150,
    },
    {
      accessorKey: "customer_name",
      header: "Customer Name",
      size: 150,
    },
    {
      accessorKey: "devices",
      accessorFn: (row: Customer) => <span>{row.devices.length}</span>,
      header: "Devices",
      size: 150
    },
    {
      accessorKey: "created_at",
      header: "Created At",
      size: 150,
    },
    {
      accessorKey: "updated_at",
      header: "Updated At",
      size: 150,
    }
  ]
}
