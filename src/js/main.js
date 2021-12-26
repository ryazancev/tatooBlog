import '../scss/main.scss';
import '../index.html';

import accordion from "./modules/accordion";
import sliders from "./modules/sliders";
import faqMore from "./modules/faqMore";

document.addEventListener('DOMContentLoaded', () => {
    faqMore();
    accordion();
    sliders();
});