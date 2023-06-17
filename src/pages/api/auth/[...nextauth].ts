import client from '@/lib/db';
import NextAuth from "next-auth"
import {PrismaAdapter} from '@auth/prisma-adapter';
import DiscordProdiver from "next-auth/providers/discord"

export const authOptions = {
  adapter: PrismaAdapter(client),
  providers: [
    DiscordProdiver({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    }),
  ],
}
export default NextAuth(authOptions as any)