const stockList = ["AAPL", "GOOG", "MSFT", "TSLA"];

let validationList;

const createValidation = function () {
    $.ajax({
        url: `https://api.iextrading.com/1.0/ref-data/symbols`,
        method: 'GET'
    }).then(function (response) {
        validationList = response
        
        // response.forEach(function (element) {
        //     validationList.push(element.symbol);
        // })

        pushButtons(validationList);


    });
    
};

const createButtons = function () {

    $('.stockButtons').empty();
    for (let i = 0; i < stockList.length; i++) {

        let newButton = $('<button>');

        newButton.addClass('stock');

        newButton.attr('data-name', stockList[i]);

        newButton.text(stockList[i]);

        $('.stockButtons').append(newButton);
    }
};


const runQuery = function (event) {

    event.preventDefault();

    const stock = $()
    const queryURL = `https://api.iextrading.com/1.0/stock/${stock}/batch?types=quote,news&range=1m&last=10`;

    
    $.ajax({
        url: queryURL,
        method: 'GET'
    }).then(function (response) {


        $('.stockInfo').text(JSON.stringify(response));
    })

};

const pushButtons = function (validationList) {
    $("#addStock").on('click', function () {
        
        
        let input = $('#inputStock').val().toUpperCase();

        for (let i = 0; i < validationList.length; i++) {
            if (input === validationList[i].symbol) {
                stockList.push(input)
                
                createButtons();
            }
        }
    })

};


const displayInfo = function () {
    const stock = $(this).attr("data-name");
    const queryURL = `https://api.iextrading.com/1.0/stock/${stock}/batch?types=quote,news&range=1m&last=10`;

    $.ajax({
        url: queryURL,
        method: 'GET'
    }).then(function (response) {
       console.log(response)
        const stockDiv = $('<div>').addClass('stock');

        const companyName = response.quote.companyName;
        const nameHolder = $('<p>').text(`Company Name: ${companyName}`);
        stockDiv.append(nameHolder);

        const stockSymbol = response.quote.symbol;
        const symbolHolder = $('<p>').text(`Stock Symbol: ${stockSymbol}`);
        stockDiv.append(symbolHolder);

        const stockPrice = response.quote.latestPrice;
        const priceHolder = $('<p>').text(`Stock Price: ${stockPrice}`);
        stockDiv.append(priceHolder);

        
        const newsBin = $('<div class="newsBin">');
        for(let i=0; i<response.news.length; i++){
            newsBin.append(`<p>${response.news[i].summary}</p>`)
        }
        stockDiv.append(newsBin);

        $('#stockInfo').html(stockDiv);
    });


}

// Executions:

createButtons();
$('.stockButtons').on('click', '.stock', displayInfo);
createValidation();

