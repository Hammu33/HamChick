async function reject(client, userID, message) {
    return await client.connect(async () => {
        const callTimes = client.db("HamChick").collection("callTimes");

        userObj = await callTimes.findOne({
            "id": message.author.id
        }).catch((err) => console.error(err));

        if (userObj.pending_valentine.includes(userID)) {
            userObj.pending_valentine.splice(userObj.pending_valentine.indexOf(userID), 1);
            let update = {
                $set: userObj
            };
            await callTimes.updateOne({
                "id": userID
            }, update).catch(err => console.error(err));
            message.channel.send(`<@${userID}>, yeah you don't make the cut. I knew you were way out of <@${message.author.id}>'s league.`);
        } else {
            message.channel.send("Either that person doesn't exist or they don't like you enough to ask you out. :person_shrugging:")
        }
    });
}

module.exports = {
    name: "!reject",
    description: "Valentine's Special",
    execute(message, args) {
        if (!args[0]) {
            message.channel.send("...")
        }
        let userID = args[0].replace(/[!<>@]/g, "");
        const MongoClient = require('mongodb').MongoClient;
        const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.h1cxc.mongodb.net/HamChick?retryWrites=true&w=majority`;
        const client = new MongoClient(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        reject(client, userID, message);
    }
}