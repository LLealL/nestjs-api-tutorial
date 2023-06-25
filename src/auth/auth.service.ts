import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

@Injectable()
export class AuthService{
    constructor(private prisma: PrismaService){}
    
    async signup(dto: AuthDto){
        //gerar hash de password
        const hash = await argon.hash(dto.password);
        //salvar usuario no db
        try{
            const user = await this.prisma.user.create({
                data:{
                    email: dto.email,
                    hash,
                },
            });
        

            delete user.hash;
            //retornar usuario

            return user;
        }catch(error){
            if(error instanceof PrismaClientKnownRequestError){
                if(error.code == 'P2002'){
                    throw new ForbiddenException('Credentials taken');
                }
            }
            throw error;
        }
    }

    async signin(dto: AuthDto){
        //encontrar usuario por email
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            },
        });

        //se usuario nao existir lancar exception
        if(!user) throw new ForbiddenException('Credentials Incorrect',);

        //comparar senha
        const pwMatches = await argon.verify(user.hash, dto.password,)
        //se senha incorreta lancar exception
        if( !pwMatches) throw new ForbiddenException('Credentials Incorrect',);

        delete user.hash;

        //retornar user
        return user
    }
}
