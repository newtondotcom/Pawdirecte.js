export const AccountKind = {
  Student: "E",
  Teacher: "P"
  // Family1: "1",
  // Family2: "2"
  // Staff: "A"
} as const;

export type AccountKind = typeof AccountKind[keyof typeof AccountKind];
