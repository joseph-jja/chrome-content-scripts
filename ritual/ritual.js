const merchants  = document.querySelectorAll('[data-merchant-name]');

merchants.forEach(x => {
    const company = x.getAttribute('data-merchant-name');
    if (company.toLowerCase().indexOf('mixt') > -1) {
        x.style.display = 'none';
    } else if (company.toLowerCase().indexOf('proper food') > -1) {
        x.style.display = 'none';
    } else if (company.toLowerCase().indexOf('chipotle') > -1) {
        x.style.display = 'none';
    } else if (company.toLowerCase().indexOf('organic coup') > -1) {
        x.style.display = 'none';
    }
});

const searchBox = document.getElementById('field-search-city');
searchBox.value = '525 Market St, San Francisco, CA 94105, USA';
