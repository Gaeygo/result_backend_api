import { FastifyInstance, FastifyPluginAsync, FastifyRequest, FastifyReply, DoneFuncWithErrOrRes } from 'fastify'
import fp from 'fastify-plugin'
import { getCurrentSessionFromConstant, getCurrentTerm } from '../modules/admin/admin.service'
import HttpException from '../schema/error'



// Create the plugin
export const requestExtensionPlugin: FastifyPluginAsync = async (fastify, opts) => {

    const currentTerm = await getCurrentTerm()
    const currentSession = await getCurrentSessionFromConstant()

    // //dont let it throw errors everytime
    // if (!currentSession) throw new HttpException(400, "Current Session not set refer to admin")
    // if (!currentTerm.term) throw new HttpException(400, "Current term not set refer to admin")

    //dont let it throw errors everytime
    if (!currentSession) return
    if (!currentTerm.term) return


    fastify.decorateRequest("currentTermId", currentTerm.term?.id)
    fastify.decorateRequest("currentSessionId", currentSession.id)

}


// Export the plugin wrapped with fastify-plugin
