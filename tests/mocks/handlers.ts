// import { http , HttpResponse} from 'msw';
// import { product } from './data';

import { db } from './db';

export const handlers = [
  ...db.product.toHandlers('rest'),
  ...db.category.toHandlers('rest'),
  // http.get('/categories', () => {
  //   return HttpResponse.json([
  //     { id: 1, name:'Electronics' },
  //     { id: 2, name:'Beauty' },
  //     { id: 3, name:'Gardening' },
  //   ])
  // }),

  // http.get('/products', () => {
  //   return HttpResponse.json()
  // }),

  // http.get('/products/:id', ({ params }) => { 
  //   const { id } = params;
  //   const product = products.find((p) => p.id === +id);

  //   if (!product ) {
  //     return new HttpResponse(null, {status : 404});
  //   }

  //   return HttpResponse.json(product);
  // })
]