import type { StrapiApp } from '@strapi/strapi/admin';
import ptBRTranslation from './extensions/translations/pt-BR.json';

export default {
  config: {
    locales: [
      'en',
      'pt-BR',
    ],
    tutorials: false,
    notifications: { releases: false },
    translations: {
      'pt-BR': ptBRTranslation,
    },
  },
  bootstrap(app: StrapiApp) {
    console.log(app);
  },
};
