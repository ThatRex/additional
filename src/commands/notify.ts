import {
    ApplicationCommandOptionType,
    AutocompleteInteraction,
    CommandInteraction,
    GuildChannel,
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
    i.respond(options)
}

@Discord()
export class Notify {
    @Slash({ description: 'Notify subscribed server members' })
    async notify(
        @SlashOption({
            autocomplete,
            description: 'The role to notify',
            name: 'role',
            required: true,
            type: ApplicationCommandOptionType.String,
        })
        id: string,

        @SlashOption({
            description: 'A custom message',
            name: 'message',
            type: ApplicationCommandOptionType.String,
        })
        message: string | undefined,

        interaction: CommandInteraction
    ) {
        const member = interaction.member as GuildMember
        const channel = interaction.channel as GuildChannel

        const hasPerms =
            member.permissions.has('MentionEveryone') ||
            channel.permissionsFor(member).has('MentionEveryone') ||
            !!member.roles.cache.find(
                (r) => r.name.toLowerCase() === '@notifier'
            )

        if (!hasPerms) {
            await interaction.reply({
                content: 'Sorry, you dont have permission to do that.',
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

        await interaction.reply({
            content: `${notificationRole} ${message || 'Notification!'}`,
            allowedMentions: { parse: ['roles'] },
        })
    }
}
