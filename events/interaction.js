module.exports = class Interaction {
	constructor (client) {
		this.client = client;
	}

    async select(args, intr) {
        switch(args[0]) {
            case "logs":
                if (args[1] === 'channel_id') {
                    // intr.reply(intr.values[0]);
                    intr.message.delete();
                    let guildId = intr.member.guild.id,
                        guild = await this.client.db.guilds.findOne({ guildId });
                    if (!guild) {
                        new this.client.db.guilds({
                            guildId,
                            config: {
                                logs: {
                                    channelId: intr.values[0]
                                }
                            }
                        }).save();
                    } else {
                        guild['config']['logs']['channelId'] = intr.values[0] === 'logs:disable' ? null : intr.values[0];
                        guild.save();
                    }
                }
                break;
        }
    }

	async run(interaction) {
        let category = interaction.customId.split(':'),
            command = this.client.commands.get(category[0]);
        if (command && command.config.interactionEvents && command?.interaction) return command.interaction(category.slice(1), interaction);
        if (this[category[0]]) this[category[0]](category.slice(1), interaction);
	}
}