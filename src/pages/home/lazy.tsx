import { LazyLoad } from 'routes';


export const LazyHome = LazyLoad(
  () => import('./index'),
  module => module.HomePage,
);
