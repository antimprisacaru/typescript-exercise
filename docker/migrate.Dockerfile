FROM node:18-alpine

WORKDIR /app

# Setup PNPM with explicit shell
ENV SHELL="/bin/sh"
ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="${PNPM_HOME}:$PATH"
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy project files - paths relative to docker-compose context (project root)
COPY pnpm-lock.yaml package.json ./
COPY tsconfig*.json ./
COPY scripts ./scripts
COPY libs ./libs

# Install dependencies and dotenv-cli globally
RUN mkdir -p /root/.local/share/pnpm
RUN pnpm install --frozen-lockfile
RUN pnpm install -g dotenv-cli@latest

# Generate Prisma Client
RUN pnpm prisma generate --schema ./libs/backend/data-access/src/lib/prisma/schema.prisma

# Setup script permissions and required tools
RUN chmod +x ./scripts/run-migrations.sh
RUN apk add --no-cache netcat-openbsd

CMD ["./scripts/run-migrations.sh"]
