FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN apk add --no-cache openssl libc6-compat
RUN corepack enable && corepack prepare pnpm@10.19.0 --activate

FROM base AS deps
WORKDIR /app
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json .npmrc ./
COPY apps/web/package.json apps/web/
COPY apps/owner/package.json apps/owner/
COPY apps/admin/package.json apps/admin/
COPY apps/staff/package.json apps/staff/
COPY packages/database/package.json packages/database/
COPY packages/auth/package.json packages/auth/
COPY packages/ui/package.json packages/ui/
COPY packages/eslint-config/package.json packages/eslint-config/
COPY packages/tailwind-config/package.json packages/tailwind-config/
COPY packages/typescript-config/package.json packages/typescript-config/
RUN pnpm install --frozen-lockfile

FROM base AS builder
ARG APP=web
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# Re-link workspace packages after copying source (pnpm symlinks)
RUN pnpm install --frozen-lockfile
RUN pnpm db:generate
RUN pnpm turbo run build --filter=${APP}

FROM base AS runner
ARG APP=web
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV APP_NAME=${APP}
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/${APP}/public ./apps/${APP}/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/${APP}/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/${APP}/.next/static ./apps/${APP}/.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["sh", "-c", "node apps/$APP_NAME/server.js"]
