export default {
  type: "object",
  properties: {
    date: { type: "string" },
    notifyIn: { type: "string" },
  },
  required: ["id"],
} as const;
