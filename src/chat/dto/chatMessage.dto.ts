import { User } from "@prisma/client";
import { IsBoolean, IsEmail, IsNumber, IsOptional, IsString, isString } from "class-validator"

export class ChatMessageDto{

    @IsString()
    question: string;

    @IsString()
    answer: string;

}