import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AiService } from './ai.service';
import { GetUser } from '../auth/decorator';
import { User } from '@prisma/client';
import { JwtGuard } from '../auth/guard';
import { AiMessagesDto } from './dto';

@UseGuards(JwtGuard)
@Controller('ai')
export class AiController {
    constructor(private aiService: AiService){};

    @Get('/questions')
    getModelQuestions(){
        return this.aiService.getModelQuestions();
    }


    @Post('/names')
    getNamesSuggestion(@GetUser('id') userId: number, @Body() data: AiMessagesDto){
        return this.aiService.getNamesSuggestion(userId,data);
    }

}
