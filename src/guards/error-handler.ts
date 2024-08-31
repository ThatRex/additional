import { ArgsOf, GuardFunction } from 'discordx'
import { CommandInteraction, DiscordAPIError } from 'discord.js'

export const ErrorHandler: GuardFunction = async (arg, _, next) => {
    try {
        await next()
    } catch (error) {
        const argObj = arg instanceof Array ? arg[0] : arg
        const isInteraction = argObj instanceof CommandInteraction

        if (!isInteraction) {
            console.error('Event Error:', error)
            return
        }

        const interaction = argObj

        let message = error instanceof Error ? error.message : 'unknown'

        if (
            error instanceof DiscordAPIError &&
            [50001, 50013].includes(error.code as number)
        ) {
            message = `Sorry, I don't have permission to do that.`
        }

        console.error(`${interaction.commandName} Error: ${message}`)

        if (interaction.deferred) interaction.editReply({ content: message })
        else interaction.reply({ content: message, ephemeral: true })
    }
}
