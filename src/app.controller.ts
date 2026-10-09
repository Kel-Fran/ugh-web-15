import { Body, Controller, Get, Post, Query, Render } from '@nestjs/common';
import { AppService } from './app.service.js';
import PRODUCTS from '../public/products.json' with {type: 'json'};

type _Product = typeof PRODUCTS[number]
interface Product extends _Product { }
type CreateProductDTO = { [k in keyof Product]?: string };
class CreateProductDto implements CreateProductDTO {
    name?: string;
    category?: string;
    price?: string;
    stock?: string;
}

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
    postNew(@Body() dto: CreateProductDto) {
        this.products.push({ name: dto.name ?? '', category: dto.category ?? '', price: +(dto.price ?? 0), stock: +(dto.stock ?? 0) });
        return {
            categories: this.products.map(it => it.category).filter((it, idx, arr) => arr.indexOf(it) === idx),
            message: 'success'

        }

    }

    @Get('stats')
    @Render('stats')
    getStats() {
        return {
            totalStock: this.products.reduce((acc, r) => acc + r.stock, 0),
            averagePrice: Math.round(this.products.reduce((acc, r) => acc + r.price, 0) / this.products.length),
            highestPrice: Math.max(...this.products.map(it => it.price)),
            lowestPrice: Math.min(...this.products.map(it => it.price)),

        }

    }
}
