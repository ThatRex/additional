# Additional

An out of the way bot with additional commands and a patch for Discord. Created for my private Discord server. [Public Invite](https://discord.com/oauth2/authorize?client_id=1161858372631527444). _Uptime not guaranteed._

# Commands: General

> **/ping**  
> Check if I am alive

## Commands: Voice

Members with move member perms can bulk move and set voice channel region.

> **/move \<voice-channel\>**  
> Move everyone to another voice channel  
> _Move Members_

> **/region get**  
> Get voice channel region

> **/region set \<region\>**  
> Set voice channel region  
> _Move Members_

## Commands: Notification

Notification roles can be created by prefixing a role name with **!!** like **!!chill**. The **/notify** command may be used by members with a role named **@notifier**.

> **/notify \<role\> [message]**  
> Notify subscribed server members  
> _@notifier, Mention Everyone_

> **/subscribe \<role\>**  
> Subscribe to notifications

> **/unsubscribe \<role\>**  
> Unsubscribe from notifications

## Patch: Voice Channel Chat

This bot grants members who enter a voice channel without sufficient permissions access to the text chat without viewing message history. This is achieved by adding channel permission overrides when a member joins a voice channel, then removing them when they leave.

---

## Development

```
npm install
npm run dev
```

## Production

```
npm install --production
npm run build
npm run start
```

## Docker

To start your application:

```
docker-compose up -d
```

To shut down your application:

```
docker-compose down
```

To view your application's logs:

```
docker-compose logs
```

For the full command list please view the [Docker Documentation](https://docs.docker.com/engine/reference/commandline/cli/).

---

This bot is built with [disccordx](https://discordx.js.org). You can support [discordx](https://www.pnpmjs.com/package/discordx) by giving it a [GitHub](https://github.com/discordx-ts/discordx) star.
