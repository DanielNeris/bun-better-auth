import { openapi } from '@elysiajs/openapi'
import { Elysia } from 'elysia'
import { z } from 'zod'
import { betterAuthPlugin, OpenAPI } from './http/plugins/better-auth'

const app = new Elysia()
	.use(
		openapi({
			documentation: {
				components: await OpenAPI.components,
				paths: await OpenAPI.getPaths(),
			},
		}),
	)
	.use(betterAuthPlugin)
	.get(
		'/',
		() => {
			return {
				message: 'Hello Elysia',
			}
		},
		{
			detail: {
				hide: true,
			},
		},
	)
	.get(
		'/users/:id',
		({ params, user }) => {
			const userId = params.id
			const authenticatedUserName = user.name
			return {
				id: userId,
				name: authenticatedUserName,
			}
		},
		{
			auth: true,
			detail: {
				tags: ['users'],
				summary: 'Get a user by ID',
				description: 'Get a user by ID',
			},
			params: z.object({
				id: z.string(),
			}),
			response: {
				200: z.object({
					id: z.string(),
					name: z.string(),
				}),
			},
		},
	)
	.listen(3000)

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
)
