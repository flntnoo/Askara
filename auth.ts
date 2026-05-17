import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from './src/lib/prisma';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  session: {
    strategy: 'database',
  },
  trustHost: process.env.AUTH_TRUST_HOST === 'true',
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        const appUser = user as typeof user & { anonymousId?: string | null };

        session.user.id = user.id;
        session.user.anonymousId = appUser.anonymousId ?? null;
      }

      return session;
    },
  },
  events: {
    async linkAccount({ user, account }) {
      if (!user.id) return;

      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          provider: account.provider,
        },
      });
    },
  },
});
