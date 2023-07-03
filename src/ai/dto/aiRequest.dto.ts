import { IsNotEmpty, IsString } from "class-validator";

export class AiRequest{
    
    @IsString()
    @IsNotEmpty()
    question: string;
}