import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatMessageDto } from './dto';
import { ChatNextOutputDto } from './dto/chatNextOutput.dto';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { User } from '@prisma/client';
import { ChatSuggestionDto } from './dto/chatSuggestion.dto';

@UseGuards(JwtGuard)
@Controller('chat')
export class ChatController {
    constructor(private chatService: ChatService){}

    @Get('nextOutput')
    getNextOutput(@Body() data: ChatNextOutputDto){
        return this.chatService.getNextOutput(data);
    }


    @Post('questionAnswer')
    createQuestionAnswer(@GetUser('id') userId: number, @Body() data: ChatMessageDto){
        return this.chatService.createQuestionAnswer(userId,data);
    }

    @Post('saveNames')
    createSuggestions(@GetUser('id') userId:number, @Body() data: ChatSuggestionDto){
        return this.chatService.createSuggestion(userId,data);
    }

    @Get('getSuggestions')
    getSuggestions(@GetUser('id') userId:number){
        return this.chatService.getSuggestions(userId,true);
    }

    @Get('getIgnoreds')
    getIgnoreds(@GetUser('id') userId:number){
        return this.chatService.getSuggestions(userId,false);
    }
}
