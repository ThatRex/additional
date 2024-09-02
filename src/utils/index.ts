export const parsNotificationRoleName = (str: string) => {
    const s = str.slice(2).trim()
    return s.charAt(0).toUpperCase() + s.slice(1)
}
