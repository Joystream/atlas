export const availableNodes = [
  {
    name: 'Joystream (Europe/Germany - High Availabitliy)',
    value: 'wss://rome-rpc-endpoint.joystream.org:9944',
  },
  {
    name: 'Joystream (JoystreamStats.Live)',
    value: 'wss://joystreamstats.live:9945',
  },
  {
    name: 'Joystream (Europe/UK)',
    value: 'wss://testnet-rpc-3-uk.joystream.org',
  },
  {
    name: 'Joystream (US/East)',
    value: 'wss://testnet-rpc-1-us.joystream.org',
  },
  {
    name: 'Joystream (Singapore)',
    value: 'wss://testnet-rpc-2-singapore.joystream.org',
  },
  {
    name: 'Atlas Dev',
    value: import.meta.env.VITE_DEVELOPMENT_NODE_URL as string,
  },
  {
    name: 'Local node',
    value: 'ws://127.0.0.1:9944',
  },
]
