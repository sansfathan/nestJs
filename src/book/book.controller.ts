import {
  Body,
  Controller,
  Get,
  Param,
  // Query,
  Post,
  Put,
  Delete,
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreatedBookDto, FindBookDto, UpdateBookDto } from './book.dto';
import { Pagination } from 'src/utils/decorator/pagination.decorator';

@Controller('book')
export class BookController {
  constructor(private bookService: BookService) {}

  @Get('list')
  getAllBooks(@Pagination() query: FindBookDto) {
    console.log('query =>', query);
    return this.bookService.getAllBooks(query);
  }

  @Post('create')
  createBook(@Body() payload: CreatedBookDto) {
    // return payload;
    return this.bookService.create(payload);
  }

  @Get('detail/:id')
  findOneBook(@Param('id') id: string) {
    return this.bookService.getDetail(Number(id));
  }
  @Put('update/:id')
  updateBook(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.bookService.updateBook(Number(id), updateBookDto);
  }
  @Delete('delete/:id')
  deleteBook(@Param('id') id: string) {
    return this.bookService.deleteBook(+id);
  }
}
