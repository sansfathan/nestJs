import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './book.entity';
import { Between, Like, Repository } from 'typeorm';
import { ResponsePagination, ResponseSuccess } from 'src/interface/response';
import { FindBookDto, UpdateBookDto } from './book.dto';
import BaseResponse from 'src/utils/response/base.response';
@Injectable()
export class BookService extends BaseResponse {
  constructor(
    @InjectRepository(Book) private readonly bookRepository: Repository<Book>,
  ) {
    super();
  }
  async getAllBooks(query: FindBookDto): Promise<ResponsePagination> {
    const { page, pageSize, limit, title, author, from_year, to_year } = query;

    console.log('query =>', query);

    const filter: {
      [key: string]: any;
    } = {};

    if (title) {
      filter.title = Like(`%${title}%`);
    }
    if (author) {
      filter.author = Like(`%${author}%`);
    }

    if (from_year && to_year) {
      filter.year = Between(from_year, to_year);
    }

    if (from_year && !!to_year === false) {
      filter.year = Between(from_year, from_year);
    }
    const total = await this.bookRepository.count({ where: filter });
    const books = await this.bookRepository.find({
      where: filter,
      skip: limit,
      take: pageSize,
    });
    return this._pagination(
      'List Buku Di temukan ',
      books,
      total,
      page,
      pageSize,
    );
  }

  async create(payload: any): Promise<ResponseSuccess> {
    try {
      await this.bookRepository.save(payload);
      // return {
      //   status: 'Success',
      //   message: 'berhasil menambahkan data',
      // };
      return this._successCreate('berhasil create');
    } catch (error) {
      throw new HttpException('ada kesalahan', HttpStatus.BAD_REQUEST);
    }
  }
  async getDetail(id: number): Promise<ResponseSuccess> {
    const detailBook = await this.bookRepository.findOne({
      where: {
        id,
      },
    });

    if (detailBook === null) {
      throw new NotFoundException(`Buku dengan id ${id} tidak ditemukan`);
    }
    return {
      status: 'Success',
      message: 'Detail Buku ditermukan',
      data: detailBook,
    };
  }
  async updateBook(
    id: number,
    updateBookDto: UpdateBookDto,
  ): Promise<ResponseSuccess> {
    const check = await this.bookRepository.findOne({
      where: {
        id,
      },
    });

    if (!check)
      throw new NotFoundException(`Buku dengan id ${id} tidak ditemukan`);

    const update = await this.bookRepository.save({ ...updateBookDto, id: id });
    return {
      status: `Success `,
      message: 'Buku berhasil di update',
      data: update,
    };
  }
  async deleteBook(id: number): Promise<ResponseSuccess> {
    const check = await this.bookRepository.findOne({
      where: {
        id,
      },
    });

    if (!check)
      throw new NotFoundException(`Buku dengan id ${id} tidak ditemukan`);
    await this.bookRepository.delete(id);
    return {
      status: `Success `,
      message: 'Berhasil menghapus buku',
    };
  }

  // async update()
}
