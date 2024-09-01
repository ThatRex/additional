import {
    ApplicationCommandOptionType,
    BaseGuildVoiceChannel,
    ChannelType,
    CommandInteraction,
    GuildMember,
} from 'discord.js'
import { Discord, Slash, SlashOption } from 'discordx'

@Discord()
export class Move {
    @Slash({
        description: 'Move everyone to another voice channel',
        name: 'move',
    })
    async move(
        @SlashOption({
            description: 'The voice channel to move to',
            name: 'voice-channel',
            required: true,
            type: ApplicationCommandOptionType.Channel,
            channelTypes: [ChannelType.GuildVoice],
        })
        channelTo: BaseGuildVoiceChannel,

        interaction: CommandInteraction
    ) {
        await interaction.deferReply({ ephemeral: true })

        const member = interaction.member as GuildMember
        const channelFrom = member.voice.channel

        if (!channelFrom || !channelFrom.isVoiceBased())
            throw Error('You are not in a voice channel.')
        if (channelTo === channelFrom)
            throw Error('You are already in that channel.')
        if (!channelTo.isVoiceBased())
            throw Error('Channel must be a voice channel.')

        const hasPerms =
            member.permissions.has('MoveMembers') ||
            (channelFrom.permissionsFor(member).has('MoveMembers') &&
                channelTo.permissionsFor(member).has('MoveMembers'))

        if (!hasPerms)
            throw Error("Sorry, you don't have permession to do that.")

        await Promise.all(
            Array.from(channelFrom.members.values()).map((member) =>
                member.voice.setChannel(
                    channelTo,
                    `Moved by ${member.user.username}.`
                )
            )
        )

        await interaction.editReply(
            `Moved members from ${channelFrom} to ${channelTo}.`
        )
    }
}
