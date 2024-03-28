import { Modal, Box, Button } from "@mui/material"
import { useContext } from "react"
import { ModalContext } from "../context"
import Table from "../table/Table"
import { devicesColumns } from "../table/columns"

type DevicesTableProps = {
  token: string
}

const DevicesTable: React.FC<DevicesTableProps> = ({ token }) => {
  const { open, setOpen } = useContext(ModalContext)
  const handleClose = () => setOpen(false)


  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        m={20}
      >
        <Table columns={devicesColumns} endpoint="/devices" token={token} />
        <Button onClick={handleClose}>Close</Button>
      </Box>
    </Modal>
  )
}

export default DevicesTable
