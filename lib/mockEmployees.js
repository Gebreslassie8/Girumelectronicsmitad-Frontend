export const MOCK_EMPLOYEES = [
  {
    _id: 'e1',
    employeeCode: 'EMP-2026-0001',
    user: { _id: 'u1', fullName: 'Admin User', phone: '0900000000', email: 'admin@grumstove.com', role: 'admin' },
    position: 'አስተዳዳሪ',
    department: 'አስተዳደር',
    salary: 15000,
    hireDate: '2024-01-15',
    status: 'active',
    branch: { _id: 'b1', name: 'ቦሌ ቅርንጫፍ' },
    permissions: { canSell: true, canManageInventory: true, canManageOrders: true, canIssueReceipts: true, canViewAnalytics: true, canManageEmployees: true },
    emergencyContact: { name: 'ሳራ አወቀ', phone: '0912345678' },
  },
  {
    _id: 'e2',
    employeeCode: 'EMP-2026-0002',
    user: { _id: 'u2', fullName: 'Seller User', phone: '0911111111', email: 'seller@grumstove.com', role: 'seller' },
    position: 'ሻጭ',
    department: 'ሽያጭ',
    salary: 8000,
    hireDate: '2024-03-20',
    status: 'active',
    branch: { _id: 'b1', name: 'ቦሌ ቅርንጫፍ' },
    permissions: { canSell: true, canManageInventory: false, canManageOrders: true, canIssueReceipts: true, canViewAnalytics: false, canManageEmployees: false },
    emergencyContact: { name: 'አበበ ከበደ', phone: '0923456789' },
  },
  {
    _id: 'e3',
    employeeCode: 'EMP-2026-0003',
    user: { _id: 'u3', fullName: 'ሳራ ተክሉ', phone: '0933333333', email: 'sara@grumstove.com', role: 'seller' },
    position: 'ሻጭ',
    department: 'ሽያጭ',
    salary: 7500,
    hireDate: '2024-06-10',
    status: 'active',
    branch: { _id: 'b2', name: 'መርካቶ ቅርንጫፍ' },
    permissions: { canSell: true, canManageInventory: true, canManageOrders: true, canIssueReceipts: true, canViewAnalytics: false, canManageEmployees: false },
    emergencyContact: { name: 'ሀና ተክሉ', phone: '0945678901' },
  },
  {
    _id: 'e4',
    employeeCode: 'EMP-2026-0004',
    user: { _id: 'u4', fullName: 'ዳዊት ተስፋዬ', phone: '0944444444', email: 'dawit@grumstove.com', role: 'seller' },
    position: 'አስተባባሪ',
    department: 'ሽያጭ',
    salary: 9000,
    hireDate: '2024-09-01',
    status: 'on_leave',
    branch: { _id: 'b1', name: 'ቦሌ ቅርንጫፍ' },
    permissions: { canSell: true, canManageInventory: false, canManageOrders: true, canIssueReceipts: true, canViewAnalytics: false, canManageEmployees: false },
    emergencyContact: { name: 'ሜሮን ተስፋዬ', phone: '0956789012' },
  },
  {
    _id: 'e5',
    employeeCode: 'EMP-2026-0005',
    user: { _id: 'u5', fullName: 'ግርማ አለሙ', phone: '0955555555', email: 'girma@grumstove.com', role: 'seller' },
    position: 'ሻጭ',
    department: 'ሽያጭ',
    salary: 7000,
    hireDate: '2024-11-15',
    status: 'suspended',
    branch: { _id: 'b2', name: 'መርካቶ ቅርንጫፍ' },
    permissions: { canSell: false, canManageInventory: false, canManageOrders: false, canIssueReceipts: false, canViewAnalytics: false, canManageEmployees: false },
    emergencyContact: { name: 'ፀሐይ አለሙ', phone: '0967890123' },
  },
];

export const EMPLOYEE_STATUS = {
  active:     { label: 'ንቁ',         color: 'green' },
  on_leave:   { label: 'ፈቃድ ላይ',    color: 'yellow' },
  suspended:  { label: 'ተንጠልጣይ',   color: 'red' },
  terminated: { label: 'ተቀናሽ',      color: 'gray' },
};

export const POSITIONS = ['አስተዳዳሪ', 'ሻጭ', 'አስተባባሪ', 'ሂሳብ ባለሙያ', 'ጠባቂ', 'ጽዳት ሰራተኛ', 'ሌላ'];
export const DEPARTMENTS = ['አስተዳደር', 'ሽያጭ', 'ምርት', 'ሂሳብ', 'ጥገና', 'ሌላ'];

export const PERMISSIONS_LIST = [
  { key: 'canSell',            label: 'መሸጥ' },
  { key: 'canManageInventory', label: 'መጋዘን ማስተዳደር' },
  { key: 'canManageOrders',    label: 'ትዕዛዞች ማስተዳደር' },
  { key: 'canIssueReceipts',   label: 'ደረሰኝ ማውጣት' },
  { key: 'canViewAnalytics',   label: 'ትንተና ማየት' },
  { key: 'canManageEmployees', label: 'ሠራተኞች ማስተዳደር' },
];

export const BRANCHES = [
  { _id: 'b1', name: 'ቦሌ ቅርንጫፍ' },
  { _id: 'b2', name: 'መርካቶ ቅርንጫፍ' },
  { _id: 'b3', name: 'ፒያሳ ቅርንጫፍ' },
];
