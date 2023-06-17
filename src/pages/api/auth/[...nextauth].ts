import prisma from '@/lib/db';
import NextAuth, { NextAuthOptions } from "next-auth"
import {PrismaAdapter} from '@auth/prisma-adapter';
import DiscordProdiver from "next-auth/providers/discord"
import { Adapter } from 'next-auth/adapters';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    DiscordProdiver({
      clientId: process.env.DISCORD_CLIENT_ID ?? "",
      clientSecret: process.env.DISCORD_CLIENT_SECRET ?? "",
    }),
  ],
}

export default NextAuth(authOptions)