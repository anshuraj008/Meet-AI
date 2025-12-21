//import { agentsInsertSchema } from "@/modules/agents/schemas";
import { z } from "zod";

export const meetingsInsertSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    agentId: z.string().min(1, { message: "Agent is required"}),
    // isPublic: z.boolean().optional().default(true),
    // maxParticipants: z.string().optional().default("10"),
});

export const meetingsUpdateSchema = meetingsInsertSchema.extend({
    id: z.string().min(1, {message: "Id is required"}),
});