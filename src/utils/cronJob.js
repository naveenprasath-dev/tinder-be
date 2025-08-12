const cron = require("node-cron");
const {subDays, startOfDay, endOfDay} = require("date-fns");
const ConnectionRequestModel = require("../models/connectionRequest");
const { set } = require("mongoose");
const sendEmail = require("./sendEmail");

cron.schedule("* * * *", async () => {
    // console.log("Hello World", new Date());

    try {
        const yesterday = subDays(new Date(), 0);
        const yesterdayStart = startOfDay(yesterday);
        const yesterdayEnd = endOfDay(yesterday);
        const pendingRequests = await ConnectionRequestModel.find({
            status : "interested",
            createdAt: {
                $gte: yesterdayStart,
                $lt : yesterdayEnd,
            }
        }).populate("fromUserId toUserId");

      
        // pendingRequests.length 
        // create a set, 
        const listOfEmails = [... new Set(pendingRequests.map(req => req.toUserId))]

        console.log(listOfEmails, "test");
        for (const email of listOfEmails) {
                try {
                    const res = await sendEmail.run("New Friend Request Pending for" + toEmailId, "Please Login and cehck to your account");
                } catch (error) {
                    
                }
        }
    } catch (error) {
        console.log(error.message);
    }
})

