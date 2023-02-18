export interface userTypes{
    prenom : string;
    nom : string;
    pseudo : string;
    pwd : string;
    email : string;
    bio : string;
    birthday : Date;
}

export interface userId extends userTypes {

    id: number;
  
  }

