import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConversationChain, LLMChain } from "langchain/chains";
import { ChatPromptTemplate, HumanMessagePromptTemplate, MessagesPlaceholder, PromptTemplate, SystemMessagePromptTemplate} from "langchain/prompts";
import { OpenAI } from 'langchain';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { BufferMemory, ConversationSummaryMemory } from "langchain/memory";
import { response } from 'express';


@Injectable()
export class AiService {


    constructor(private config: ConfigService){

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

}
