import mongoose, { ObjectId } from 'mongoose';

interface IImagePath {
  fileName: string;
  originName: string;
}

export interface IProduct {
  _id: ObjectId;
  title: string;
  image: IImagePath;
  category: string;
  description?: string;
  price: number | null;
}

const productSchema = new mongoose.Schema<IProduct>({
  title: {
    type: String,
    required: [true, 'Поле title должно быть заполнено'],
    unique: true,
    minlength: [2, 'Минимальная длина поля title - 2'],
    maxlength: [30, 'Максимальна длина поля title - 30'],
    trim: true,
  },
  image: {
    fileName: {
      type: String,
      required: [true, 'Поле fileName должно быть заполнено'],
    },
    originName: {
      type: String,
      default: '',
    },
  },
  category: {
    type: String,
    required: [true, 'Поле category должно быть заполнено'],
    trim: true,
  },
  description: {
    type: String,
    default: '',
    trim: true,
  },
  price: {
    type: Number,
    default: null,
    min: 0,
  },
});

export default mongoose.model<IProduct>('product', productSchema);
