import { IsArray, IsBoolean, IsEmail, IsNumber, IsOptional, IsString, isString } from "class-validator"

export class ChatSuggestionDto{

    @IsArray()
    names: string[];
    
    @IsBoolean()
    liked: boolean;

    
}