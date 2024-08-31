import { CommandInteraction } from 'discord.js'
import { Discord, Slash } from 'discordx'

@Discord()
export class Ping {
    @Slash({ description: 'Check if I am alive' })
    ping(interaction: CommandInteraction) {
        interaction.reply({
            content: 'Pong',
            ephemeral: true,
        })
    }
}
