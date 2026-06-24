export type OrderStatus =
  | "order_received"
  | "payment_confirmed"
  | "preparing"
  | "out_for_delivery"
  | "awaiting_confirmation"
  | "delivered"
  | "cancelled";

export type OrderItem = {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  price: number;
  image: string;
};

export type Notification = {
  id: string;
  time: string;
  message: string;
  type: "info" | "success" | "warning";
  read: boolean;
};

export type DeliveryIssue = {
  id: string;
  reportedAt: string;
  description: string;
  resolved: boolean;
};

export type Order = {
  id: string;
  reference: string;
  status: OrderStatus;
  createdAt: string;
  estimatedDelivery: string;
  estimatedMinutes: number;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  address: string;
  landmark: string;
  contactName: string;
  contactPhone: string;
  vendorName: string;
  vendorMarket: string;
  notifications: Notification[];
  deliveryIssues?: DeliveryIssue[];
  confirmedAt?: string;
  otpVerified?: boolean;
};

export const ORDER_STAGES: { key: OrderStatus; label: string; sub: string }[] = [
  { key: "order_received", label: "Order Received", sub: "We got your order" },
  { key: "payment_confirmed", label: "Payment Confirmed", sub: "Payment verified" },
  { key: "preparing", label: "Preparing Order", sub: "Being packaged at market" },
  { key: "out_for_delivery", label: "Out for Delivery", sub: "On the way to you" },
  { key: "awaiting_confirmation", label: "Awaiting Confirmation", sub: "Please confirm receipt" },
  { key: "delivered", label: "Delivered", sub: "Enjoy your food!" },
];

export const STATUS_INDEX: Record<OrderStatus, number> = {
  order_received: 0,
  payment_confirmed: 1,
  preparing: 2,
  out_for_delivery: 3,
  awaiting_confirmation: 4,
  delivered: 5,
  cancelled: -1,
};

export const STATUS_BADGE: Record<OrderStatus, { label: string; color: string }> = {
  order_received: { label: "Order Received", color: "bg-blue-50 text-blue-700 ring-blue-200" },
  payment_confirmed: { label: "Payment Confirmed", color: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
  preparing: { label: "Preparing Order", color: "bg-amber-50 text-amber-700 ring-amber-200" },
  out_for_delivery: { label: "Out for Delivery", color: "bg-orange-50 text-orange-700 ring-orange-200" },
  awaiting_confirmation: { label: "Awaiting Confirmation", color: "bg-purple-50 text-purple-700 ring-purple-200" },
  delivered: { label: "Delivered", color: "bg-green-50 text-green-700 ring-green-200" },
  cancelled: { label: "Cancelled", color: "bg-red-50 text-red-700 ring-red-200" },
};

export const formatNaira = (n: number) =>
  `₦${n.toLocaleString("en-NG", { maximumFractionDigits: 0 })}`;

const baseItems: OrderItem[] = [
  { id: "i1", name: "Long Grain Parboiled Rice", quantity: 5, unit: "kg", price: 1450, image: "" },
  { id: "i2", name: "Brown Beans (Oloyin)", quantity: 3, unit: "kg", price: 1200, image: "" },
  { id: "i3", name: "Red Onions (Bulk Bag)", quantity: 1, unit: "bag", price: 2800, image: "" },
];

const smallItems: OrderItem[] = [
  { id: "i4", name: "Garri (Fine / Ijebu)", quantity: 2, unit: "kg", price: 650, image: "" },
  { id: "i5", name: "Honey Beans (White)", quantity: 2, unit: "kg", price: 1100, image: "" },
];

const deliveredItems: OrderItem[] = [
  { id: "i6", name: "Old Yam (Large)", quantity: 3, unit: "pc", price: 4500, image: "" },
  { id: "i7", name: "Sweet Potatoes", quantity: 4, unit: "kg", price: 700, image: "" },
  { id: "i8", name: "Shallots (Small Red Onions)", quantity: 2, unit: "kg", price: 950, image: "" },
];

export const MOCK_ORDERS: Order[] = [
  {
    id: "ord_001",
    reference: "RAW-2026-4821",
    status: "awaiting_confirmation",
    createdAt: "Today, 10:35 AM",
    estimatedDelivery: "Today, 12:45 PM",
    estimatedMinutes: 0,
    items: baseItems,
    subtotal: 12_650,
    deliveryFee: 800,
    total: 13_450,
    address: "14B Admiralty Way, Lekki Phase 1",
    landmark: "Near Shoprite Lekki",
    contactName: "Chidinma Okafor",
    contactPhone: "+234 803 456 7890",
    vendorName: "Mama T Store",
    vendorMarket: "Mile 12 Market, Lagos",
    notifications: [
      { id: "n1", time: "10:35 AM", message: "Your order RAW-2026-4821 has been placed successfully.", type: "success", read: true },
      { id: "n2", time: "10:37 AM", message: "Payment of ₦13,450 confirmed via bank transfer.", type: "success", read: true },
      { id: "n3", time: "11:10 AM", message: "Your order is being prepared at Mile 12 Market.", type: "info", read: true },
      { id: "n4", time: "12:02 PM", message: "Your order is out for delivery. Estimated arrival: 12:45 PM.", type: "info", read: true },
      { id: "n5", time: "12:44 PM", message: "Your delivery has arrived! Please confirm receipt.", type: "warning", read: false },
    ],
  },
  {
    id: "ord_002",
    reference: "RAW-2026-4799",
    status: "out_for_delivery",
    createdAt: "Today, 9:10 AM",
    estimatedDelivery: "Today, 11:30 AM",
    estimatedMinutes: 25,
    items: smallItems,
    subtotal: 3_500,
    deliveryFee: 600,
    total: 4_100,
    address: "7 Admiralty Road, Lekki Phase 1",
    landmark: "Behind Zenith Bank",
    contactName: "Emeka Nwosu",
    contactPhone: "+234 812 345 6789",
    vendorName: "Benue Fresh",
    vendorMarket: "Oyingbo Market, Lagos",
    notifications: [
      { id: "n6", time: "9:10 AM", message: "Order RAW-2026-4799 placed successfully.", type: "success", read: true },
      { id: "n7", time: "9:13 AM", message: "Payment of ₦4,100 confirmed via bank transfer.", type: "success", read: true },
      { id: "n8", time: "9:55 AM", message: "Vendor has started preparing your order.", type: "info", read: true },
      { id: "n9", time: "11:05 AM", message: "Your order is now out for delivery!", type: "info", read: false },
    ],
  },
  {
    id: "ord_003",
    reference: "RAW-2026-4711",
    status: "delivered",
    createdAt: "Yesterday, 2:15 PM",
    estimatedDelivery: "Yesterday, 4:00 PM",
    estimatedMinutes: 0,
    items: deliveredItems,
    subtotal: 18_100,
    deliveryFee: 1_000,
    total: 19_100,
    address: "14B Admiralty Way, Lekki Phase 1",
    landmark: "Near Shoprite Lekki",
    contactName: "Chidinma Okafor",
    contactPhone: "+234 803 456 7890",
    vendorName: "Abuja Direct",
    vendorMarket: "Abuja Farm Depot",
    confirmedAt: "Yesterday, 4:05 PM",
    otpVerified: true,
    notifications: [
      { id: "n10", time: "2:15 PM", message: "Order RAW-2026-4711 placed successfully.", type: "success", read: true },
      { id: "n11", time: "2:18 PM", message: "Payment of ₦19,100 confirmed.", type: "success", read: true },
      { id: "n12", time: "3:05 PM", message: "Order is being prepared.", type: "info", read: true },
      { id: "n13", time: "3:40 PM", message: "Your order is out for delivery.", type: "info", read: true },
      { id: "n14", time: "4:02 PM", message: "Delivery arrived — awaiting your confirmation.", type: "warning", read: true },
      { id: "n15", time: "4:05 PM", message: "Order confirmed received. Thank you!", type: "success", read: true },
    ],
  },
  {
    id: "ord_004",
    reference: "RAW-2026-4680",
    status: "delivered",
    createdAt: "2 days ago, 8:00 AM",
    estimatedDelivery: "2 days ago, 10:00 AM",
    estimatedMinutes: 0,
    items: [
      { id: "i9", name: "Old Yam (Large)", quantity: 5, unit: "pc", price: 4500, image: "" },
      { id: "i10", name: "Long Grain Parboiled Rice", quantity: 10, unit: "kg", price: 1450, image: "" },
    ],
    subtotal: 36_000,
    deliveryFee: 1_200,
    total: 37_200,
    address: "14B Admiralty Way, Lekki Phase 1",
    landmark: "Near Shoprite Lekki",
    contactName: "Chidinma Okafor",
    contactPhone: "+234 803 456 7890",
    vendorName: "Mile 12 Bulk",
    vendorMarket: "Mile 12 Market, Lagos",
    confirmedAt: "2 days ago, 10:12 AM",
    notifications: [],
  },
];
