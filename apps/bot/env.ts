import dotenv from 'dotenv'
import { z, ZodError } from 'zod'

const envVars = z.object({
  NODE_ENV: z
    .union([z.literal('development'), z.literal('production')])
    .default('production'),
  DISCORD_BOT_TOKEN: z.string(),
  DISCORD_CLIENT_ID: z.string(),
  DEV_GUILD_ID: z.string().optional(),
  INDEXABLE_CHANNEL_IDS: z.string().transform((str) => str.split(',')),
  DATABASE_URL: z.string(),
  MIGRATE_OP: z.union([z.literal('latest'), z.literal('down')]).optional(),
})

dotenv.config()

let env: z.infer<typeof envVars>
try {
  env = envVars.parse(process.env)
} catch (err) {
  if (err instanceof ZodError) {
    let message = 'Failed to load environment variables:'
    for (const zodError of err.errors) {
      message += `\n[${zodError.path}]: ${zodError.message}`
    }
    throw new Error(message)
  }
  throw err
}

export { env }
