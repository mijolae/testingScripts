import axios from 'axios'
let feeUsd = 0

// fetch eth price
const {
    data: { ethereum },
} = await axios.get(
    'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
)
// eth gas price from alchemy
const {
    data: { result: gas_price },
} = await axios.post(
    'https://eth-mainnet.alchemyapi.io/v2/_9jvtNUzoLW1EHR380VZP7GUZaqXvmG3',
    {
        jsonrpc: '2.0',
        method: 'eth_gasPrice',
        params: [],
        id: 1,
    }
)

const {
    data: { average },
} = await axios.get(
    'https://legacy.ethgasstation.info/json/ethgasAPI.json'
)

feeUsd = ((280_000 * average) / 1e18) * ethereum.usd

// get LUNA price from CoinGecko after fork
let exchangeRate = 1
const { data } = await axios.get(
    'https://api.coingecko.com/api/v3/simple/price?ids=terra-luna-2&vs_currencies=eth,usd'
)
exchangeRate *= data['terra-luna-2'].eth

//decimals for non-terra tokens
console.log(feeUsd * exchangeRate * 1e6 * 1.15)