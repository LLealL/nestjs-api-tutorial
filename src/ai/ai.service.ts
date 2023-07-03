import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OpenAI } from "langchain/llms/openai";
import { LLMChain } from "langchain/chains";
import { PromptTemplate } from "langchain/prompts";


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
}
