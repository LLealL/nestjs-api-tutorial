import { IsBoolean, IsEmail, IsNumber, IsOptional, IsString, isString } from "class-validator"

export class ChatNextOutputDto{

    
    @IsBoolean()
    getNextQuestion: boolean;
    
    @IsNumber()
    currentIndex: number;

    
}