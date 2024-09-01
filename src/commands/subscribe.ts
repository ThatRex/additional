import {
    ApplicationCommandOptionType,
    AutocompleteInteraction,
    CommandInteraction,
    GuildChannel,
    GuildMember,
} from 'discord.js'
import { Discord, Slash, SlashOption } from 'discordx'

const autocomplete = (i: AutocompleteInteraction) => {
    const options = i
        .guild!.roles.cache.filter((r) => r.name.startsWith('!!'))
        .map(({ id, name }) => ({ name, value: id }))
    i.respond([{ name: 'All', value: 'all' }, ...options])
}
@Discord()
export class Subscribe {
    @Slash({ description: 'Subscribe to notifications' })
    async subscribe(
        @SlashOption({
            autocomplete,
            description: 'The the notification role to subscribe to',
            name: 'role',
            required: true,
            type: ApplicationCommandOptionType.String,
        })
        id: string,

        interaction: CommandInteraction
    ) {
        const member = interaction.member as GuildMember

        if (id === 'all') {
            interaction
                .guild!.roles.cache.filter((r) => r.name.startsWith('!!'))
                .map((r) =>
                    member.roles.add(r, 'Member subscribed to notifications.')
                )

            await interaction.reply({
                content: 'You have been subscribed to all notifications roles.',
                ephemeral: true,
            })
            return
        }

        const notificationRole = interaction
            .guild!.roles.cache.filter((r) => r.name.startsWith('!!'))
            .find((r) => r.id === id)

        if (!notificationRole) {
            await interaction.reply({
                content: 'Sorry, that is not a notification role.',
                ephemeral: true,
            })
            return
        }

        await member.roles.add(notificationRole)

        await interaction.reply({
            content: `You have been subscribed to the ${notificationRole} notification role.`,
            ephemeral: true,
        })
    }
}
