import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Veiculo, VeiculoDocument } from './schemas/veiculo.schema';
import { CreateVeiculoDto } from 'src/veiculos/dto/create-veiculo.dto';

import { Acessorio, AcessorioDocument } from './schemas/acessorio.schema';
import { UpdateVeiculoDto } from './dto/update-veiculo.dto';
import { CreateAcessorioDto } from './dto/create-acessorio.dto';

@Injectable()
export class VeiculosService {
  constructor(
    @InjectModel(Veiculo.name) private veiculoModel: Model<VeiculoDocument>,
    @InjectModel(Acessorio.name) private acessorioModel: Model<AcessorioDocument>
  ) {}

  async create(createVeiculoDto: CreateVeiculoDto): Promise<Veiculo> {
    const newVeiculo = new this.veiculoModel(createVeiculoDto);
    return newVeiculo.save();
  }

  async findAll(): Promise<Veiculo[]> {
    return this.veiculoModel.find().populate('acessorios').exec();
  }

  async findOne(id: string): Promise<Veiculo> {
    return this.veiculoModel.findById(id).populate('acessorios').exec();
  }

  async update(id: string, updateVeiculoDto: UpdateVeiculoDto): Promise<Veiculo> {
    return this.veiculoModel.findByIdAndUpdate(id, updateVeiculoDto, { new: true }).exec();
  }

  async remove(id: string): Promise<Veiculo> {
    return this.veiculoModel.findByIdAndDelete(id).exec();
  }

  async addAcessorio(veiculoId: string, acessorioDto: CreateAcessorioDto): Promise<Veiculo> {
    const acessorio = new this.acessorioModel(acessorioDto);
    const veiculo = await this.veiculoModel.findById(veiculoId);
    veiculo.acessorios.push(acessorio);
    await acessorio.save();
    return veiculo.save();
  }

  async removeAcessorio(veiculoId: string, acessorioId: string): Promise<Veiculo> {
    const veiculo = await this.veiculoModel.findById(veiculoId);
    veiculo.acessorios = veiculo.acessorios.filter(ac => ac._id.toString() !== acessorioId);
    return veiculo.save();
  }
}
