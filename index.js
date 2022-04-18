/* eslint-disable */
const { Plugin } = require('powercord/entities');
const { getModule } = require('powercord/webpack');

const RemoteSettings = getModule(['updateRemoteSettings'], false)

const commands = [
    {
        command: 'online',
        description: 'Change your status to online'
    },
    {
        command: 'invisible',
        description: 'Change your status to invisible'
    },
    {
        command: 'idle',
        description: 'Change your status to idle'
    },
    {
        command: 'dnd',
        description: 'Change your status to dnd'
    }
]

class ChangeStatusPlugin extends Plugin {
    async startPlugin() {
        powercord.api.commands.registerCommand({
            command: 'status',
            aliases: ['change-status'],
            description: 'Change your status.',
            autocomplete: (args) => {
                if (args.length > 1) return false;

                const found = commands.filter(c => c.command.startsWith(args[0]))
                if (!found.length) return { commands, header: 'Status' }

                return {
                    commands: found,
                    header: 'Status'
                }
            },

            executor: (args) => {
                RemoteSettings.updateRemoteSettings({ status: args[0] });
                return {
                    send: false,
                    result: `Set your status to \`${args[0]}\``
                }
            }
        })
    }

    pluginWillUnload() {
        powercord.api.commands.unregisterCommand('status');
    }
}

module.exports = ChangeStatusPlugin