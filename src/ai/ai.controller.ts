import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiRequest } from './dto';


@Controller('ai')
export class AiController {
    constructor(private aiService: AiService){};

    @Get('/message')
    getModelAnswer(@Body() data: AiRequest){
        return this.aiService.getModelAnswer(data.question);
    }

    @Get('/chat')
    getChatAnswer(@Body() data: AiRequest){
        return this.aiService.getModelChat(data.question, data.chat_history);
    }

}
