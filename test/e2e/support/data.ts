export const today = new Date().toISOString()

export const couriers = [
  { id: 11, name: "Sardor" },
  { id: 12, name: "Dilshod" },
]

export const orders = [
  {
    id: 101,
    number: "101",
    store_name: "Chilonzor bozori",
    status: "new",
    payment_method: "cash",
    payed: 0,
    user_id: 1,
    market_id: 1,
    total_amount: 250_000,
    created_at: today,
    user: { id: 1, name: "Ali Valiyev", phone: "+998901234567" },
    market: {
      id: 1,
      name: "Chilonzor bozori",
      address: "Bunyodkor 3",
      region: "Toshkent",
      district: "Chilonzor",
    },
    address: {
      id: 1,
      user_id: 1,
      region: "Toshkent",
      district: "Chilonzor",
      address: "1-uy",
      is_default: 1,
      created_at: today,
      updated_at: today,
    },
    products: [
      {
        id: 1001,
        order_id: 101,
        product_id: 5,
        qty: 2,
        unit_price: "100000",
        subtotal: "200000",
        created_at: today,
        product: {
          id: 5,
          name: "Olma",
          images: [],
        },
      },
    ],
  },
  {
    id: 102,
    number: "102",
    store_name: "Yunusobod bozori",
    status: "on_the_way",
    payment_method: "card",
    payed: 1,
    courier_id: 11,
    courier: { id: 11, name: "Sardor" },
    user_id: 2,
    market_id: 2,
    total_amount: 180_000,
    created_at: today,
    user: { id: 2, name: "Dilnoza Karimova", phone: "+998901112233" },
    market: {
      id: 2,
      name: "Yunusobod bozori",
      address: "Amir Temur 10",
      region: "Toshkent",
      district: "Yunusobod",
    },
    address: {
      id: 2,
      user_id: 2,
      region: "Toshkent",
      district: "Yunusobod",
      address: "2-uy",
      is_default: 1,
      created_at: today,
      updated_at: today,
    },
    products: [],
  },
  {
    id: 103,
    number: "103",
    store_name: "Sergeli bozori",
    status: "delivered",
    payment_method: "transfer",
    payed: 1,
    courier_id: 11,
    courier: { id: 11, name: "Sardor" },
    user_id: 3,
    market_id: 3,
    total_amount: 320_000,
    created_at: today,
    user: { id: 3, name: "Bekzod Toshmatov", phone: "+998907778899" },
    market: {
      id: 3,
      name: "Sergeli bozori",
      address: "Sergeli 5",
      region: "Toshkent",
      district: "Sergeli",
    },
    address: {
      id: 3,
      user_id: 3,
      region: "Toshkent",
      district: "Sergeli",
      address: "3-uy",
      is_default: 1,
      created_at: today,
      updated_at: today,
    },
    products: [],
  },
]

export const stores = [
  {
    id: 1,
    name: "Chilonzor bozori",
    region: "Toshkent",
    district: "Chilonzor",
    address: "Bunyodkor 3",
  },
]

export const staff = [
  {
    id: 11,
    name: "Sardor",
    phone: "+998901234567",
    role: "courier",
    region: "Toshkent",
    district: "Chilonzor",
  },
  {
    id: 12,
    name: "Dilshod",
    phone: "+998907654321",
    role: "courier",
    region: "Toshkent",
    district: "Yunusobod",
  },
]

export const users = [
  { id: 1, username: "e2e-admin", role: "admin", phone: "+998900000000" },
]

export const loginSuccess = {
  data: {
    token: "e2e-jwt-token",
    user: { id: 1, name: "E2E Admin", username: "e2e", role: "admin", role_id: 1 },
  },
}
