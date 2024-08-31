import {
    ApplicationCommandOptionType,
    AutocompleteInteraction,
    Client,
    CommandInteraction,
    DiscordAPIError,
    GuildMember,
} from 'discord.js'
import { Discord, Slash, SlashGroup, SlashOption } from 'discordx'

const autocompleteRegion = async (i: AutocompleteInteraction) => {
    const regions = await i.client.fetchVoiceRegions()
    const options = regions.map(({ name, id }) => ({
        name,
        value: id,
    }))
    await i.respond([{ name: 'Automatic', value: 'automatic' }, ...options])
}

const getRegionName = async (client: Client, id: string | null) => {
    const regions = await client.fetchVoiceRegions()
    const name = regions.find((r) => r.id === id)?.name || 'Automatic'
    return name
}

@Discord()
@SlashGroup({ description: 'manage voice channel region', name: 'region' })
@SlashGroup('region')
export class Region {
    @Slash({ description: 'set voice channel region' })
    async set(
        @SlashOption({
            autocomplete: autocompleteRegion,
            description: 'region override',
            name: 'region',
            required: true,
            type: ApplicationCommandOptionType.String,
        })
        id: string,

        interaction: CommandInteraction
    ) {
        await interaction.deferReply({ ephemeral: true })

        const channel = interaction.channel
        const member = interaction.member as GuildMember

        if (!channel || !channel.isVoiceBased())
            throw Error('This command must be run in a voice channel chat.')

        const hasPerms =
            member.permissions.has('MoveMembers') ||
            channel.permissionsFor(member).has('MoveMembers')

        if (!hasPerms)
            throw Error("Sorry, you don't have permession to do that.")

        const rtcRegion = id === 'automatic' ? null : id

        try {
            await channel.setRTCRegion(
                rtcRegion,
                `Set by ${interaction.member?.user.username || interaction.member}.`
            )
        } catch (error) {
            if (error instanceof DiscordAPIError && error.code === 50035) {
                await interaction.editReply({
                    content: `Sorry, that is not a valid region.`,
                })
                return
            }

            throw error
        }

        const name = await getRegionName(interaction.client, rtcRegion)
        await interaction.editReply({ content: `**Region Set:** ${name}` })
    }

    @Slash({ description: 'get voice channel region' })
    async get(interaction: CommandInteraction) {
        await interaction.deferReply({ ephemeral: true })

        const channel = interaction.channel

        if (!channel || !channel.isVoiceBased())
            throw Error('This command must be run in a voice channel chat.')

        const name = await getRegionName(interaction.client, channel.rtcRegion)
        await interaction.editReply({ content: `**Region:** ${name}` })
    }
}
