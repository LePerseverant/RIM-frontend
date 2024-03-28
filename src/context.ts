import { Dispatch, SetStateAction, createContext } from "react"


export const ModalContext = createContext<{
  open: boolean,
  setOpen: Dispatch<SetStateAction<boolean>>,
  ID: number,
  setID: Dispatch<SetStateAction<number>>,
}>({
  open: false,
  setOpen: () => ({}),
  ID: 0,
  setID: () => ({})
})
