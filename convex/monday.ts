"use node";
import { action } from "./_generated/server";
import { api } from "./_generated/api";
import { v } from "convex/values";

export const syncDesigners = action({
  args: {},
  handler: async (ctx) => {
    const apiKey = process.env.MONDAY_API_TOKEN;
    const boardId = process.env.MONDAY_BOARD_ID;

    if (!apiKey || !boardId) {
      throw new Error("Missing MONDAY_API_TOKEN or MONDAY_BOARD_ID");
    }

    // Whitelist of designers to include (exclude everyone else)
    const DESIGNER_WHITELIST = [
      "Boitumelo Molefe",
      "Cayla Rynders",
      "Celimpilo Ngwenya",
      "Christine Chivers",
      "Ipeleng",
      "Itumeleng Lerata",
      "Lethabo Leshabana",
      "Matthew Ndlovu",
      "Nkanyezi",
      "Racheal Kazembe",
      "Tshepo Makhoro"
    ];

    // Fetch items and their subitems with specific columns including QC columns
    const query = `
      query {
        boards(ids: [${boardId}]) {
          items_page(limit: 500) {
            items {
              name
              subitems {
                id
                name
                column_values(ids: ["people", "date_mkxx6zcr", "status1", "color_mkpw7gdr", "color_mkwzfjx8", "color_mkx4wfdz", "last_updated__1"]) {
                  id
                  text
                  value
                }
              }
            }
          }
        }
      }
    `;

    const response = await fetch("https://api.monday.com/v2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: apiKey,
      },
      body: JSON.stringify({ query }),
    });

    const data = await response.json();

    if (data.errors) {
      throw new Error(`Monday API Error: ${JSON.stringify(data.errors)}`);
    }

    const items = data.data.boards[0].items_page.items;
    const designerStats: Record<string, {
      missedDeadlines: number;
      dueToday: number;
      internalReverts: number;
      externalReverts: number;
      qcReverts: number;
    }> = {};
    const qcItems: any[] = [];
    const reverts: any[] = [];

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    items.forEach((item: any) => {
      item.subitems?.forEach((subitem: any) => {
        const peopleCol = subitem.column_values.find((c: any) => c.id === "people");
        const dateCol = subitem.column_values.find((c: any) => c.id === "date_mkxx6zcr");
        const statusCol = subitem.column_values.find((c: any) => c.id === "status1");
        const functionCol = subitem.column_values.find((c: any) => c.id === "color_mkpw7gdr");
        const qc1Col = subitem.column_values.find((c: any) => c.id === "color_mkwzfjx8");
        const qc2Col = subitem.column_values.find((c: any) => c.id === "color_mkx4wfdz");
        const lastUpdatedCol = subitem.column_values.find((c: any) => c.id === "last_updated__1");

        const designerName = peopleCol?.text;

        // --- Designer Stats Logic (ONLY for whitelisted designers) ---
        if (designerName && DESIGNER_WHITELIST.includes(designerName)) {
          if (!designerStats[designerName]) {
            designerStats[designerName] = {
              missedDeadlines: 0,
              dueToday: 0,
              internalReverts: 0,
              externalReverts: 0,
              qcReverts: 0
            };
          }

          let dueDate = null;
          if (dateCol?.value) {
            try {
              const dateObj = JSON.parse(dateCol.value);
              dueDate = dateObj.date;
            } catch (e) {
              // ignore parse error
            }
          }

          if (dueDate) {
            if (dueDate === today) {
              designerStats[designerName].dueToday++;
            }

            const status = statusCol?.text?.toLowerCase() || "";
            const isDone = status.includes("done") || status.includes("approved") || status.includes("complete");

            if (dueDate < today && !isDone) {
              designerStats[designerName].missedDeadlines++;
            }
          }

          // --- Track Internal and External Reverts from Task Stage ---
          const taskStage = statusCol?.text;
          if (taskStage === "Int. Reverts") {
            designerStats[designerName].internalReverts++;
          } else if (taskStage === "Ext. Reverts") {
            designerStats[designerName].externalReverts++;
          }
        }

        // --- QC Items and Reverts Logic (REMOVED QC3) ---
        const qcColumns = [
          { col: qc1Col, name: "QC 1 - Copy" },
          { col: qc2Col, name: "QC 2 - Design" }
        ];

        qcColumns.forEach(({ col, name }) => {
          const qcStatus = col?.text;

          // Get deadline for sorting
          let deadline = null;
          if (dateCol?.value) {
            try {
              const dateObj = JSON.parse(dateCol.value);
              deadline = dateObj.date;
            } catch (e) {
              // ignore
            }
          }

          if (qcStatus === "In Review") {
            // Only include if designer is whitelisted
            if (!designerName || DESIGNER_WHITELIST.includes(designerName)) {
              qcItems.push({
                itemId: subitem.id,
                name: subitem.name,
                function: name,
                status: qcStatus,
                assignee: designerName || "Unassigned",
                url: `https://monday.com/boards/${boardId}/pulses/${subitem.id}`,
                deadline: deadline || undefined,
              });
            }
          } else if (qcStatus === "Reverts") {
            // Count QC reverts for the designer (only if whitelisted)
            if (designerName && DESIGNER_WHITELIST.includes(designerName) && designerStats[designerName]) {
              designerStats[designerName].qcReverts++;
            }

            let timestamp = new Date().toISOString();
            if (lastUpdatedCol?.text) {
              timestamp = lastUpdatedCol.text;
            }

            // Only include if designer is whitelisted
            if (!designerName || DESIGNER_WHITELIST.includes(designerName)) {
              reverts.push({
                itemId: subitem.id,
                name: subitem.name,
                function: name,
                reason: "Reverts",
                status: qcStatus,
                assignee: designerName || "Unassigned",
                url: `https://monday.com/boards/${boardId}/pulses/${subitem.id}`,
                timestamp,
              });
            }
          }
        });
      });
    });

    // Convert stats map to array for mutation
    const designers = Object.entries(designerStats).map(([name, stats]) => ({
      name,
      missedDeadlines: stats.missedDeadlines,
      dueToday: stats.dueToday,
      internalReverts: stats.internalReverts,
      externalReverts: stats.externalReverts,
      qcReverts: stats.qcReverts,
    }));

    await ctx.runMutation(api.designers.updateDesigners, { designers });
    await ctx.runMutation(api.designers.updateQCItems, { items: qcItems });
    await ctx.runMutation(api.designers.updateReverts, { items: reverts });

    return { count: designers.length, qcItemsCount: qcItems.length, revertsCount: reverts.length };
  },
});

export const inspectSubitemBoard = action({
  args: {},
  handler: async (ctx) => {
    const apiKey = process.env.MONDAY_API_TOKEN;
    const boardId = process.env.MONDAY_BOARD_ID;

    if (!apiKey || !boardId) {
      throw new Error("Missing MONDAY_API_TOKEN or MONDAY_BOARD_ID");
    }

    // 1. Get a subitem to find its board ID
    const query1 = `
      query {
        boards(ids: [${boardId}]) {
          items_page(limit: 1) {
            items {
              subitems {
                board {
                  id
                }
              }
            }
          }
        }
      }
    `;

    const response1 = await fetch("https://api.monday.com/v2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: apiKey,
      },
      body: JSON.stringify({ query: query1 }),
    });

    const data1 = await response1.json();
    const subitemBoardId = data1.data.boards[0].items_page.items[0]?.subitems[0]?.board?.id;

    if (!subitemBoardId) {
      return { error: "No subitems found to inspect" };
    }

    // 2. Inspect the subitem board columns
    const query2 = `
      query {
        boards(ids: [${subitemBoardId}]) {
          name
          columns {
            id
            title
            type
            settings_str
          }
        }
      }
    `;

    const response2 = await fetch("https://api.monday.com/v2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: apiKey,
      },
      body: JSON.stringify({ query: query2 }),
    });

    const data2 = await response2.json();

    // Log ALL columns to find QC1/QC2
    const columns = data2.data.boards[0].columns;
    console.log("--- SUBITEM BOARD COLUMNS ---");
    columns.forEach((c: any) => {
      console.log(`ID: ${c.id}, Title: ${c.title}, Type: ${c.type}`);
    });
    console.log("-----------------------------");

    // Log QC column settings to find labels
    const qcColumns = columns.filter((c: any) => c.id === 'color_mkx4wfdz' || c.id === 'color_mkx4rwcm');

    return { qcColumns };
  },
});
