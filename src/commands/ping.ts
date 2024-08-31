import { CommandInteraction } from 'discord.js'
import { Discord, Slash } from 'discordx'

@Discord()
export class Ping {
    @Slash({ description: 'ping' })
    ping(interaction: CommandInteraction) {
        interaction.reply({
            content: 'Pong',
            ephemeral: true,
        })
    }
}
