import { CommandInteraction } from 'discord.js'
import { Discord, Slash } from 'discordx'

@Discord()
export class Ping {
    @Slash({ description: 'Check if I am alive' })
    async ping(interaction: CommandInteraction) {
        await interaction.reply({
            content: 'Pong',
            ephemeral: true,
        })
    }
}
