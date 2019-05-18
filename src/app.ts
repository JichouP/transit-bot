import { config } from 'dotenv';
config();
import { Client, TextChannel } from 'discord.js';
import request from 'request';
import { JSDOM } from 'jsdom';
const client = new Client();

client.on('ready', async () => {
  request(process.env.TRANSIT_URL!, (e, res) => {
    const dom = new JSDOM(res.body);
    const time = dom.window.document.querySelector('#route01 > div > div:last-child > ul > li')!.innerHTML;
    Array.from(client.guilds.values())
      .map(v => v.id)
      .forEach(_id => {
        const channel = Array.from(client.guilds.get(_id)!.channels.values()).find(v => v.name === 'bot');
        if (channel && channel.type === 'text') {
          (channel as TextChannel).send(`今から帰ります\n到着予想時刻は${time}です`);
        }
      });
  });
});

client.login(process.env.TOKEN);
