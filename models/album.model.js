const mongoose = require("mongoose");
const ObjectID = require("mongoose").Types.ObjectId;

const AlbumSchema = new mongoose.Schema(
    {
        userId: {
            type: ObjectID,
            ref: "user"
        },
        visible: {
            type: Boolean,
            default: true
        },
        photos: [
            {
                url: {
                    type: String,
                    required: true,
                },
                visible: {
                    type: Boolean,
                    default: true,
                },
                timestamp: {
                    type: Number,
                    default: Date.now
                },
                
                

            }
        ]
    },
    {
        timestamps: true
    }
)

module.exports=mongoose.model('album',AlbumSchema);