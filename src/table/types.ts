export enum DeviceStatus {
  ACTIVE = "ACTIVE",
  NOT_ACTIVE = "NOT ACTIVE",
  DISABLED = "DISABLED"
}

export enum DeviceCategory {
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

export type Device = {
  device_id: number
  device_mac_address: string
  device_ip_v4_address: string
  device_category: DeviceCategory
  device_status: DeviceStatus
  created_at: Date
  updated_at: Date
}

export type Customer = {
  customer_id: number
  customer_name: string
  devices: Device[]
  created_at: Date
  updated_at: Date
}
