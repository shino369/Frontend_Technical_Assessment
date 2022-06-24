import { LazyLoad } from 'routes';


export const LazyDoctor = LazyLoad(
  () => import('./index'),
  module => module.DoctorPage,
);
