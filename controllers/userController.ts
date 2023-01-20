import { Router } from "express";
import { Application } from "express";
import { User } from "../database/connect";
import { ApiException } from "../types/exception";
import { userTypes, userId } from "../types/user";
import {  ValidationError } from "sequelize";
import bcrypt from "bcrypt"


export const usersController = Router();
/**
 * @swagger
 * tags:
 *      name: Users
 *      description: Manage users
 */

/**
 * @openapi
 * /api/users:
 *   get:
 *      tags: [Users]
 *      description: Welcome to swagger-jsdoc!
 *      responses:
 *        200:
 *          description: Get the list of all users.
 */
usersController.get("/", async (req, res) => {
    User.findAll({
        attributes: {exclude: ['password']}
    })
        .then((users: userTypes) => {
            res.status(200).json(users)
        })
        .catch((error: ApiException) => {
            res.status(500).json(error)
        })
})



/**
  * @openapi
  * /api/users:
  *  post:
  *      tags: [Users]
  *      description: Add an user
  *      consumes:
  *       - application/json
  *      parameters:
  *       - name: JSON
  *         in: body
  *         required: true
  *         type: object
  *         default: { "pseudo": "string","pwd":"string","prenom": "string","nom": "string","birthday": "date","email": "email","bio": "string" }
  *      responses:
  *        200:
  *          description: Create a new user.
  */
 
usersController.post("/", async (req, res) => {
      const { pseudo, prenom, nom, bio, birthday, email } = req.body
  
      if (!req.body.pwd) return res.status(400).json({passwordRequired: true,message : 'Password is required.'})
  
      let hashedPassword = await bcrypt.hash(req.body.pwd, 10);
      User.create({ 
        pseudo : pseudo, 
          pwd : hashedPassword, 
          prenom : prenom, 
          bio: bio,
          nom : nom, 
          birthday : birthday, 
          email : email, 
      }).then((user: userTypes) => {
          const message: string = `User ${pseudo} successfully created.`;
          res.json({ message, data: user });
          })
          .catch((error : ApiException) => {
          if(error instanceof ValidationError){
              return res.status(400).json({message: error.message, data : error})
          }
          const message = `Could not create new user.`
          res.status(500).json({message, data : error})
      })
    });


/**
  * @openapi
  * /api/users/{id}:
  *  delete:
  *      tags: [Users]
  *      description: Delete an template
  *      parameters:
  *       - name: id
  *         in: path
  *         required: true
  *         type: integer
  *      responses:
  *        200:
  *          description: Delete an user. 
  */
usersController.delete("/:id", (req, res) => {
    User.findByPk(req.params.id).then((user: userId) => {
        if (user === null) {
            const message = "L'utilisateur n'existe pas."
            return res.status(404).json({ message: message })
        }

        const userDeleted = user;
        return User.destroy({
            where: { id: user.id }
        })
            .then(() => {
                const message = `Utilisateur ${userDeleted.id} supprimé avec succes.`
                res.json({ message, data: userDeleted })
            })
    })
        .catch((error: ApiException) => {
            const message = `Echec lors de la suppression de l'Utilisateur`;
            res.status(500).json({ message, data: error });
        });
})

/**
 * @openapi
 * /api/users/{id}:
 *  get:
 *      tags: [Users]
 *      description: Get an template by id
 *      parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: integer
 *         default: 1
 *      responses:
 *        200:
 *          description: Get the user of given id.
 */
usersController.get('/:id', async (req, res) => {
    User.findByPk(req.params.id, {attributes: {exclude: ['password']}})
        .then((user: userTypes) => {
            if (user === null) {
                const message = "L'utilisateur n'existe pas."
                return res.status(404).json({ message })
            }

            const message: string = 'Utilisateur trouvé.'
            res.json({ message, data: user })
        })
        .catch((error: ApiException) => {
            const message = "Echec Utilisateur non trouvé."
            res.status(500).json({ message, data: error })
        })
})

/**
  * @openapi
  * /api/users/{id}:
  *  put:
  *      tags: [Users]
  *      description: Update an template
  *      consumes:
  *       - application/json
  *      parameters:
  *       - name: id
  *         in: path
  *         required: true
  *         type: integer
  *         default: 1
  *       - name: JSON
  *         in: body
  *         required: true
  *         type: object
  *         default: { "pseudo": "string","pwd":"string","prenom": "string","nom": "string","birthday": "date","email": "email","bio": "string" }
  *      responses:
  *        200:
  *          description: Update the user of given id.
  */
usersController.put('/:id', async (req, res) => {
    const id = req.params.id;
    const { pseudo, nom, prenom, birthday, bio, email } = req.body
    if (!req.body.pwd) return res.status(400).json({ passwordRequired: true, message: 'Besoin d\'un mot de passe.' })

    let hashedPassword = await bcrypt.hash(req.body.pwd, 10);
    User.update({
        pseudo : pseudo, 
        pwd : hashedPassword, 
        prenom : prenom, 
        nom : nom, 
        birthday : birthday, 
        bio : bio,
        email : email
    }, {
        where: { id: id },
    })
        .then(() => {
            return User.findByPk(id).then((user: userTypes) => {
                if (user === null) {
                    const message = "L'utilisateur n'existe pas."
                    return res.status(404).json({ message })
                }
                const message = `Utilisateur mis à jour`;
                res.json({ message, data: user });
            })
        })
        .catch((error: ApiException) => {
            if (error instanceof ValidationError) {
                return res.status(400).json({ message: error.message, data: error })
            }
            const message = `Echec lors de la mise à jour de l'utilisateur.`;
            res.status(500).json({ message, data: error });
        });
})
