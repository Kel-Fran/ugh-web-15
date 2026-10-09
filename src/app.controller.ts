import { Controller, Get, Query, Render } from '@nestjs/common';
import { AppService } from './app.service.js';
import PRODUCTS from '../public/products.json' with {type: 'json'};

type Product = typeof PRODUCTS[number]

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
}
