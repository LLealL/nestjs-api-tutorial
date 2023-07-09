import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { ChatNextOutputDto } from './dto/chatNextOutput.dto';
import { ChatMessageDto, ChatSuggestionDto } from './dto';

@Injectable()
export class ChatService {
    constructor(private prisma: PrismaService,
        private config: ConfigService,
        ){}

    getNextOutput(dto: ChatNextOutputDto){
        //criar perguntas
        const questions: string[]=
        ["Qual o seu país de origem?",
        "Existem algum nome ou herança cultural que você queira homenagear?",
        "Você quer que o nome tenha algum significado específico?",
        "Como voce se sente sobre nomes populares? ou voce prefere que o nome seja algo único?",
        "Você prefere nomes curtos ou longos?",
        "Tem alguma letra em particular que você não gosta em nomes?",
        "Existe um tema que voce esteja interessado? Por exmeplo, nomes relacionados a natureza, literatura, mitologia, etc.?",
        "Você quer um nome que possa ser facilmente encurtado para um apelido?",]
        //salvar usuario no db
        if(dto.getNextQuestion){
            if(dto.currentIndex>=questions.length-1){
                dto.getNextQuestion = false;
            }
            return {
                question: questions[dto.currentIndex+1],
                getNextQuestion: dto.getNextQuestion,
            }
        }
    }

    async createQuestionAnswer(userId: number, dto: ChatMessageDto){
        const context = await this.prisma.context.create({
            data:{
                userId,
                ...dto,
            },
        });

        return context;
    }

    async createSuggestion(userId: number, dto: ChatSuggestionDto){
        console.log(dto.names);
        if(dto.liked){
           delete dto.liked;
           const completed = await this.prisma.suggestion.create({
                data:{
                    userId,
                    ...dto,
                },
            });
            return completed;
        }else{
            delete dto.liked;
            const completed = await this.prisma.ignored.create({
                data:{
                    userId,
                    ...dto,
                },
            });
            return completed;
        }
    }

    async getSuggestions(userId: number,liked : boolean){
        if(liked){
           const suggestions = await this.prisma.suggestion.findMany({
                where: {
                    userId : userId,
                }
            });
            var names = [];
            suggestions.forEach((suggestion)=>{
                names = [...names, ...suggestion.names];
            }); 
            return Array.from(new Set(names));
        }else{
            const ignored = await this.prisma.ignored.findMany({
                where: {
                    userId,
                }
            });
            var names = [];
            ignored.forEach((suggestion)=>{
                names = [...names, ...suggestion.names];
            }); 
            return Array.from(new Set(names));
        }
    }


}
