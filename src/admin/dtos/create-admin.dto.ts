import {

} from 'class-validator';

import mongoose from 'mongoose';

export class CreateDoctorDto {
    user: mongoose.Types.ObjectId;

}
