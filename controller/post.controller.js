const PostModel = require("../models/post.model");
const UserModel = require("../models/user.model");
const fs = require("fs");
const moment = require("moment");
const AlbumModel = require("../models/album.model");
const NotificationModel = require("../models/notifications.model");
const ObjectID = require("mongoose").Types.ObjectId;

module.exports.readPost = async (req, res) => {
  PostModel.find((err, data) => {
    if (!err) res.send(data);
    else console.log("Error to get data : " + err);
  }).sort({ createdAt: -1 });
};
module.exports.GetPOstBYUSER = async (req, res) => {
  PostModel.find(
    {
      posterId: req.params.id,
    },
    (err, data) => {
      if (!err) res.send(data);
      else console.log("Error to get data : " + err);
    }
  )
    .sort({ createdAt: -1 })
    .populate({ path: "comments.commenterId", select: ["pseudo", "photo"] })
    .populate({ path: "media", select: ["picture"] });
};
module.exports.GetPostByID = async (req, res) => {
  PostModel.find(
    {
      _id: req.params.id,
    },
    (err, data) => {
      if (!err) res.send(data);
      else console.log("Error to get data : " + err);
    }
  )
    .sort({ createdAt: -1 })
    .populate({ path: "comments.commenterId", select: ["pseudo", "photo"] })
    .populate({ path: "media", select: ["picture"] });
};

/*module.exports.createPost = async (req,res)=>{
   const newPost = new PostModel({
      posterId:req.body.posterId,
      message: req.body.message,
      video: req.body.video,
      likers:[],
      comments:[],
      accestopost:[]
   });
   try {
      const post = await newPost.save();
      return res.status(201).json(post)
   }catch (err){
      return res.status(400).send(err);

   }

}*/
module.exports.createPost = async (req, res) => {
  const { posterId, visible, texte, localisation } = req.body;
  try {
    if (req.file) {
      albumModel = new AlbumModel({
        userId: req.params.id,
        picture: {
          data: fs.readFileSync(
            "client/public/uploads/posts/" + req.file.filename
          ),
          contentType: "image/jpg",
          timestamp: new Date().getTime(),
        },
      });
      let albumsave = await albumModel.save();
      if (albumsave) {
        //console.log(albumsave._id)
        const newPost = new PostModel({
          posterId,
          visible,
          texte,
          localisation,
          media: albumsave._id,
        });
        await newPost.save((error, post) => {
          if (error) return res.status(401).json({ error });
          if (newPost) {
            res.status(201).send(post);
          }
        });
      }
    } else {
      const newPost = new PostModel({
        posterId,
        visible,
        texte,
        localisation,
      });
      await newPost.save((error, post) => {
        if (error) return res.status(401).json({ error });
        if (newPost) {
          res.status(201).send(post);
        }
      });
    }

    /*albumModel = new AlbumModel({
        userId: req.params.id,
        picture: {
            data: fs.readFileSync("client/public/uploads/posts/" + req.file.filename),
            contentType: "image/jpg",
            timestamp: new Date().getTime()
        }
    });
    let albumsave= await albumModel.save();
    if (albumsave){
        //console.log(albumsave._id)
        const newPost=new PostModel({
            posterId,
            visible,
            texte,
            localisation,
            media:albumsave._id,

        });
        await newPost.save((error, post) => {
            if (error) return res.status(401).json({ error });
            if (newPost) {
                res.status(201).send(post);
            }
        });

    }*/
  } catch (err) {
    return res.status(500).json({ message: err });
  }

  /*
    console.log(req.body)
    console.log(req.files)
    const newPost=new PostModel({
        posterId,
        texte,
        media:{
            data:fs.readFileSync("client/public/uploads/posts/"+req.file.filename),
            contentType:"image/jpg",
            timestamp:new Date().getTime()
        },

    });
    newPost.save((error, newPost) => {
        if (error) return res.status(400).json({ error });
        if (newPost) {
            res.status(201).json({ newPost, files: req.files });
        }
    });*/
};
module.exports.updatePost = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    //tester si le id est connu de la base de donne
    return res.status(400).send("ID unknown : " + req.params.id);
  const updatePub = {
    message: req.body.message,
  };
  PostModel.findByIdAndUpdate(
    req.params.id,
    { $set: updatePub },
    { new: true },
    (err, docs) => {
      if (!err) res.send(docs);
      else console.log("update error:" + err);
    }
  );
};
module.exports.deletePost = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    //tester si le id est connu de la base de donne
    return res.status(400).send("ID unknown : " + req.params.id);
  PostModel.findByIdAndRemove(req.params.id, (err, docs) => {
    if (!err) res.send(docs);
    else console.log("delete  error:" + err);
  });
};
//like methodes
module.exports.likePost = async (req, res) => {
  const { getUserEvent } = require("../notification");
  if (!ObjectID.isValid(req.params.id))
    //tester si le id est connu de la base de donne
    return res.status(400).send("ID unknown : " + req.params.id);
  try {
    let postlike = await PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $addToSet: { likers: req.body.user },
      },
      { new: true, upsert: true }
    );
    await NotificationModel.findOneAndUpdate(
      { userID: postlike.posterId },
      {
        $addToSet: {
          Coeur: {
            usersenderid: req.body.user,
            postid: req.params.id,
            timestamp: new Date().getTime(),
            model: "Coeur",
            text: "à aimer votre publication",
          },
        },
      },
      { new: true, upsert: false },
      (errr, dataa) => {
        if (!errr) {
          getUserEvent(req.body.user, dataa.Coeur[dataa.Coeur.length - 1]);
          return res
            .status(200)
            .send({
              post: postlike,
              notif: dataa.Coeur[dataa.Coeur.length - 1],
            });
        } else {
          // io.emit("getnotif", dataa.Coeur[dataa.Coeur.length - 1]);
          return res.status(400).send({ error: errr });
        }
      }
    );
  } catch (err) {
    res.status(400).send(err);
  }
};
module.exports.unlikePost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    //tester si le id est connu de la base de donne
    return res.status(400).send("ID unknown : " + req.params.id);
  try {
    await PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { likers: req.body.user },
      },
      { new: true },
      (err, docs) => {
        if (err) return res.status(400).send(err);
        else return res.status(200).send(docs);
      }
    );
  } catch (err) {
    res.status(400).send(err);
  }
};
//comment post
module.exports.commentPost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    let postcoment = await PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $addToSet: {
          comments: {
            commenterId: req.body.user,
            textcomment: req.body.textcomment,
            timestamp: new Date().getTime(),
          },
        },
      },
      { new: true }
    );
    await NotificationModel.findOneAndUpdate(
      { userID: postcoment.posterId },
      {
        $addToSet: {
          Message: {
            usersenderid: req.body.user,
            postid: req.params.id,
            timestamp: new Date().getTime(),
            model: "Message",
            text: "vient de commenter votre publication",
          },
        },
      },
      { new: true, upsert: false },
      (errr, dataa) => {
        if (!errr)
          return res.status(200).send({
            post: postcoment,
            notif: dataa.Message[dataa.Message.length - 1],
          });
        else return res.status(400).send({ error: errr });
      }
    );
  } catch (err) {
    return res.status(400).send(err);
  }
};
module.exports.editCommentPost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);
  try {
    return PostModel.findById(req.params.id, (err, docs) => {
      const thecomment = docs.comments.find((comment) =>
        comment._id.equals(req.body.commenteId)
      );
      if (!thecomment) return res.status(400).send("comment not found");
      thecomment.textcomment = req.body.textcomment;
      return docs.save((err) => {
        if (!err) return res.status(200).send(docs);
        return res.status(500).send(err);
      });
    });
  } catch (err) {
    return res.status(400).send("ID unknown:" + req.params.id);
  }
};
module.exports.SupprimerCommentPost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    return PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $pull: {
          comments: {
            _id: req.body.commentId,
          },
        },
      },
      { new: true },
      (err, docs) => {
        if (!err) return res.send(docs);
        else return res.status(400).send(err);
      }
    );
  } catch (err) {
    return res.status(400).send(err);
  }
};
//like comment
module.exports.likeComment = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    //tester si le id est connu de la base de donne
    return res.status(400).send("ID unknown : " + req.params.id);
  try {
    return PostModel.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $push: {
          likescomment: {
            userId: req.body.userId,
            commentaireId: req.body.commentaireId,
            timestamp: new Date().getTime(),
          },
        },
      },
      { new: true },
      (err, docs) => {
        if (!err) return res.send(docs);
        else return res.status(400).send(err);
      }
    );
  } catch (err) {
    res.status(400).send(err);
  }
};
module.exports.unlikeComment = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown " + req.params.id);
  try {
    // add to the follower liste
    PostModel.findByIdAndUpdate(
      { _id: req.params.id }, //id d personne qui faire labonne
      {
        $pull: {
          likescomment: {
            _id: req.body.likescomment,
          },
        }, //$pull reterai (-) dun valeur specifique
      }, //id de personne qui elle suivi
      { new: true },
      (err, data) => {
        if (!err) {
          res.status(201).json(data);
          console.log("bien supprimer");
        } else return res.status(400).json(err);
      }
    );
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};
//repand comment methodes
module.exports.repand = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);
  try {
    return PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          repandComent: {
            msg: req.body.msg,
            commantaireId: req.body.commantaireId,
            userId: req.body.userId,

            userPseudo: req.body.userPseudo,
            timestamp: new Date().getTime(),
          },
        },
      },
      { new: true },
      (err, docs) => {
        if (!err) return res.send(docs);
        else return res.status(400).send(err);
      }
    );
  } catch (err) {
    return res.status(400).send(err);
  }
};
module.exports.editRepant = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);
  try {
    return PostModel.findById(req.params.id, (err, docs) => {
      const theRepand = docs.repandComent.find((repand) =>
        repand._id.equals(req.body.repandId)
      );
      if (!theRepand) return res.status(400).send("comment not found");
      theRepand.msg = req.body.msg;
      return docs.save((err) => {
        if (!err) return res.status(200).send(docs);
        return res.status(500).send(err);
      });
    });
  } catch (err) {
    return res.status(400).send("ID unknown:" + req.params.id);
  }
};
module.exports.deletRepant = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    return PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $pull: {
          repandComent: {
            _id: req.body.repandId,
          },
        },
      },
      { new: true },
      (err, docs) => {
        if (!err) return res.send(docs);
        else return res.status(400).send(err);
      }
    );
  } catch (err) {
    return res.status(400).send(err);
  }
};
module.exports.LikeRepant = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    //tester si le id est connu de la base de donne
    return res.status(400).send("ID unknown : " + req.params.id);
  try {
    return PostModel.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $push: {
          likesRepand: {
            userId: req.body.userId,
            repandId: req.body.repandId,
            timestamp: new Date().getTime(),
          },
        },
      },
      { new: true },
      (err, docs) => {
        if (!err) return res.send(docs);
        else return res.status(400).send(err);
      }
    );
  } catch (err) {
    res.status(400).send(err);
  }
};
module.exports.unlikeRepand = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown " + req.params.id);
  try {
    // add to the follower liste
    PostModel.findByIdAndUpdate(
      { _id: req.params.id }, //id d personne qui faire labonne
      {
        $pull: {
          likesRepand: {
            _id: req.body.likesRepand,
          },
        }, //$pull reterai (-) dun valeur specifique
      }, //id de personne qui elle suivi
      { new: true },
      (err, data) => {
        if (!err) {
          res.status(201).json(data);
          console.log("bien supprimer");
        } else return res.status(400).json(err);
      }
    );
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};
//nbr like of repand
module.exports.getCountlikersRepand = async (req, res) => {
  const likes = await PostModel.findById(req.params.id, (err, date) => {
    if (!err) {
      //return res.status(200).send(date);
      console.log(date.likesRepand.length);
      const nbrlikesComnt = date.likesRepand.length;
      return res.json({ nbrlikesComnt: nbrlikesComnt });
    } else return res.status(400).send(err);
  }).select("likesRepand -_id");
  //return res.json({nbrlikes: likes});
};
// nbr  like of post
module.exports.getlikers = async (req, res) => {
  const likes = await PostModel.findById(req.params.id, (err, date) => {
    if (!err) {
      //return res.status(200).send(date);
      console.log(date.likers.length);
      const nbrlikes = date.likers.length;
      return res.json({ nbrlikes: nbrlikes });
    } else return res.status(400).send(err);
  }).select("likers -_id");
  //return res.json({nbrlikes: likes});
};
//nbr like of comment
module.exports.getCountLikeComment = async (req, res) => {
  const likes = await PostModel.findById(req.params.id, (err, date) => {
    if (!err) {
      //return res.status(200).send(date);
      console.log(date.likescomment.length);
      const nbrlikesComnt = date.likescomment.length;
      return res.json({ nbrlikesComnt: nbrlikesComnt });
    } else return res.status(400).send(err);
  }).select("likescomment -_id");
  //return res.json({nbrlikes: likes});
};
//count comment
module.exports.getCountComment = async (req, res) => {
  const comments = await PostModel.findById(req.params.id, (err, date) => {
    if (!err) {
      console.log(date.comments.length);
      const nbrcomments = date.comments.length;
      return res.json({ nbrcomments: nbrcomments });
    } else return res.status(400).send(err);
  }).select("comments -_id");
  //return res.json({nbrcomments: comments});
};
//share post
module.exports.sharePost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);
  try {
    await PostModel.findByIdAndUpdate(
      req.body.post,
      {
        $addToSet: {
          partage: {
            user: req.params.id,
            timestamp: new Date().getTime(),
          },
        },
      },
      { new: true, upsert: true },
      (err, docs) => {
        if (err) return res.status(400).send(err);
        else return res.status(200).send(docs);
      }
    );
  } catch (err) {
    return res.status(400).send(err);
  }
};
//tags amis
module.exports.tagAmi = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);
  try {
    await PostModel.findByIdAndUpdate(
      req.body.idPost,
      {
        $addToSet: {
          tags: {
            idPost: req.body.idPost,
            idUsersend: req.params.id,
            idUserReceve: req.body.idUserReceve,
            timestamp: new Date().getTime(),
          },
        },
      },
      { new: true },
      (err, docs) => {
        if (!err) res.status(200).send(docs);
        else return res.status(400).send(err);
      }
    );
  } catch (err) {
    return res.status(400).send(err);
  }
};
module.exports.AccesToPostPrive = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknow " + req.params.id);
  try {
    await PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $addToSet: {
          accestopost: req.body.iduser,
        },
      },
      { new: true, upsert: true },
      (err, data) => {
        if (!err) res.status(200).send({ data });
        else return res.status(400).send({ err });
      }
    );
  } catch (err) {
    return res.status(400).send({ err });
  }
};
module.exports.getALlPostPublic = async (req, res) => {
  PostModel.find({ visible: false }, function (err, ress) {
    if (!err) res.send(ress);
    else console.log("Error to get data : " + err);
  });
};
module.exports.getALlPostPrive = async (req, res) => {
  PostModel.find({ visible: true }, function (err, ress) {
    if (!err) res.send(ress);
    else console.log("Error to get data : " + err);
  });
};
module.exports.getAllPOst = async (req, res) => {
  const posts = await PostModel.find(); //afiicher touts les information des users sauf password
  res.status(200).json({ result: posts.length });
};
module.exports.getCountPostPArJour = async (req, res) => {
  try {
    // var todayDate = new Date().toISOString().slice(0, 10);
    var start = moment().subtract(24, "hours").toDate();
    //console.log(start)

    await PostModel.find(
      {
        createdAt: { $gte: start },
      },
      (err, countuser) => {
        if (err) res.status(401).json({ err });
        else return res.status(200).json({ result: countuser.length });
      }
    );
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};
module.exports.getCountPostPArSemaine = async (req, res) => {
  try {
    // var todayDate = new Date().toISOString().slice(0, 10);
    var start = moment().subtract(7, "days").toDate();
    console.log(start);
    await PostModel.find(
      {
        createdAt: { $gte: start },
      },
      (err, countuser) => {
        if (err) res.status(401).json({ err });
        else return res.status(200).json({ result: countuser.length });
      }
    );
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};
module.exports.getCountPostParMois = async (req, res) => {
  try {
    // var todayDate = new Date().toISOString().slice(0, 10);
    var start = moment().subtract(1, "months").toDate();
    console.log(start);

    await PostModel.find(
      {
        createdAt: { $gte: start },
      },
      (err, countuser) => {
        if (err) res.status(401).json({ err });
        else return res.status(200).json({ result: countuser.length });
      }
    );
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};
module.exports.getCountPostParTrimestre = async (req, res) => {
  try {
    // var todayDate = new Date().toISOString().slice(0, 10);
    var start = moment().subtract(3, "months").toDate();
    console.log(start);

    await PostModel.find(
      {
        createdAt: { $gte: start },
      },
      (err, countuser) => {
        if (err) res.status(401).json({ err });
        else return res.status(200).json({ result: countuser.length });
      }
    );
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};
module.exports.getCountPostParYears = async (req, res) => {
  try {
    // var todayDate = new Date().toISOString().slice(0, 10);
    var start = moment().subtract(1, "years").toDate();
    console.log(start);

    await PostModel.find(
      {
        createdAt: { $gte: start },
      },
      (err, countuser) => {
        if (err) res.status(401).json({ err });
        else return res.status(200).json({ result: countuser.length });
      }
    );
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};
