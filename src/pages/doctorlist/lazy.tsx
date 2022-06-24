import { LazyLoad } from 'routes';


export const LazyDoctorList = LazyLoad(
  () => import('./index'),
  module => module.DoctorListPage,
);
