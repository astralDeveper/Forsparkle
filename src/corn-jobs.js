const cron = require('node-cron');
const Story = require('./models/Story.js');
const { cloudinary } = require('./utlis/fileUploder.js');

const initCornJobs = async () => {


  const myFunction = () => {
    console.log('This function runs every 5 seconds');
  };

  const DeleteExpiredStories = async () => {
    try {
      console.log("checking for expired stories")
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

      const storiesToDelete = await Story.find({ createdAt: { $lt: fiveMinutesAgo } });

      console.log(storiesToDelete)

      if (storiesToDelete.length) {

        storiesToDelete.forEach(async (story) => {
          console.log(story, "deleting")
          await cloudinary.api.delete_resources([story.media.filename], {
            resource_type: story?.media?.mimetype?.split("/")[0] ?? "video",
            type: "upload",
          });

          await Story.findByIdAndDelete(story._id);

          console.log("deleted")

        });

      }


      // const storyToDelete = await Story.deleteMany({ createdAt: { $lt: fiveMinutesAgo } });

    } catch (error) {
      console.log(error)
    }
  }

  // cron.schedule('*/5 * * * * *', myFunction); every 5 seconds
  cron.schedule('*/5 * * * * ', DeleteExpiredStories);

};


module.exports = initCornJobs;
