import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConversationChain, LLMChain } from "langchain/chains";
import { ChatPromptTemplate, HumanMessagePromptTemplate, MessagesPlaceholder, PromptTemplate, SystemMessagePromptTemplate} from "langchain/prompts";
import { OpenAI } from 'langchain';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { BufferMemory, ConversationSummaryMemory } from "langchain/memory";
import { response } from 'express';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AiMessagesDto } from './dto';


@Injectable()
export class AiService {


    constructor(private config: ConfigService,
                private prisma: PrismaService,){

    }

    async getModelQuestions(){

        const llm = new OpenAI({modelName: "gpt-3.5-turbo", openAIApiKey: this.config.get('OPENAI_API_KEY'), temperature: 1 });
        const memory = new ConversationSummaryMemory({
            memoryKey: "chat_history",
            llm
          });
          
          var template = "Crie 8 perguntas relevantes a escolha de nomes para um filho(a) do usuário que irá responde-las. Devolva uma resposta no formato JSON com as perguntas num campo chamado 'questions'";

          const prompt = new PromptTemplate({
              template: template,
              inputVariables: [""],
            });
            
        console.log(template);
          const chain = new LLMChain({ llm: llm, prompt: prompt });

            const response = await chain.call({});
            console.log(response);
            const retorno = JSON.parse(response.text);
            console.log(retorno);
            return retorno;


        return {};
    }

    async getNamesSuggestion(userId : number, dto: AiMessagesDto){
        /*const contexts = await  this.prisma.context.findMany({
            where:{
                userId,
            },
        });*/
        const llm = new OpenAI({modelName: "gpt-3.5-turbo", openAIApiKey: this.config.get('OPENAI_API_KEY'), temperature: 1 });
        const memory = new ConversationSummaryMemory({
            memoryKey: "chat_history",
            llm
          });
          
          var template = "Sugira 3 nomes para o futuro filho do usuário, utilizando das informações obtidas no diálogo abaixo: \n ''' \n ";
          /*contexts.forEach((context) =>{
                template += "IA: "+ context.question +" \n ";
                template += "Usuário: "+ context.answer +" \n ";
            });*/
            dto.messages.forEach((message) =>{
                template += message.sender + ": "+message.text + " \n ";
            });
          template += " \n ''' \n Caso já exista sugestões de nomes na conversa crie nomes diferentes \n Devolva uma resposta no formato JSON com os nomes num campo chamado 'names' e uma mensagem resposta em um campo chamado 'message' concatenando nela os respectivos nomes";

          console.log(template);
          const prompt = new PromptTemplate({
              template: template,
              inputVariables: [""],
          });

          const chain = new LLMChain({ llm: llm, prompt: prompt });
          const response = await chain.call({});
          console.log(response);
          const retorno = JSON.parse(response.text);
          console.log(retorno);

          
        return {retorno};
    }

}
