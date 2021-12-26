const faqMore = () => {
    const faqMoreBtn = document.querySelector('.faq__more');
    const faqWrapper = document.querySelector('.faq__wrapper');

    const openWrapperHandler = () => {
        faqWrapper.classList.add('open');
        faqMoreBtn.removeEventListener('click', openWrapperHandler);
        faqMoreBtn.remove();
    };

    faqMoreBtn.addEventListener('click', openWrapperHandler);

};

export default faqMore;