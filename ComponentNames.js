
class scrollName {
    constructor(wrappersAttr, options = {}) {
        // Default options 
        this.defaultOptions = {
            rootMargin: "0px",
            root: null,
            threshold: 0,
        }

        // Set init options as default
        this.options = this.defaultOptions;

        // Get user options
        this.userOptions = options;

        // Override options with given
        this.options = Object.assign(this.options, this.userOptions);

        // Find all necessary elements
        this.wrappersAttr = wrappersAttr;

        this.init();
    }

    init() {
        const wrappers = document.querySelectorAll(this.wrappersAttr);
        if (wrappers.length > 0) {
            wrappers.forEach(wrapper => {


                if ('IntersectionObserver' in window) {
                    // Create options for observer
                    const observerOptions = {
                        root: this.options.root,
                        rootMargin: this.options.rootMargin,
                        threshold: this.options.threshold
                    }

                    const wrapperObserver = new IntersectionObserver((entries, observer) => {

                        entries.forEach(entry => {

                            if (entry.isIntersecting) {

                                if (wrapper.getAttribute('data-scroll-names-active') != "true") {

                                    wrapper.setAttribute("data-scroll-names-active", "true");
                                    // Find all tabs elements
                                    // console.log(wrapper)
                                    this.json = wrapper.getAttribute('data-json');
                                    const names = JSON.parse(this.json);
                                    const length = names.length;

                                    if (length > 0) {

                                        // Dividing the board into two parts
                                        const half = Math.ceil(length / 2);

                                        const rows = [names.slice(0, half), ...[names.slice(half)]];

                                        const style = document.createElement('style');
                                        style.setAttribute('data-item', 'style')
                                        document.head.appendChild(style);

                                        // Create rows
                                        this.createRow(rows, wrapper);

                                    }
                                }
                            }
                        })
                    }, observerOptions)
                    wrapperObserver.observe(wrapper);
                }
            })
        }


    }

    createRow(rows, wrapper) {
        rows.forEach((row, index) => {

            const wrapperWidth = wrapper.offsetWidth;

            // create row
            const rowWrapper = document.createElement('div');
            rowWrapper.classList.add('names__row');

            const createdRow = row.length > 0 && this.createNames(row, rowWrapper, wrapper);
            const style = document.querySelector('[data-item="style"]');

            setTimeout(() => {
                console.log(createdRow.offsetWidth);

                // add animation to style tag
                style.textContent += `
                    .names__row:nth-child(${index + 1}) {
                        animation: scroll${index + 1} ${8 + (index * 2)}s linear infinite;
                    }

                    @keyframes scroll${index + 1} {
                        0% {
                            transform: translateX(0);
                        }

                        100% {
                            transform: translateX(calc(-${createdRow.offsetWidth}px));
                        }
                    }
                `;


                // add names if created row is to short
                this.cloneNames(createdRow, wrapperWidth, row, rowWrapper, wrapper);

                rowWrapper.classList.add('active');

            }, 300);


        });
    }

    cloneNames(createdRow, wrapperWidth, row, rowWrapper, wrapper) {
        // console.log(wrapper)
        if (createdRow.offsetWidth <= wrapperWidth * 2) {
            const newRow = this.createNames(row, rowWrapper, wrapper);

            this.cloneNames(newRow, wrapperWidth, row, rowWrapper, wrapper);

        }
    }

    createNames(row, rowWrapper, wrapper) {
        let namesList = '';

        // create names
        row.forEach((name) => {
            namesList += `<span class="names__item size-${name.score}">${name.name}</span>`
        });

        // Insert names
        rowWrapper.insertAdjacentHTML('beforeend', `${namesList}`);

        // Insert row
        wrapper.insertAdjacentElement('beforeend', rowWrapper);

        return rowWrapper;
    }

}


window.addEventListener('load', () => {
    new scrollName('[data-names="wrapper"]', {
        rootMargin: "0px",
    });
});