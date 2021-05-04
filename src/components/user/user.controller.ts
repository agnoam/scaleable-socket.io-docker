import { Request, Response } from "express";
import { ElasticSearchIndexes, ResponseStatus } from "../../utils/consts";
// import { UserModel, IUser } from './user.model';
import os from 'os';
import md5 from 'md5';
import { ServerRoot } from "../../server";

console.log("import app.controller");

export module UserCtrl {
    export function doPost_R(req: Request, res: Response): Response {
        return res.status(ResponseStatus.Ok).json({
            date: Date.now(),
            description: 'This is the date right now'
        });
    }

    export async function login_R(req: Request, res: Response): Promise<Response> {
        const reqBody: LoginRequestBody = req.body;
        if(reqBody.username && reqBody.password) {
            // Encrypting the password with md5
            const userData = await isLegit(reqBody.username, reqBody.password);
            if(userData) {
                return res.status(ResponseStatus.Ok).json({
                    s: userData
                });
            }
        }

        return res.status(ResponseStatus.BadRequest).json({
            description: 'Request must have username and password fields in body'
        });
    }

    export async function signUp_R(req: Request, res: Response): Promise<Response> {
        const userData = {
            username: req.body.username,
            password: md5(req.body.password),
            email: req.body.email,
            name: req.body.name
        }

        if(userData.username && userData.password && userData.email && userData.name) {
            try {
                // await ServerRoot.elasticService.create(ElasticSearchIndexes.Users, '', {

                // });

                return res.status(ResponseStatus.Ok).json({ description: 'User created successfuly' });
            } catch(ex) {
                console.error('Elasticsearch creation ex: ', ex);
            }
        }

        return res.status(ResponseStatus.InternalError).json({ description: 'Operation failed, please try again' });
    }

    export async function deleteUser_R(req: Request, res: Response): Promise<Response> {
        const userData: LoginRequestBody = req.body;

        try {
            // if(await isLegit(userData.username, userData.password)) {
            //     UserModel.remove({ username: userData.username });
            //     return res.status(ResponseStatus.Ok).json({
            //         description: 'User deleted successfuly'
            //     });
            // }
            
            return res.status(ResponseStatus.Ok).json({ 
                description: 'User credentials is not accurte, Please change and try again'
            });
        } catch(ex) {
            console.error(ex);
            return res.status(ResponseStatus.InternalError).json({
                description: 'There was an error, User delete did not happened'
            });
        }
    }

    async function isLegit(username: string, password: string): Promise<boolean> {
        try {
            // const userQuery: DocumentQuery<IUser, IUser> = UserModel.findOne({ username: username });
            // const userData: IUser = await userQuery.exec();

            // // Encrypting the password with md5
            // if(userData.password === md5(password)) {
            //     return userData;
            // }

            return true;
        } catch(ex) {
            console.error(`ex with querying mongodb: `, ex);
        }
    }

    export async function sendMessage_R(req: Request, res: Response): Promise<Response> {
        ServerRoot.io.sockets.emit('new-message', {
            message: `${req.body.message}`,
            nickname: req.body.nickname,
            server: os.hostname()
        });

        return res.status(ResponseStatus.Ok).json({
            description: 'Message sent successfuly',
            message: `${req.body.message}`,
            nickname: req.body.nickname,
            server: os.hostname()
        })
    }
}

interface LoginRequestBody {
    username: string;
    password: string;
}