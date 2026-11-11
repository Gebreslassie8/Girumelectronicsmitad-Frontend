export const MOCK_EXPENSES = [
  {
    _id: 'ex1',
    name: 'የቢሮ ኪራይ',
    amount: 15000,
    paymentMethod: 'cash',
    date: '2026-11-01',
    description: 'ወርሃዊ የቢሮ ኪራይ',
    branch: { _id: 'b1', name: 'ቦሌ ቅርንጫፍ' },
    createdBy: { fullName: 'Admin User' },
  },
  {
    _id: 'ex2',
    name: 'የሠራተኛ ደመወዝ',
    amount: 45000,
    paymentMethod: 'transfer',
    date: '2026-11-05',
    description: 'ወርሃዊ ደመወዝ',
    branch: { _id: 'b1', name: 'ቦሌ ቅርንጫፍ' },
    createdBy: { fullName: 'Admin User' },
  },
  {
    _id: 'ex3',
    name: 'የጥሬ ብረት ግዢ',
    amount: 25000,
    paymentMethod: 'transfer',
    date: '2026-11-08',
    description: '100 ኪሎ ጥሬ ብረት',
    branch: { _id: 'b2', name: 'መርካቶ ቅርንጫፍ' },
    createdBy: { fullName: 'Seller User' },
  },
  {
    _id: 'ex4',
    name: 'የኤሌክትሪክ ክፍያ',
    amount: 3500,
    paymentMethod: 'cash',
    date: '2026-11-10',
    description: 'ወርሃዊ የኤሌክትሪክ ሂሳብ',
    branch: { _id: 'b1', name: 'ቦሌ ቅርንጫፍ' },
    createdBy: { fullName: 'Admin User' },
  },
  {
    _id: 'ex5',
    name: 'የትራንስፖርት ወጪ',
    amount: 2000,
    paymentMethod: 'cash',
    date: '2026-11-09',
    description: 'የዓመት ትራንስፖርት ወጪ',
    branch: { _id: 'b2', name: 'መርካቶ ቅርንጫፍ' },
    createdBy: { fullName: 'Seller User' },
  },
];

export const PAYMENT_METHODS = {
  cash:     { label: 'ጥሬ ገንዘብ', color: 'green' },
  transfer: { label: 'ዝውውር',    color: 'blue' },
};

export const EXPENSE_BRANCHES = [
  { _id: 'b1', name: 'ቦሌ ቅርንጫፍ' },
  { _id: 'b2', name: 'መርካቶ ቅርንጫፍ' },
  { _id: 'b3', name: 'ፒያሳ ቅርንጫፍ' },
];
