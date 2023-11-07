import fastify from 'fastify'
import { errorHandler } from './lib/ErrorHandler'
import { adminSchema } from './modules/admin/adminSchema'
import { AdminRoutes } from './modules/admin/admin.routes'
import dotenv from 'dotenv';


// Initialize environment variables from .env file

const server = fastify()
dotenv.config();

//Adding autocompletion for user object on request
declare module 'fastify' {
	interface FastifyRequest {
		user: {
			id: string | number,
			name: string,
			role: string
		}
	}
}

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			JWTTOKEN: string,
			DATABASE_URL: string

		}
	}
}

// Declare a route  
server.get('/', function (request, reply) {
	reply.send({ hello: 'world' })
})

//Register error middleware
server.setErrorHandler(errorHandler)

//Register admin routes
server.register(AdminRoutes, { prefix: "/api/admin" })

// Run the server!  
async function main() {
	server.listen({ port: 3000 }, function (err, address) {
		for (const schema of [...adminSchema]) {
			server.addSchema(schema)
		}
		if (err) {
			server.log.error(err)
			process.exit(1)
		}

		console.log(`Server is now listening on ${address}`)
	})
}

main()
