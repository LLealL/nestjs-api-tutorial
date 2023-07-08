import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class AiMessageDto{
    @IsNotEmpty()
    @IsString()
    sender:string;

    @IsNotEmpty()
    @IsString()
    text: string;
}
export class AiMessagesDto{
    @IsArray()
    messages: AiMessageDto[];
}