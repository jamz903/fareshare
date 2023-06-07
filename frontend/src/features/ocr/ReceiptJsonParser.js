/** Helper function to parse receipt JSON */

function receiptJsonParser(receipt) {
    const receiptLines = receipt[Object.keys(receipt)[0]]
    const purchasedItems = [];
    let targetLines = 0;
    const priceRegex = RegExp(/\d+\.\d\d/);
    // const qtyRegex = RegExp(/[Qq](\S)*[Tt][Yy]/);
    // const obtainQtyRegex = RegExp(/\d+/);
    const qtyInFrontRegex = RegExp(/\d+\s/);
    const qtyInBackRegex = RegExp(/\s\d+/);
    const QTYDETECTIONTHRESHOLD = 2; // number of characters at the front and back of each line to check for a quantity number
    /*
    Object.keys(receiptLines).forEach((key) => {
        // iterate through whole receipt and attempt to obtain a quantity.
        if (qtyRegex.test(receiptLines[key])) {
            const qty = receiptLines[key].match(obtainQtyRegex)[0];
            if (targetLines < qty) {
                targetLines = qty;
            }
        }
    }); */
    // blacklist items that are not purchased items for quantity detection
    const blacklistedWords =
        ['subtotal', 'total', 'tax', 'mastercard', 'gst', 'visa', 'cash', 'points', 'earned', 'pos',
            'debit', 'change', 'credit', 'card', 'discount', 'balance', 'order',
            'dine in', 'take out', 'tip', 'receipt', 'thank you', 'paid', 'change', 'cashier', 'terminal', 'date'];
    // check for whole words only by converting list to regex
    const blacklistedRegex = blacklistedWords.map((word) => {
        return new RegExp('\\b' + word + '\\b');
    });

    const hasBlacklistedWord = (line) => {
        return blacklistedRegex.some((regex) => {
            return regex.test(line.toLowerCase());
        });
    }
    Object.keys(receiptLines).forEach((key) => {
        // iterate through whole receipt and obtain lines where a price or number is detected.
        const line = receiptLines[key];
        if (line == null) {
            // do nothing
        } else if (priceRegex.test(line) && !hasBlacklistedWord(line)) {
            // check for price
            purchasedItems.push(line);
        } else if (qtyInFrontRegex.test(line.substring(0, QTYDETECTIONTHRESHOLD)) && !hasBlacklistedWord(line)) {
            // check for quantity at the front of string
            purchasedItems.push(line);
        } else if (qtyInBackRegex.test(line.substring(line.length - QTYDETECTIONTHRESHOLD)) && !hasBlacklistedWord(line)) {
            // check for quantity at the end of string
            purchasedItems.push(line);
        }
    });
    // iterate through obtained lines and separate item name from price.
    const itemsWithNameAndPrice = [];
    purchasedItems.forEach((item, index) => {
        let price = 0;
        let name = item;
        const priceArr = item.match(priceRegex);
        // if there's a price, remove it from the item name
        if (priceArr != null) {
            price = priceArr[0];
            name = item.replace(price, '');
        }
        itemsWithNameAndPrice.push({ name, price });
    });
    console.log(itemsWithNameAndPrice);
    return itemsWithNameAndPrice;
}

export default receiptJsonParser;