import Swiper, { Navigation, Pagination } from 'swiper';

const sliders = () => {
    // Главный слайдер
    new Swiper('.work__slider', {
        modules: [Navigation, Pagination],
        speed: 500,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        pagination: {
            el: '.swiper-pagination',
            type: 'bullets',
            clickable: true
        },
        a11y: {
            prevSlideMessage: 'Previous slide',
            nextSlideMessage: 'Next slide',
        },
        breakpoints: {
            320: {
                slidesPerView: 1,
            },
            768: {
                slidesPerView: 2,
                spaceBetween: 20
            },
            1280: {
                slidesPerView: 3,
                spaceBetween: 30
            },
            1440: {
                slidesPerView: 4,
                spaceBetween: 20
            }
        }
    });
};

export default sliders;