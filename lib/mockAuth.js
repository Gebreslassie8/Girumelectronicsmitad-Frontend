// Mock users for demo login
export const MOCK_USERS = [
  {
    id: '1',
    fullName: 'Admin User',
    phone: '0900000000',
    email: 'admin@grumstove.com',
    password: 'admin123',
    role: 'admin',
    branch: { _id: 'b1', name: 'ቦሌ ቅርንጫፍ', code: 'BR-001' },
    isActive: true,
  },
  {
    id: '2',
    fullName: 'Seller User',
    phone: '0911111111',
    email: 'seller@grumstove.com',
    password: 'seller123',
    role: 'seller',
    branch: { _id: 'b1', name: 'ቦሌ ቅርንጫፍ', code: 'BR-001' },
    isActive: true,
  },
  {
    id: '3',
    fullName: 'Customer User',
    phone: '0922222222',
    email: 'customer@grumstove.com',
    password: 'customer123',
    role: 'customer',
    branch: null,
    isActive: true,
  },
];

export async function mockLogin(phone, password) {
  await new Promise((r) => setTimeout(r, 600));
  const user = MOCK_USERS.find((u) => u.phone === phone && u.password === password);
  if (!user) throw new Error('ስልክ ቁጥር ወይም ፓስወርድ ስህተት');
  const token = `mock-jwt-${user.role}-${Date.now()}`;
  const { password: _, ...safeUser } = user;
  return { token, user: safeUser };
}

export async function mockRegister(payload) {
  await new Promise((r) => setTimeout(r, 600));
  if (MOCK_USERS.find((u) => u.phone === payload.phone)) {
    throw new Error('ስልክ ቁጥሩ አስቀድሞ ተመዝግቧል');
  }

  // ✅ ሁልጊዜ customer — admin/seller አይፈቀድም
  const newUser = {
    id: String(MOCK_USERS.length + 1),
    fullName: payload.fullName,
    phone: payload.phone,
    email: payload.email || '',
    password: payload.password,
    role: 'customer',
    branch: null,
    isActive: true,
  };
  MOCK_USERS.push(newUser);
  const token = `mock-jwt-customer-${Date.now()}`;
  const { password: _, ...safeUser } = newUser;
  return { token, user: safeUser };
}

export const DEMO_ACCOUNTS = [
  {
    role: 'admin',
    label: 'አስተዳዳሪ',
    labelEn: 'Admin',
    phone: '0900000000',
    password: 'admin123',
    color: 'bg-purple-50 border-purple-200 text-purple-700',
    icon: '👑',
  },
  {
    role: 'seller',
    label: 'ሻጭ',
    labelEn: 'Seller',
    phone: '0911111111',
    password: 'seller123',
    color: 'bg-blue-50 border-blue-200 text-blue-700',
    icon: '💼',
  },
  {
    role: 'customer',
    label: 'ደንበኛ',
    labelEn: 'Customer',
    phone: '0922222222',
    password: 'customer123',
    color: 'bg-green-50 border-green-200 text-green-700',
    icon: '👤',
  },
];
