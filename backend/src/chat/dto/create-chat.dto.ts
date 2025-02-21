import { IsNotEmpty } from "class-validator";

export class CreateChatDto {
    @IsNotEmpty()
    readonly room!: string;

    @IsNotEmpty()
    readonly content!: string;
}
