import { Controller, Get, Render } from '@nestjs/common';
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
            products: this.products.toSorted((a,b) => a.price - b.price)
        }
    }
}
