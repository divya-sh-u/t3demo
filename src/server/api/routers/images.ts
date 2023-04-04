
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
// model image {
//     id        String   @id @default(cuid())
//     createdAt DateTime @default(now())
//     updatedAt DateTime @updatedAt
//     name      String
//     url       String
//     user      User     @relation(fields: [userId], references: [id])
//     userId    String
// }
export const imagesRouter = createTRPCRouter({
    getAll: protectedProcedure
    .query(({ ctx }) => {
        return ctx.prisma.image.findMany({
            where: { userId: ctx.session.user.id },
        });
    }),
    getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
        const image = await ctx.prisma.image.findUnique({
            where: { id: input.id },
        });
        if (!image) {
            throw new Error("Image not found");
        }
        return image;
    }),
    create: protectedProcedure
    .input(z.object({ name: z.string(), url: z.string() }))
    .mutation(async ({ ctx, input }) => {
        const image = await ctx.prisma.image.create({
            data: { name: input.name, url: input.url, userId: ctx.session.user.id },
        });
        return image;
    }),
    update: protectedProcedure
    .input(z.object({ id: z.string(), name: z.string(), url: z.string() }))
    .mutation(async ({ ctx, input }) => {
        const image = await ctx.prisma.image.update({
            where: { id: input.id },
            data: { name: input.name, url: input.url },
        });
        return image;
    }),
    delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
        const image = await ctx.prisma.image.delete({
            where: { id: input.id },
        });
        return image;
    }
    ),
});

