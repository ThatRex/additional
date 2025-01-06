import {
    ApplicationCommandOptionChoiceData,
    AutocompleteInteraction,
} from 'discord.js'
import { isNotificationRole } from '../utils/is-notification-role.js'
import { regex } from '../regex.js'

const parsName = (str: string) => {
    const s = str.replace(regex.notificationRolePrefix, '')
    return s.charAt(0).toUpperCase() + s.slice(1)
}

export const autocomplete = (
    i: AutocompleteInteraction,
    mixin: ApplicationCommandOptionChoiceData<string>[] = []
) => {
    const val = i.options.getFocused().toLowerCase()
    const filter = (v: string) => v.includes(val) || val.includes(v)

    const options = i
        .guild!.roles.cache.filter(isNotificationRole)
        .map(({ id, name }) => ({
            name: parsName(name),
            value: id,
        }))

    const mixed = [...mixin, ...options]
    const filtered = mixed.filter((o) => filter(o.name.toLowerCase()))

    i.respond(filtered.length ? filtered : mixed)
}
