const PageProModel= require("../models/pagepro.model");
const fs = require("fs");
const ObjectID = require("mongoose").Types.ObjectId;
module.exports.createPagePro = async (req, res) => {
    const newPagePro = new PageProModel({
        nom: req.body.nom,
        categories:{
            categorie:req.body.categorie,
            souscategorie:req.body.souscategorie
        },
        information:{
            email:req.body.email,
            adressesite:req.body.adressesite
        },
        pourboire: req.body.pourboire,
        messagerie:req.body.messagerie,
        visibilite: req.body.visibilite,
        localisation: req.body.localisation,
    });

    try {
        const pagepro = await newPagePro.save();
        return res.status(201).json(pagepro);
    } catch (err) {
        return res.status(400).send(err);
    }
};
module.exports.createPageProInformations = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)  )
        return res.status(400).send('ID unknown '+req.params.id);
    try {
        await PageProModel.findByIdAndUpdate(
            {_id:req.params.id},
            //id d personne qui faire labonne
            {
                $set : {
                    informations:req.body.informations

                } //$pull reterai (-) dun valeur specifique denattribut following
            }, //id de personne qui elle suivi
            {new :true , upsert: true},
            (err,eventpro) =>{
                if(!err)
                    return res.status(201).json(eventpro);
                else return res.status(400).json(err);

            }

        );

    }catch (err){
        return res.status(400).json({message:err});

    }

}
module.exports.createPageProPhotoBaniere=async (req,res)=>{
    if (!ObjectID.isValid(req.params.id))//tester si le id est connu de la base de donne
        return res.status(400).send('ID unknown : '+ req.params.id);
    try {
        await PageProModel.findByIdAndUpdate(
            {_id:req.params.id},
            {
                $set: {
                    banniere:{
                        data:fs.readFileSync("client/pagepro/baniere/"+req.file.filename),
                        contentType:"image/jpg",
                        timestamp:new Date().getTime()
                    }

                }
            },
            {new: true, upsert: true, setDefaultsOnInsert:true},
            (err,data) =>{
                if (!err) return res.send(data);
                if (err) return  res.status(500).send({message: err});
            }
        )
    }catch(err) {

        return res.status(500).json({message: err});
    }


}
module.exports.createPageProPhotoAvatar=async (req,res)=>{
    if (!ObjectID.isValid(req.params.id))//tester si le id est connu de la base de donne
        return res.status(400).send('ID unknown : '+ req.params.id);
    try {
        await PageProModel.findByIdAndUpdate(
            {_id:req.params.id},
            {
                $set: {
                    avatar:{
                        data:fs.readFileSync("client/pagepro/avatar/"+req.file.filename),
                        contentType:"image/jpg",
                        timestamp:new Date().getTime()
                    }

                }
            },
            {new: true, upsert: true, setDefaultsOnInsert:true},
            (err,data) =>{
                if (!err) return res.send(data);
                if (err) return  res.status(500).send({message: err});
            }
        )
    }catch(err) {

        return res.status(500).json({message: err});
    }


}

module.exports.getAllPagePRo = async (req, res) => {
    const pagepro = await PageProModel.find();
    res.status(200).json(pagepro);
};
module.exports.getPagePRoByid = async (req, res) => {
    const pagepro = await PageProModel.find({_id:req.params.id});
    res.status(200).json(pagepro);
};
module.exports.deletePagePro = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID unknown : " + req.params.id);

    try {
        // await PageProModel.remove({ _id: req.params.id }).exec();
        // res.status(200).json({ message: "Successfully deleted. " });
        await PageProModel.deleteOne({_id:req.params.id}).then(function (){
            res.status(200).json({ message: "Successfully deleted. " });
        }).catch(function (err){
            console.log(err)
            return res.status(400).send(err);

        })
    } catch (err) {
        return res.status(500).json({ message: err });
    }
};