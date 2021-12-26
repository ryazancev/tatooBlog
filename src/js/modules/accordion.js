const accordion = () => {
    const acc = document.querySelectorAll('.accordion');

    acc.forEach(item => {
        item.addEventListener('click', () => {
            item.classList.toggle('active');

            const panel = item.nextElementSibling;

            if (panel.style.maxHeight){
                panel.style.maxHeight = null;
            } else {
                panel.style.maxHeight = panel.scrollHeight + "px";
            }
        })
    });
};

export default accordion;