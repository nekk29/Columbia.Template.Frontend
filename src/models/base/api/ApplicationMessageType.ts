export const ApplicationMessageType = {
  Ok: 0,
  Info: 1,
  Warning: 2,
  Error: 3
} as const;

export type ApplicationMessageType = typeof ApplicationMessageType[keyof typeof ApplicationMessageType];
