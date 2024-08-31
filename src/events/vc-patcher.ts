import type { ArgsOf } from 'discordx'
import { Discord, On } from 'discordx'

@Discord()
export class VCPacther {
    @On({ event: 'voiceStateUpdate' })
    async vcPacther([oldState, newState]: ArgsOf<'voiceStateUpdate'>) {
        // Voice Channel Patcher: When a user is moved into a VC they dont have perms in they are granted access to the Text chat without history.

        const member = oldState.member
        const channelTo = newState.channel
        const channelFrom = oldState.channel

        if (!member || channelFrom === channelTo) return

        if (channelTo)
            await (async () => {
                // joining
                const channel = channelTo

                const channelMemberOverwrite =
                    channel.permissionOverwrites.cache.find(
                        (overwrite) => overwrite.id === member.id
                    )
                if (channelMemberOverwrite) return

                const perms = channel.permissionsFor(member)
                if (perms.has('ViewChannel') && perms.has('Connect')) return

                await channel.permissionOverwrites.create(member, {
                    ViewChannel: true,
                    Connect: true,
                    ReadMessageHistory: false,
                })
            })()

        if (channelFrom)
            await (async () => {
                // leaving
                const channel = channelFrom

                const perms = channel.permissionsFor(member)
                if (!perms.has(['ViewChannel', 'Connect'])) return

                const channelMemberOverwrite =
                    channel.permissionOverwrites.cache.find(
                        (overwrite) => overwrite.id === member.id
                    )
                if (!channelMemberOverwrite) return

                if (
                    !(
                        channelMemberOverwrite.allow.has([
                            'ViewChannel',
                            'Connect',
                        ]) &&
                        channelMemberOverwrite.deny.has('ReadMessageHistory')
                    )
                )
                    return

                if (
                    channelMemberOverwrite.allow
                        .toArray()
                        .filter((p) => !['ViewChannel', 'Connect'].includes(p))
                        .length
                )
                    return

                if (
                    channelMemberOverwrite.deny
                        .toArray()
                        .filter((p) => p !== 'ReadMessageHistory').length
                )
                    return

                await channel.permissionOverwrites.delete(member)
            })()
    }
}
