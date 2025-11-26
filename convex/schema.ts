import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    designers: defineTable({
        name: v.string(),
        missedDeadlines: v.number(),
        dueToday: v.number(),
        internalReverts: v.optional(v.number()), // From "Int. Reverts" status
        externalReverts: v.optional(v.number()), // From "Ext. Reverts" status
        qcReverts: v.optional(v.number()), // From QC 1/2/3 "Reverts" status
    }),
    qcItems: defineTable({
        itemId: v.string(),
        name: v.string(),
        function: v.string(), // QC1 or QC2
        status: v.string(),
        assignee: v.optional(v.string()),
        url: v.optional(v.string()),
    }),
    reverts: defineTable({
        itemId: v.string(),
        name: v.string(),
        function: v.string(), // QC1, QC2, QC3
        reason: v.string(), // "Reverts"
        status: v.string(), // "Reverts"
        assignee: v.optional(v.string()),
        url: v.optional(v.string()),
        timestamp: v.string(), // For "recent" logic
    }),
});
