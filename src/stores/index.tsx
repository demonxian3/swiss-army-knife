import GlobalStore from "./globalStore"
import { createContext, useContext } from "react"

const stores = {
    globalStore: new GlobalStore(),
}

export const StoreContext = createContext(stores)
export const useStore = () => useContext(StoreContext)
export default stores
