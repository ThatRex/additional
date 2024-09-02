import {
    ApplicationCommandOptionType,
    AutocompleteInteraction,
    CommandInteraction,
    GuildMember,
} from 'discord.js'
import { Discord, Slash, SlashOption } from 'discordx'
import { parsNotificationRoleName } from '../utils/index.js'

const autocomplete = (i: AutocompleteInteraction) => {
    const options = i
        .guild!.roles.cache.filter((r) => r.name.startsWith('!!'))
        .map(({ id, name }) => ({
            name: parsNotificationRoleName(name),
            value: id,
        }))
    i.respond([{ name: 'All', value: 'all' }, ...options])
}
@Discord()
export class Unsubscribe {
    @Slash({ description: 'Unsubscribe from notifications' })
    async unsubscribe(
        @SlashOption({
            autocomplete,
            description: 'The the notification role to unsubscribe from',
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
                    member.roles.remove(
                        r,
                        'Member unsubscribed from notifications.'
                    )
                )

            await interaction.reply({
                content:
                    'You have been unsubscribed from all notifications roles.',
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

        await member.roles.remove(notificationRole)

        await interaction.reply({
            content: `You have been unsubscribed from the ${notificationRole} notification role.`,
            ephemeral: true,
        })
    }
}
