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


@Injectable()
export class AiService {


    constructor(private config: ConfigService,
                private prisma: PrismaService,){

    }

    getModelAnswer(question:string){

        const template = "{question}";
        const prompt = new PromptTemplate({
            template: template,
            inputVariables: ["question"],
        });

        const model = new OpenAI({ openAIApiKey: this.config.get('OPENAI_API_KEY'), temperature: 0.9 });
        const chain = new LLMChain({ llm: model, prompt: prompt });
        console.log(question);
        const res = chain.call({ question: question });
        console.log(res);
        return res;
    }

    async getModelChat(input: string, chat_history: string){
        const memory = new ConversationSummaryMemory({
            memoryKey: "chat_history",
            llm: new OpenAI({ modelName: "gpt-3.5-turbo", temperature: 0 }),
          });

        memory.saveContext(
        {input: "The following is a friendly conversation between a human and an AI. The AI is talkative and provides lots of specific details from its context. If the AI does not know the answer to a question, it truthfully says it does not know.  Current conversation:"},
        {output: chat_history}
        );  


        const hist = await memory.loadMemoryVariables({});


        return {
            reply: response,
            history: hist,
        };
    }

    async getNamesSuggestion(userId : number){
        const contexts = await  this.prisma.context.findMany({
            where:{
                userId,
            },
        });
        const llm = new OpenAI({modelName: "gpt-3.5-turbo", openAIApiKey: this.config.get('OPENAI_API_KEY'), temperature: 1 });
        const memory = new ConversationSummaryMemory({
            memoryKey: "chat_history",
            llm
          });
          
          var template = "Sugira 3 nomes para o futuro filho do usuário, utilizando das informações obtidas no diálogo abaixo: \n ''' \n Devolva  uma resposta no formato JSON com os nomes num campo chamado 'names' e uma mensagem resposta em um campo chamado 'message'";
          contexts.forEach((context) =>{
                template += "IA: "+ context.question +" \n ";
                template += "Usuário: "+ context.answer +" \n ";
            });
          template += " \n ''' ";

          console.log(template);
          const prompt = new PromptTemplate({
              template: template,
              inputVariables: [""],
          });

          const chain = new LLMChain({ llm: llm, prompt: prompt });
          const response = await chain.call({});
          const retorno = JSON.parse(response.text);
          console.log(retorno);

          
        return {retorno};
    }

}
