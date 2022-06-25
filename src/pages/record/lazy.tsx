import { LazyLoad } from 'routes';


export const LazyRecord = LazyLoad(
  () => import('./index'),
  module => module.RecordPage,
);
