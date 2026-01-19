import mongoose, { ObjectId } from 'mongoose';

interface IImagePath {
  fileName: string;
  originalName: string;
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
    required: true,
    unique: true,
    minlength: 2,
    maxlength: 30,
    trim: true,
  },
  image: {
    fileName: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
      default: '',
    },
  },
  category: {
    type: String,
    required: true,
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
