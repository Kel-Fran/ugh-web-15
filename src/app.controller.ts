import { Body, Controller, Get, Post, Query, Render } from '@nestjs/common';
import { AppService } from './app.service.js';
import PRODUCTS from '../public/products.json' with {type: 'json'};

type Product = typeof PRODUCTS[number]
type CreateProductDTO = { [k in keyof Product]?: string };

@Controller()
export class AppController {
    readonly products: Product[] = PRODUCTS;
    constructor(private readonly appService: AppService) { }

    @Get()
    @Render('product-list')
    getHello() {
        return {
            products: this.products.toSorted((a, b) => a.price - b.price)
        }
    }

    @Get('filter')
    @Render('filter')
    getFilter(@Query('category') category?: string) {
        return {
            categories: this.products.map(it => it.category).filter((it, idx, arr) => arr.indexOf(it) === idx),
            products: this.products.filter(it => it.category === category).toSorted((a, b) => b.stock - a.stock)

        }

    }

    @Get('new')
    @Render('new')
    getNew() {
        return {
            categories: this.products.map(it => it.category).filter((it, idx, arr) => arr.indexOf(it) === idx)

        }

    }
    @Post('new')
    @Render('new')
    postNew(@Body() dto: CreateProductDTO) {
        this.products.push({ name: dto.name ?? '', category: dto.category ?? '', price: +(dto.price ?? 0), stock: +(dto.stock ?? 0) });
        return {
            categories: this.products.map(it => it.category).filter((it, idx, arr) => arr.indexOf(it) === idx),
            message: 'success'

        }

    }
}
