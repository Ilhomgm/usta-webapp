import { createMarketplace } from './marketplace.mjs'
const globalStore = globalThis as typeof globalThis & { ustaStore?: ReturnType<typeof createMarketplace> }
export const store = () => globalStore.ustaStore ?? (globalStore.ustaStore = createMarketplace())
