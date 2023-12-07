const ObjectID = require("mongoose").Types.ObjectId;
const RencontreModel= require("../models/Rencontre.model");
const UserModel = require("../models/user.model");
const userModel = require("../models/user.model");

module.exports.ActiviteCompte= async (req,res) =>{
    if (!ObjectID.isValid(req.params.id) )
        return res.status(400).send('ID unknown '+req.params.id);
    try {
        await RencontreModel.findOneAndUpdate(
            {userID:req.params.id},
            //id d personne qui faire labonne
            {
                $set : {
                    Activite:{
                        libre:req.body.libre,
                        certification:req.body.certification,
                        enligne:req.body.enligne,
                        typecompte:req.body.typecompte
                    }
                } //$pull reterai (-) dun valeur specifique denattribut following
            }, //id de personne qui elle suivi
            {new :true , upsert: true},
            (err,data) =>{
                if(!err)
                    return res.status(201).json(data);
                else return res.status(400).json(err);

            }

        );

    }catch (err){
        return res.status(400).json({message:err});


    }


}
module.exports.InfoGeneraleDomainePro= async (req,res) =>{
    if (!ObjectID.isValid(req.params.id) )
        return res.status(400).send('ID unknown '+req.params.id);
    try {
        await RencontreModel.findOneAndUpdate(
            {userID:req.params.id},
            //id d personne qui faire labonne
            {
                $set : {
                    "Infos.DomainePro":req.body.domainepro


                } //$pull reterai (-) dun valeur specifique denattribut following
            }, //id de personne qui elle suivi
            {new :true , upsert: true},
            (err,data) =>{
                if(!err)
                    return res.status(201).json(data);
                else return res.status(400).json(err);

            }

        );

    }catch (err){
        return res.status(400).json({message:err});
        
    }


}
module.exports.InfoGeneraleAge= async (req,res) =>{
    if (!ObjectID.isValid(req.params.id) )
        return res.status(400).send('ID unknown '+req.params.id);
    try {
        await RencontreModel.findOneAndUpdate(
            {userID:req.params.id},
            //id d personne qui faire labonne
            {
                $set : {
                    "Infos.Age":req.body.age
                } //$pull reterai (-) dun valeur specifique denattribut following
            }, //id de personne qui elle suivi
            {new :true , upsert: true},
            (err,data) =>{
                if(!err)
                    return res.status(201).json(data);
                else return res.status(400).json(err);

            }

        );

    }catch (err){
        return res.status(400).json({message:err});


    }


}
module.exports.InfoGeneraleGenre= async (req,res) =>{
    if (!ObjectID.isValid(req.params.id) )
        return res.status(400).send('ID unknown '+req.params.id);
    try {
        await RencontreModel.findOneAndUpdate(
            {userID:req.params.id},
            //id d personne qui faire labonne
            {
                $set : {
                    "Infos.Genre":req.body.genre
                } //$pull reterai (-) dun valeur specifique denattribut following
            }, //id de personne qui elle suivi
            {new :true , upsert: true},
            (err,data) =>{
                if(!err)
                    return res.status(201).json(data);
                else return res.status(400).json(err);

            }

        );

    }catch (err){
        return res.status(400).json({message:err});


    }


}
module.exports.InfoGeneraleOrientationSexuelle= async (req,res) =>{
    if (!ObjectID.isValid(req.params.id) )
        return res.status(400).send('ID unknown '+req.params.id);
    try {
        await RencontreModel.findOneAndUpdate(
            {userID:req.params.id},
            //id d personne qui faire labonne
            {
                $set : {
                    "Infos.OrientationSexuelle":req.body.orientationsexe
                } //$pull reterai (-) dun valeur specifique denattribut following
            }, //id de personne qui elle suivi
            {new :true , upsert: true},
            (err,data) =>{
                if(!err)
                    return res.status(201).json(data);
                else return res.status(400).json(err);

            }

        );

    }catch (err){
        return res.status(400).json({message:err});


    }
}
module.exports.InfoGeneraleOrigine= async (req,res) =>{
    if (!ObjectID.isValid(req.params.id) )
        return res.status(400).send('ID unknown '+req.params.id);
    try {
        await RencontreModel.findOneAndUpdate(
            {userID:req.params.id},
            //id d personne qui faire labonne
            {
                $set : {
                    "Infos.Origine":req.body.origine
                } //$pull reterai (-) dun valeur specifique denattribut following
            }, //id de personne qui elle suivi
            {new :true , upsert: true},
            (err,data) =>{
                if(!err)
                    return res.status(201).json(data);
                else return res.status(400).json(err);

            }

        );

    }catch (err){
        return res.status(400).json({message:err});


    }


}
module.exports.InfoGeneraleSigneZodiacale= async (req,res) =>{
    if (!ObjectID.isValid(req.params.id) )
        return res.status(400).send('ID unknown '+req.params.id);
    try {
        await RencontreModel.findOneAndUpdate(
            {userID:req.params.id},
            //id d personne qui faire labonne
            {
                $set : {
                    "Infos.SigneZodiacale":req.body.signezodiacale
                } //$pull reterai (-) dun valeur specifique denattribut following
            }, //id de personne qui elle suivi
            {new :true , upsert: true},
            (err,data) =>{
                if(!err)
                    return res.status(201).json(data);
                else return res.status(400).json(err);

            }

        );

    }catch (err){
        return res.status(400).json({message:err});


    }

}
module.exports.LocalisationRayon= async (req,res) =>{
    if (!ObjectID.isValid(req.params.id) )
        return res.status(400).send('ID unknown '+req.params.id);
    try {
        await RencontreModel.findOneAndUpdate(
            {userID:req.params.id},
            //id d personne qui faire labonne
            {
                $set : {
                    "Localisation.Rayon":req.body.rayon
                } //$pull reterai (-) dun valeur specifique denattribut following
            }, //id de personne qui elle suivi
            {new :true , upsert: true},
            (err,data) =>{
                if(!err)
                    return res.status(201).json(data);
                else return res.status(400).json(err);

            }

        );

    }catch (err){
        return res.status(400).json({message:err});


    }


}
module.exports.LocalisationLocalite= async (req,res) =>{
    if (!ObjectID.isValid(req.params.id) )
        return res.status(400).send('ID unknown '+req.params.id);
    try {
        await RencontreModel.findOneAndUpdate(
            {userID:req.params.id},
            //id d personne qui faire labonne
            {
                $set : {
                    "Localisation.Localite":{
                        pays:req.body.pays,
                        ville:req.body.ville,
                        Region:req.body.region
                    }
                } //$pull reterai (-) dun valeur specifique denattribut following
            }, //id de personne qui elle suivi
            {new :true , upsert: true},
            (err,data) =>{
                if(!err)
                    return res.status(201).json(data);
                else return res.status(400).json(err);

            }

        );

    }catch (err){
        return res.status(400).json({message:err});


    }
}
module.exports.ValeursEtRecherchesValeures= async (req,res) =>{
    if (!ObjectID.isValid(req.params.id) )
        return res.status(400).send('ID unknown '+req.params.id);
    try {
        await RencontreModel.findOneAndUpdate(
            {userID:req.params.id},
            //id d personne qui faire labonne
            {
                $set : {
                    "ValeursEtRecherches.valeurs":req.body.valeurs
                } //$pull reterai (-) dun valeur specifique denattribut following
            }, //id de personne qui elle suivi
            {new :true , upsert: true},
            (err,data) =>{
                if(!err)
                    return res.status(201).json(data);
                else return res.status(400).json(err);

            }

        );

    }catch (err){
        return res.status(400).json({message:err});


    }


}
module.exports.ValeursEtRecherchesRelations= async (req,res) =>{
    if (!ObjectID.isValid(req.params.id) )
        return res.status(400).send('ID unknown '+req.params.id);
    try {
        await RencontreModel.findOneAndUpdate(
            {userID:req.params.id},
            //id d personne qui faire labonne
            {
                $set : {
                    "ValeursEtRecherches.Relations":req.body.relatiions
                } //$pull reterai (-) dun valeur specifique denattribut following
            }, //id de personne qui elle suivi
            {new :true , upsert: true},
            (err,data) =>{
                if(!err)
                    return res.status(201).json(data);
                else return res.status(400).json(err);

            }

        );

    }catch (err){
        return res.status(400).json({message:err});


    }


}
module.exports.ApparenceTaille= async (req,res) =>{
    if (!ObjectID.isValid(req.params.id) )
        return res.status(400).send('ID unknown '+req.params.id);
    try {
        await RencontreModel.findOneAndUpdate(
            {userID:req.params.id},
            //id d personne qui faire labonne
            {
                $set : {
                    "Apparence.taille":req.body.taille
                } //$pull reterai (-) dun valeur specifique denattribut following
            }, //id de personne qui elle suivi
            {new :true , upsert: true},
            (err,data) =>{
                if(!err)
                    return res.status(201).json(data);
                else return res.status(400).json(err);

            }

        );

    }catch (err){
        return res.status(400).json({message:err});


    }


}
module.exports.ApparenceSilhouette= async (req,res) =>{
    if (!ObjectID.isValid(req.params.id) )
        return res.status(400).send('ID unknown '+req.params.id);
    try {
        await RencontreModel.findOneAndUpdate(
            {userID:req.params.id},
            //id d personne qui faire labonne
            {
                $set : {
                    "Apparence.silhouette":req.body.silhouette
                } //$pull reterai (-) dun valeur specifique denattribut following
            }, //id de personne qui elle suivi
            {new :true , upsert: true},
            (err,data) =>{
                if(!err)
                    return res.status(201).json(data);
                else return res.status(400).json(err);

            }

        );

    }catch (err){
        return res.status(400).json({message:err});


    }


}

module.exports.ApparenceYeux= async (req,res) =>{
    if (!ObjectID.isValid(req.params.id) )
        return res.status(400).send('ID unknown '+req.params.id);
    try {
        await RencontreModel.findOneAndUpdate(
            {userID:req.params.id},
            //id d personne qui faire labonne
            {
                $set : {
                    "Apparence.yeux":req.body.yeux
                } //$pull reterai (-) dun valeur specifique denattribut following
            }, //id de personne qui elle suivi
            {new :true , upsert: true},
            (err,data) =>{
                if(!err)
                    return res.status(201).json(data);
                else return res.status(400).json(err);

            }

        );

    }catch (err){
        return res.status(400).json({message:err});


    }


}

module.exports.ApparenceCheveux= async (req,res) =>{
    if (!ObjectID.isValid(req.params.id) )
        return res.status(400).send('ID unknown '+req.params.id);
    try {
        await RencontreModel.findOneAndUpdate(
            {userID:req.params.id},
            //id d personne qui faire labonne
            {
                $set : {
                    "Apparence.cheveux":req.body.cheveux
                } //$pull reterai (-) dun valeur specifique denattribut following
            }, //id de personne qui elle suivi
            {new :true , upsert: true},
            (err,data) =>{
                if(!err)
                    return res.status(201).json(data);
                else return res.status(400).json(err);

            }

        );

    }catch (err){
        return res.status(400).json({message:err});


    }


}
module.exports.ApparencePilositeCorporelle= async (req,res) =>{
    if (!ObjectID.isValid(req.params.id) )
        return res.status(400).send('ID unknown '+req.params.id);
    try {
        await RencontreModel.findOneAndUpdate(
            {userID:req.params.id},
            //id d personne qui faire labonne
            {
                $set : {
                    "Apparence.pilositeCorporelle":req.body.pilositecorporelle
                } //$pull reterai (-) dun valeur specifique denattribut following
            }, //id de personne qui elle suivi
            {new :true , upsert: true},
            (err,data) =>{
                if(!err)
                    return res.status(201).json(data);
                else return res.status(400).json(err);

            }

        );

    }catch (err){
        return res.status(400).json({message:err});


    }


}
module.exports.ApparencePilositeFaciale= async (req,res) =>{
    if (!ObjectID.isValid(req.params.id) )
        return res.status(400).send('ID unknown '+req.params.id);
    try {
        await RencontreModel.findOneAndUpdate(
            {userID:req.params.id},
            //id d personne qui faire labonne
            {
                $set : {
                    "Apparence.pilositeFaciale":req.body.pilositefaciale
                } //$pull reterai (-) dun valeur specifique denattribut following
            }, //id de personne qui elle suivi
            {new :true , upsert: true},
            (err,data) =>{
                if(!err)
                    return res.status(201).json(data);
                else return res.status(400).json(err);

            }

        );

    }catch (err){
        return res.status(400).json({message:err});


    }


}
module.exports.DetailsPhysiqueTatouage= async (req,res) =>{
    if (!ObjectID.isValid(req.params.id) )
        return res.status(400).send('ID unknown '+req.params.id);
    try {
        await RencontreModel.findOneAndUpdate(
            {userID:req.params.id},
            //id d personne qui faire labonne
            {
                $set : {
                    "DetailsPhysique.Tatouage":req.body.tatouage
                } //$pull reterai (-) dun valeur specifique denattribut following
            }, //id de personne qui elle suivi
            {new :true , upsert: true},
            (err,data) =>{
                if(!err)
                    return res.status(201).json(data);
                else return res.status(400).json(err);

            }

        );

    }catch (err){
        return res.status(400).json({message:err});


    }


}
module.exports.DetailsPhysiquePiercingCorporel= async (req,res) =>{
    if (!ObjectID.isValid(req.params.id) )
        return res.status(400).send('ID unknown '+req.params.id);
    try {
        await RencontreModel.findOneAndUpdate(
            {userID:req.params.id},
            //id d personne qui faire labonne
            {
                $set : {
                    "DetailsPhysique.PiercingCorporel":req.body.piercingcorporel
                } //$pull reterai (-) dun valeur specifique denattribut following
            }, //id de personne qui elle suivi
            {new :true , upsert: true},
            (err,data) =>{
                if(!err)
                    return res.status(201).json(data);
                else return res.status(400).json(err);

            }

        );

    }catch (err){
        return res.status(400).json({message:err});


    }


}
module.exports.DetailsPhysiquePiercingFacial= async (req,res) =>{
    if (!ObjectID.isValid(req.params.id) )
        return res.status(400).send('ID unknown '+req.params.id);
    try {
        await RencontreModel.findOneAndUpdate(
            {userID:req.params.id},
            //id d personne qui faire labonne
            {
                $set : {
                    "DetailsPhysique.PiercingFacial":req.body.piercingfaciale
                } //$pull reterai (-) dun valeur specifique denattribut following
            }, //id de personne qui elle suivi
            {new :true , upsert: true},
            (err,data) =>{
                if(!err)
                    return res.status(201).json(data);
                else return res.status(400).json(err);

            }

        );

    }catch (err){
        return res.status(400).json({message:err});


    }


}
module.exports.PersonnaliteSociabilite= async (req,res) =>{
    if (!ObjectID.isValid(req.params.id) )
        return res.status(400).send('ID unknown '+req.params.id);
    try {
        await RencontreModel.findOneAndUpdate(
            {userID:req.params.id},
            //id d personne qui faire labonne
            {
                $set : {
                    "Personnalite.Sociabilite":req.body.sociabilite
                } //$pull reterai (-) dun valeur specifique denattribut following
            }, //id de personne qui elle suivi
            {new :true , upsert: true},
            (err,data) =>{
                if(!err)
                    return res.status(201).json(data);
                else return res.status(400).json(err);

            }

        );

    }catch (err){
        return res.status(400).json({message:err});


    }


}
module.exports.PersonnaliteTemperament= async (req,res) =>{
    if (!ObjectID.isValid(req.params.id) )
        return res.status(400).send('ID unknown '+req.params.id);
    try {
        await RencontreModel.findOneAndUpdate(
            {userID:req.params.id},
            //id d personne qui faire labonne
            {
                $set : {
                    "Personnalite.Temperament":req.body.temperament
                } //$pull reterai (-) dun valeur specifique denattribut following
            }, //id de personne qui elle suivi
            {new :true , upsert: true},
            (err,data) =>{
                if(!err)
                    return res.status(201).json(data);
                else return res.status(400).json(err);

            }

        );

    }catch (err){
        return res.status(400).json({message:err});


    }


}
module.exports.PersonnaliteCaractere= async (req,res) =>{
    if (!ObjectID.isValid(req.params.id) )
        return res.status(400).send('ID unknown '+req.params.id);
    try {
        await RencontreModel.findOneAndUpdate(
            {userID:req.params.id},
            //id d personne qui faire labonne
            {
                $set : {
                    "Personnalite.Caractere":req.body.caractere
                } //$pull reterai (-) dun valeur specifique denattribut following
            }, //id de personne qui elle suivi
            {new :true , upsert: true},
            (err,data) =>{
                if(!err)
                    return res.status(201).json(data);
                else return res.status(400).json(err);

            }

        );

    }catch (err){
        return res.status(400).json({message:err});


    }


}
module.exports.HabitudeRythmeDeSoir= async (req,res) =>{
    if (!ObjectID.isValid(req.params.id) )
        return res.status(400).send('ID unknown '+req.params.id);
    try {
        await RencontreModel.findOneAndUpdate(
            {userID:req.params.id},
            //id d personne qui faire labonne
            {
                $set : {
                    "Habitude.RythmeDeSoir":req.body.rythme
                } //$pull reterai (-) dun valeur specifique denattribut following
            }, //id de personne qui elle suivi
            {new :true , upsert: true},
            (err,data) =>{
                if(!err)
                    return res.status(201).json(data);
                else return res.status(400).json(err);

            }

        );

    }catch (err){
        return res.status(400).json({message:err});


    }


}
module.exports.HabitudeAlcool= async (req,res) =>{
    if (!ObjectID.isValid(req.params.id) )
        return res.status(400).send('ID unknown '+req.params.id);
    try {
        await RencontreModel.findOneAndUpdate(
            {userID:req.params.id},
            //id d personne qui faire labonne
            {
                $set : {
                    "Habitude.Alcool":req.body.alcool
                } //$pull reterai (-) dun valeur specifique denattribut following
            }, //id de personne qui elle suivi
            {new :true , upsert: true},
            (err,data) =>{
                if(!err)
                    return res.status(201).json(data);
                else return res.status(400).json(err);

            }

        );

    }catch (err){
        return res.status(400).json({message:err});


    }


}
module.exports.HabitudeCigarette= async (req,res) =>{
    if (!ObjectID.isValid(req.params.id) )
        return res.status(400).send('ID unknown '+req.params.id);
    try {
        await RencontreModel.findOneAndUpdate(
            {userID:req.params.id},
            //id d personne qui faire labonne
            {
                $set : {
                    "Habitude.Cigarette":req.body.cigarette
                } //$pull reterai (-) dun valeur specifique denattribut following
            }, //id de personne qui elle suivi
            {new :true , upsert: true},
            (err,data) =>{
                if(!err)
                    return res.status(201).json(data);
                else return res.status(400).json(err);

            }

        );

    }catch (err){
        return res.status(400).json({message:err});


    }


}
module.exports.HabitudeRegimeAlimentaire= async (req,res) =>{
    if (!ObjectID.isValid(req.params.id) )
        return res.status(400).send('ID unknown '+req.params.id);
    try {
        await RencontreModel.findOneAndUpdate(
            {userID:req.params.id},
            //id d personne qui faire labonne
            {
                $set : {
                    "Habitude.RegimeAlimentaire":req.body.regime
                } //$pull reterai (-) dun valeur specifique denattribut following
            }, //id de personne qui elle suivi
            {new :true , upsert: true},
            (err,data) =>{
                if(!err)
                    return res.status(201).json(data);
                else return res.status(400).json(err);

            }

        );

    }catch (err){
        return res.status(400).json({message:err});


    }


}
module.exports.HabitudeHobbies= async (req,res) =>{
    if (!ObjectID.isValid(req.params.id) )
        return res.status(400).send('ID unknown '+req.params.id);
    try {
        await RencontreModel.findOneAndUpdate(
            {userID:req.params.id},
            //id d personne qui faire labonne
            {
                $set : {
                    "Habitude.Hobbies":req.body.hobbies
                } //$pull reterai (-) dun valeur specifique denattribut following
            }, //id de personne qui elle suivi
            {new :true , upsert: true},
            (err,data) =>{
                if(!err)
                    return res.status(201).json(data);
                else return res.status(400).json(err);

            }

        );

    }catch (err){
        return res.status(400).json({message:err});


    }


}
module.exports.HabitudeGoutsMusicaux= async (req,res) =>{
    if (!ObjectID.isValid(req.params.id) )
        return res.status(400).send('ID unknown '+req.params.id);
    try {
        await RencontreModel.findOneAndUpdate(
            {userID:req.params.id},
            //id d personne qui faire labonne
            {
                $set : {
                    "Habitude.GoutsMusicaux":req.body.musique
                } //$pull reterai (-) dun valeur specifique denattribut following
            }, //id de personne qui elle suivi
            {new :true , upsert: true},
            (err,data) =>{
                if(!err)
                    return res.status(201).json(data);
                else return res.status(400).json(err);

            }

        );

    }catch (err){
        return res.status(400).json({message:err});


    }
}
module.exports.getALLProfileLibre=async (req,res)=>{
    try{
        const user=await UserModel.find(
            {libre: true}).select("-password")
        res.status(200).json(user);
    }
    catch (err)
    {
        return res.status(500).json({message: err});

    }
}
module.exports.TrierParLocalisationAutourDeMoiASC= async (req,res) =>{
    try {
       await RencontreModel.find({}).sort({'Localisation.Rayon': 1})
           .exec((err,rencontretri)=>{
            if(!err)
                res.status(201).json(rencontretri);
            else return res.status(400).json(err);
        });
    }catch(err){
        return res.status(401).json(err);
    }

}
module.exports.TrierParLocalisationAutourDeMoiDESC= async (req,res) =>{
    try {
        await RencontreModel.find({}).sort({'Localisation.Rayon': -1})
            .exec((err,rencontretri)=>{
                if(!err)
                    res.status(201).json(rencontretri);
                else return res.status(400).json(err);
            });
    }catch(err){
        return res.status(401).json(err);
    }

}
module.exports.TrierParAgeASC= async (req,res) =>{
    try {
        await RencontreModel.find({}).sort({'Infos.Age': 1})
            .exec((err,rencontretri)=>{
                if(!err)
                    res.status(201).json(rencontretri);
                else return res.status(400).json(err);
            });
    }catch(err){
        return res.status(401).json(err);
    }

}
module.exports.TrierParAgeDESC= async (req,res) =>{
    try {
        await RencontreModel.find({}).sort({'Infos.Age': -1})
            .exec((err,rencontretri)=>{
                if(!err)
                    res.status(201).json(rencontretri);
                else return res.status(400).json(err);
            });
    }catch(err){
        return res.status(401).json(err);
    }

}
module.exports.TrierParDateInscriASC= async (req,res) =>{
    try {
        await RencontreModel.find({}).sort({createdAt: 1})
            .exec((err,rencontretri)=>{
                if(!err)
                    res.status(201).json(rencontretri);
                else return res.status(400).json(err);
            });
    }catch(err){
        return res.status(401).json(err);
    }

}
module.exports.TrierParDateInscriDESC= async (req,res) =>{
    try {
        await RencontreModel.find({}).sort({createdAt: -1})
            .exec((err,rencontretri)=>{
                if(!err)
                    res.status(201).json(rencontretri);
                else return res.status(400).json(err);
            });
    }catch(err){
        return res.status(401).json(err);
    }

}
module.exports.RencontreInfo= async (req,res) =>{
    //console.log(req.params);
    if (!ObjectID.isValid(req.params.id))//tester si le id est connu de la base de donne
        return res.status(400).send('ID unknown : '+ req.params.id);

    await RencontreModel.findById(req.params.id, (err,rencontre)=>{
        if(!err)
            res.send(rencontre);
        else
            console.log('ID unknow : '+err);

    });
}






