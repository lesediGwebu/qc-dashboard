import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
    args: {},
    handler: async (ctx) => {
        const designers = await ctx.db.query("designers").collect();
        console.log("[CONVEX] designers.get - count:", designers.length);
        console.log("[CONVEX] designers.get - data:", JSON.stringify(designers, null, 2));
        return designers;
    },
});

export const seed = mutation({
    args: {},
    handler: async (ctx) => {
        const designers = [
            { name: "Boitumelo Molefe", missedDeadlines: 0, dueToday: 0, internalReverts: 0, externalReverts: 0, qcReverts: 0 },
            { name: "Cayla Rynders", missedDeadlines: 0, dueToday: 0, internalReverts: 0, externalReverts: 0, qcReverts: 0 },
            { name: "Celimpilo Ngwenya", missedDeadlines: 0, dueToday: 0, internalReverts: 0, externalReverts: 0, qcReverts: 0 },
            { name: "Christine Chivers", missedDeadlines: 0, dueToday: 0, internalReverts: 0, externalReverts: 0, qcReverts: 0 },
            { name: "Ipeleng", missedDeadlines: 0, dueToday: 0, internalReverts: 0, externalReverts: 0, qcReverts: 0 },
            { name: "Itumeleng Lerata", missedDeadlines: 0, dueToday: 0, internalReverts: 0, externalReverts: 0, qcReverts: 0 },
            { name: "Lethabo Leshabana", missedDeadlines: 0, dueToday: 0, internalReverts: 0, externalReverts: 0, qcReverts: 0 },
            { name: "Matthew Ndlovu", missedDeadlines: 0, dueToday: 0, internalReverts: 0, externalReverts: 0, qcReverts: 0 },
            { name: "Nkanyezi", missedDeadlines: 0, dueToday: 0, internalReverts: 0, externalReverts: 0, qcReverts: 0 },
            { name: "Racheal Kazembe", missedDeadlines: 0, dueToday: 0, internalReverts: 0, externalReverts: 0, qcReverts: 0 },
            { name: "Tshepo Makhoro", missedDeadlines: 0, dueToday: 0, internalReverts: 0, externalReverts: 0, qcReverts: 0 },
        ];

        for (const designer of designers) {
            await ctx.db.insert("designers", designer);
        }
    },
});

export const updateDesigners = mutation({
    args: {
        designers: v.array(
            v.object({
                name: v.string(),
                missedDeadlines: v.number(),
                dueToday: v.number(),
                internalReverts: v.number(),
                externalReverts: v.number(),
                qcReverts: v.number(),
            })
        ),
    },
    handler: async (ctx, args) => {
        // Clear existing data (optional, depending on sync strategy)
        const existing = await ctx.db.query("designers").collect();
        for (const doc of existing) {
            await ctx.db.delete(doc._id);
        }

        // Insert new data
        for (const designer of args.designers) {
            await ctx.db.insert("designers", designer);
        }
    },
});

export const getQCItems = query({
    args: {},
    handler: async (ctx) => {
        const items = await ctx.db.query("qcItems").collect();
        // Sort by deadline (earliest first), items without deadline go to end
        return items.sort((a, b) => {
            if (!a.deadline && !b.deadline) return 0;
            if (!a.deadline) return 1;
            if (!b.deadline) return -1;
            return a.deadline.localeCompare(b.deadline);
        });
    },
});

export const updateQCItems = mutation({
    args: {
        items: v.array(
            v.object({
                itemId: v.string(),
                name: v.string(),
                function: v.string(),
                status: v.string(),
                assignee: v.optional(v.string()),
                url: v.optional(v.string()),
                deadline: v.optional(v.string()),
                lastUpdated: v.optional(v.string()),
            })
        ),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db.query("qcItems").collect();
        for (const doc of existing) {
            await ctx.db.delete(doc._id);
        }

        for (const item of args.items) {
            await ctx.db.insert("qcItems", item);
        }
    },
});

export const getReverts = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("reverts").collect();
    },
});

export const updateReverts = mutation({
    args: {
        items: v.array(
            v.object({
                itemId: v.string(),
                name: v.string(),
                function: v.string(),
                reason: v.string(),
                status: v.string(),
                assignee: v.optional(v.string()),
                url: v.optional(v.string()),
                timestamp: v.string(),
            })
        ),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db.query("reverts").collect();
        for (const doc of existing) {
            await ctx.db.delete(doc._id);
        }

        for (const item of args.items) {
            await ctx.db.insert("reverts", item);
        }
    },
});
