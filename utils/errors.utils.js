module.exports.singUpErrors = (err)=>{
    //si pseudo ou email ou password nest pas vide
    let errors = {pseudo:''}; //let si declarer un objet errors
    if (err.message.includes('pseudo'))
        errors.pseudo="votre pseudo dépasse les 10 caractères autorisés ";
    if(err.code === 11000 && Object.keys(err.keyValue)[0].includes(("pseudo")))
        errors.pseudo="cette pseudo est deja pris";



    return errors;

}
module.exports.singInErrors = (err) =>{//err est lereur de catch dans le parametre
 let errors = {email:'',password:''}
 if(err.message.includes("email"))
     errors.email="Aucun compte n'est associé à ce mail , merci de le vérifier";
 if( err.message.includes("password")){
     errors.email="Votre mail et votre mot de passe ne correspondent pas,";
     errors.password="merci de les vérifier";

 }

 return errors;





}
module.exports.EventProPrixSoloDuoErrors=(err)=>{
    let errors={prixsolo:'',prixduo:''}
    if (err.message.includes("prixsolo"))
        errors.prixsolo="prix solo minimum 5€ sinon le chiffre n’est pas valider";
    if (err.message.includes("prixduo"))
        errors.prixduo="prix duo minimum 5€ sinon le chiffre n’est pas valider";
    return errors;

}