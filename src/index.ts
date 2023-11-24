import fastify from 'fastify'
import { errorHandler } from './lib/ErrorHandler'
import { ROLEENUM, adminSchema } from './modules/admin/adminSchema'
import { AdminRoutes } from './modules/admin/admin.routes'
import dotenv from 'dotenv';
import { teacherSchema } from './modules/teacher/teacherSchema';
import { authMiddleware } from './auth/authMiddleware';
import { AuthRoute } from './auth/auth.route';


// Initialize environment variables from .env file

const server = fastify()
dotenv.config();

//Adding autocompletion for user object on request
declare module 'fastify' {
	interface FastifyRequest {
		user: {
			id: string | number,
			name: string,
			role: ROLEENUM
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

// server.decorate("auth", authMiddleware)

// Declare a route  
server.get('/', function (request, reply) {
	reply.send({ hello: 'world' })


})

//Register error middleware
server.setErrorHandler(errorHandler)




// Run the server!  
async function main() {


	//register schemas
	for (const schema of [...adminSchema, ...teacherSchema]) {
		server.addSchema(schema)
	}
	//register auth routes
	server.register(AuthRoute, { prefix: "/api/auth" })
	//Register admin routes
	server.register(AdminRoutes, { prefix: "/api/admin" })


	server.listen({ port: 5000 }, function (err, address) {

		if (err) {
			server.log.error(err)
			process.exit(1)
		}

		console.log(`Server is now listening on ${address}`)
	})
}

main()
