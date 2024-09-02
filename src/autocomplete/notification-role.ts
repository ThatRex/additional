import {
    ApplicationCommandOptionChoiceData,
    AutocompleteInteraction,
} from 'discord.js'

const parsName = (str: string) => {
    const s = str.slice(2).trim()
    return s.charAt(0).toUpperCase() + s.slice(1)
}

export const autocomplete = (
    i: AutocompleteInteraction,
    mixin: ApplicationCommandOptionChoiceData<string>[] = []
) => {
    const val = i.options.getFocused().toLowerCase()

    const options = i
        .guild!.roles.cache.filter((r) => r.name.startsWith('!!'))
        .map(({ id, name }) => ({
            name: parsName(name),
            value: id,
        }))

    const mixed = [...mixin, ...options]

    const filter = (v: string) => v.includes(val) || val.includes(v)
    const filteredOptions = mixed.filter((o) => filter(o.name.toLowerCase()))

    i.respond(filteredOptions.length ? filteredOptions : mixed)
}
