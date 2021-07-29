# Important

If for some reason you delete the `node_modules` and you can't start the bot because discord.js doesn't allow selfbots anymore go to `\node_modules\discord.js\src\client\Client.js` and on line 35 replace `'Bot'` with `''`

# Basic Setup

Open your terminal and type `npm i`

Go to `\data\` and you'll find a file called `config.json`

Default prefix is `!?`

# Config Setup

Setup the basic information like filling out your Discord token then you'll see a file in `/data/` called `spotify.json` open that up and go to [here](https://accounts.spotify.com/en/login/) and login like normal

Once you've logged in go to the home page and open inspect element and go to the `Application` tab and follow this screenshot - 

You'll want to copy the `sp_dc` string and put it into the `spotify.json` file and start the bot, it'll automatically put the `bearer` and `username` field in for you.

![Spotify Help](https://i.imgur.com/zb8pPjq.png)

# Customization

To change the embed colour go to `\modules\` and open `utility.js` file and on line 16 you'll be able to change the hex.

To change the prefix go to `\data\` and open the `config.json` file and you can change it there.