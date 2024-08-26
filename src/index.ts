import fastify from 'fastify'
import { errorHandler } from './lib/ErrorHandler'
import { ROLEENUM, adminSchema } from './modules/admin/adminSchema'
import { AdminRoutes } from './modules/admin/admin.routes'
import dotenv from 'dotenv';
import { teacherSchema } from './modules/teacher/teacherSchema';
import { authMiddleware } from './auth/authMiddleware';
import { AuthRoute } from './auth/auth.route';
import { StudentRoutes } from './modules/student/student.routes';
import { requestExtensionPlugin } from "./plugin/ConstantInjectors"
import fp from 'fastify-plugin'



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
		},
		currentTermId: number,
		currentSessionId: number
	}
}

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			JWTTOKEN: string,
			DATABASE_URL: string,
			CURRENT_SESSION: string

		}
	}
}

//FIXME: ADD AN INTERCEPTOR THAT ADDS CURRENT SESSION AND TERM TO REQUEST 
server.register(fp(requestExtensionPlugin))

// server.decorate("auth", authMiddleware)

// Declare a route  
server.get('/', function (request, reply) {
	reply.send({ hello: 'world' })
	console.log(request.currentSessionId)

})

// server.decorateRequest("currentTermId", 1)


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

	server.register(StudentRoutes, { prefix: "/api/students" })


	server.listen({ port: 5000 }, function (err, address) {

		if (err) {
			server.log.error(err)
			process.exit(1)
		}

		console.log(`Server is now listening on ${address}`)
	})
}

main()
