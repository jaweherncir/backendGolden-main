const JumlageModel= require("../models/jumlage.model");
const userModel = require("../models/user.model");
const InvitationController = require("./invitation.controller");
const ObjectID = require("mongoose").Types.ObjectId;


 async function getUserjumleParID(id){

        const user =   await  userModel.findById(id, (err,data)=>{}).select('_id pseudo email nomfamille prenom nom' +
            ' datenass pays ville numero typerelation photo picture');
        if (user)
            return user;
        else
            throw Error('user indefined');


}
module.exports.createJumlage=async (req,res) => {
    if (!ObjectID.isValid(req.body.userdemande) || !ObjectID.isValid(req.body.useraccept))
        return res.status(400).send("ID unknow : "+req.params.id);
   // const userdemande= await getUserjumleParID(req.params.id);
    //const useraccept= await getUserjumleParID(req.body.id);
    const newjumlage= new JumlageModel({
        userdemandejum:req.body.userdemande,
        useracceptjum:req.body.useraccept
    });
    try {

        const jumlage= await newjumlage.save();
        if (jumlage){
            return res.status(200).json(jumlage);
            //suprimernotifsJumlage(req.body.id,req.params.id);
            //InvitationController.refuseDemandeJumlage(req,res);

        }



        /*res.status(200).send({user1:{userdemande},user2:{useraccept}});
        console.log(userdemande.email);
        console.log(useraccept.email);*/
    }catch(err){
        res.status(400).send({eroors:err});
    }

}
module.exports.DeleteUserDuo= async (req,res) =>{
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("Id unknow : "+req.params.id);
    try {
        await JumlageModel.findByIdAndRemove(
            req.params.id,
            (err,data)=>{
                if(!err)
                    res.status(200).send(data);
                else
                   res.status(400).send({err});
            }

        );

    }catch (err){
        res.status(400).send({err});

    }

}
module.exports.getJumlageByID=async (req,res)=>{
    if (!ObjectID.isValid(req.params.id))//tester si le id est connu de la base de donne
        return res.status(400).send('ID unknown : '+ req.params.id);
    JumlageModel.findById(req.params.id, (err,data)=>{
        if(!err)
            res.send(data);
        else
            console.log('ID unknow : '+err);

    }).sort({dateTime:1})
        .populate({path:'userdemandejum',select:['nom','prenom','photo','couvertir','dateNass','genre']})
        .populate({path:'useracceptjum',select:['nom','prenom','photo','couvertir','dateNass','genre']});

}
module.exports.getAllCompteDuo= async (req,res) =>{
    const users = await JumlageModel.find();//afiicher touts les information des users sauf password
    res.status(200).json({result:users.length});

}