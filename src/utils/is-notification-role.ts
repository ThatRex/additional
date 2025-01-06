import { Role } from 'discord.js'
import { regex } from '../regex.js'

export const isNotificationRole = (role: Role) => {
    return regex.notificationRolePrefix.test(role.name)
}
