/** Helper function to parse receipt JSON */

function receiptJsonParser(receipt) {
    const receiptLines = receipt[Object.keys(receipt)[0]]
    let purchasedItems = [];
    const PAYMENTMETHOD = {
        CASH: 'CASH',
        CASHLESS: 'CASHLESS',
        UNDEFINED: 'UNDEFINED',
    }
    const other = {
        subTotal: 0,
        total: 0,
        tax: 0,
        serviceCharge: 0,
        totalDiscount: 0,
        paymentMethod: PAYMENTMETHOD.UNDEFINED,
        paidAmount: 0,
        change: 0,
    };
    const priceRegex = RegExp(/\d+\.\d\d/);
    const numberRegex = RegExp(/\d+/); // checks for any number
    const qtyRegex = RegExp(/(?<!\S)\d+(?!\S)/); // checks for a number that is not surrounded by any non-whitespace character

    /**
     *  Constants
     *  Adjust these to make the parser more/less sensitive
     */
    const QTY_DETECTION_THRESHOLD = 3; // number of characters at the front and back of each line to check for a quantity number
    const MAXIMUM_QTY_THRESHOLD = 99; // maximum quantity of an item, doesn't make sense to buy this many items.
    const MINIMUM_NAME_CHARACTER_THRESHOLD = 5; // minimum number of alphabetical characters in a valid item name

    /** 
     * Helper Functions 
     */

    const hasSubTotal = (line) => {
        const regex = RegExp(/sub\s*total/, 'i');
        return regex.test(line);
    }

    const hasTotal = (line) => {
        const regex = RegExp(/total/, 'i');
        return regex.test(line);
    }

    const hasTax = (line) => {
        const regex1 = RegExp(/tax/, 'i');
        const regex2 = RegExp(/gst/, 'i');
        return regex1.test(line) || regex2.test(line);
    }

    const hasServiceCharge = (line) => {
        const regex = RegExp(/service\s*charge/, 'i');
        return regex.test(line);
    }

    const hasDiscount = (line) => {
        const regex1 = RegExp(/discount/, 'i');
        const regex2 = RegExp(/promo/, 'i');
        const regex3 = RegExp(/voucher/, 'i');
        const regex4 = RegExp(/coupon/, 'i');
        const regex5 = RegExp(/rebate/, 'i');
        const regex6 = RegExp(/points/, 'i');
        return regex1.test(line) || regex2.test(line) || regex3.test(line) || regex4.test(line) || regex5.test(line) || regex6.test(line);
    }

    const hasCashless = (line) => {
        const regexs = [/card/, /visa/, /mastercard/, /debit/, /credit/, /nets/,
            /paynow/, /grabpay/, /favepay/, /paylah/, /paywave/, /paypass/,
            /apple pay/, /google pay/, /alipay/, /wechat pay/, /shopee\s*pay/, /paypal/, /lazada\s*pay/];
        return regexs.some((r) => {
            const regex = RegExp(r, 'i');
            return regex.test(line);
        })
    }

    const hasCash = (line) => {
        const regex = RegExp(/cash/, 'i');
        return regex.test(line);
    }

    const hasPaid = (line) => {
        const regex = RegExp(/paid/, 'i');
        return regex.test(line);
    }

    const hasChange = (line) => {
        const regexes = [/change/, /chng/, /chg/, /chnge/];
        return regexes.some((r) => {
            const regex = RegExp(r, 'i');
            return regex.test(line);
        });
    }

    // blacklist items that are not purchased items for quantity detection
    const blacklistedWords =
        ['earned', 'pos', 'balance', 'order', 'dine in', 'take out', 'tip', 'receipt', 'thank you', 'cashier', 'terminal', 'date'];
    // check for whole words only by converting list to regex
    const blacklistedRegex = blacklistedWords.map((word) => {
        return new RegExp('\\b' + word + '\\b');
    });

    const hasBlacklistedWord = (line) => {
        return blacklistedRegex.some((regex) => {
            return regex.test(line.toLowerCase());
        });
    }

    const hasNumber = (str) => {
        return numberRegex.test(str);
    }

    function cleanCurrrencySymbol(line) {
        // copilot generated these symbols
        const regexes = [/\$/, /¥/, /£/, /€/, /₩/, /₹/, /₱/, /₽/, /฿/, /₺/, /₴/, /₫/, /₭/, /₦/, /₡/, /₲/, /₵/, /₸/, /₼/, /₢/, /₤/, /₮/, /₩/, /₪/, /₯/, /₠/, /₧/, /₣/, /₰/, /₲/, /₳/, /₶/, /₷/, /₹/, /₺/, /₻/, /₼/, /₽/, /₾/, /₿/];
        return regexes.reduce((acc, regex) => {
            return acc.replace(regex, '');
        }, line);
    }

    function hasValidName(name) {
        const alphabetRegex = RegExp(/[a-z]/, 'gi');
        const arr = name.match(alphabetRegex);
        if (arr == null) {
            return false;
        }
        return name.match(alphabetRegex).length > MINIMUM_NAME_CHARACTER_THRESHOLD
    }

    // recursive function to look backwards for a valid name
    function lookBackwardsForName(keyNumber) {
        if (keyNumber < 0) {
            return '';
        } else {
            const line = receiptLines[keyNumber.toString()];
            if (line == null) {
                // empty line, go next
                return lookBackwardsForName(keyNumber - 1);
            } else if (priceRegex.test(line)) {
                // exit when you hit another price
                return '';
            } else if (hasValidName(line)) {
                // found a valid name
                return line;
            } else {
                return '';
            }
        }
    }

    /** 
     *  Beginning of Algorithm 
     */

    // 1.  Iterate through receipt to find payment method, this will determine how much the user paid
    // 1.1 CASES:   1. has 'PAID' but no indication of payment method, assume undefined
    //              2. has 'PAID' and indication of payment method, assume that payment method
    //              3. has no 'PAID' but indication of payment method, assume that payment method
    // 1.2 For cash or undefined, need find change amt
    // 1.3 This step also acts like a blacklist, removing all lines that are not purchased items
    Object.keys(receiptLines).forEach((key) => {
        const line = receiptLines[key];
        if (line == null) {
            // do nothing
        } else {
            if (hasPaid(line)) {
                // this will obtain the last 'PAID' amount, which should be fine.
                const priceArr = line.match(priceRegex);
                if (priceArr != null) {
                    other.paidAmount = parseFloat(priceArr[0]);
                }
            } else if (hasCashless(line)) {
                other.paymentMethod = PAYMENTMETHOD.CASHLESS;
                const priceArr = line.match(priceRegex);
                if (priceArr != null) {
                    other.paidAmount = parseFloat(priceArr[0]);
                }
                receiptLines[key] = null;
            } else if (hasCash(line)) {
                other.paymentMethod = PAYMENTMETHOD.CASH;
                const priceArr = line.match(priceRegex);
                if (priceArr != null) {
                    other.paidAmount = parseFloat(priceArr[0]);
                }
                receiptLines[key] = null;
            } else if (hasChange(line)) {
                const priceArr = line.match(priceRegex);
                if (priceArr != null) {
                    other.change = parseFloat(priceArr[0]);
                }
                receiptLines[key] = null;
            }
        }
        // calculate actual paid amount
        if (other.paymentMethod === PAYMENTMETHOD.CASH || other.paymentMethod === PAYMENTMETHOD.UNDEFINED) {
            other.paidAmount = other.paidAmount - other.change;
        }
    });
    // 2. Iterate through receipt to find subtotal, total, tax, service charge, and discount, and remove them from the receipt
    //    This step acts like a blacklist, removing all lines that are not purchased items
    Object.keys(receiptLines).forEach((key) => {
        const line = receiptLines[key];
        if (line == null) {
            // do nothing
        } else {
            if (hasSubTotal(line)) {
                const priceArr = line.match(priceRegex);
                if (priceArr != null) {
                    other.subTotal = parseFloat(priceArr[0]);
                }
                receiptLines[key] = null;
            } else if (hasTotal(line)) {
                const priceArr = line.match(priceRegex);
                if (priceArr != null) {
                    other.total = parseFloat(priceArr[0]);
                }
                receiptLines[key] = null;
            } else if (hasTax(line)) {
                const priceArr = line.match(priceRegex);
                if (priceArr != null) {
                    other.tax = parseFloat(priceArr[0]);
                }
                receiptLines[key] = null;
            } else if (hasServiceCharge(line)) {
                const priceArr = line.match(priceRegex);
                if (priceArr != null) {
                    other.serviceCharge = parseFloat(priceArr[0]);
                }
                receiptLines[key] = null;
            } else if (hasDiscount(line)) {
                const priceArr = line.match(priceRegex);
                if (priceArr != null) {
                    other.discount = parseFloat(priceArr[0]);
                }
                receiptLines[key] = null;
            }
        }
    });

    const processLine = (line, key) => {
        // process line to obtain name, quantity, price
        let price = 0.0;
        let name = '';
        let qty = 0;
        const priceArr = line.match(priceRegex);
        if (priceArr != null) {
            price = parseFloat(priceArr[0]);
            line = line.replace(priceArr[0], '');
        }
        // quantity can be either in the front or back
        const frontSubstring = line.substring(0, QTY_DETECTION_THRESHOLD);
        const backSubstring = line.substring(line.length - QTY_DETECTION_THRESHOLD);
        if (hasNumber(frontSubstring)) {
            // find the first qty number in the whole string
            const qtyArr = line.match(qtyRegex);
            if (qtyArr != null) {
                const word = qtyArr[0];
                qty = parseInt(word);
                line = line.replace(word, '');
            }
        } else if (hasNumber(backSubstring)) {
            // find the last qty number in the whole string
            const qtyArr = line.match(qtyRegex);
            if (qtyArr != null) {
                const word = qtyArr[qtyArr.length - 1];
                qty = parseInt(word);
                line = line.replace(word, '');
            }
        }

        // process name
        // clean currency symbols first
        line = cleanCurrrencySymbol(line);
        name = line.trim();
        // check name for minimum required length
        if (!hasValidName(name)) {
            const prevKey = parseInt(key) - 1;
            name = lookBackwardsForName(prevKey);
        }
        return {
            name,
            qty,
            price
        };
    };


    // 3.   Iterate through receipt to find purchased items (lines with prices, or lines with quantities)
    Object.keys(receiptLines).forEach((key) => {
        let line = receiptLines[key];
        if (line == null) {
            // do nothing
        } else if (priceRegex.test(line)) {
            // found a line with a price
            purchasedItems.push(processLine(line, key));
        } else if (hasBlacklistedWord(line)) {
            // do nothing
        } else if (numberRegex.test(line.substring(0, QTY_DETECTION_THRESHOLD)) || numberRegex.test(line.substring(line.length - QTY_DETECTION_THRESHOLD))) {
            // found a line with a number (in front or behind). 
            // IMPORTANT: this may not produce a valid quantity, hence we filter out all items with no quantity and price later.
            purchasedItems.push(processLine(line, key));
        }
    });

    // 4. Filter out all items with an invalid quantity
    purchasedItems = purchasedItems.filter((item) => {
        return item.qty >= 0 && item.qty < MAXIMUM_QTY_THRESHOLD;
    });

    // 5. Filter out all items that have no quantity and price.
    purchasedItems = purchasedItems.filter((item) => {
        return !(item.qty == 0 && item.price == 0.0);
    });

    // 6.   Aim to hit a target price, if possible
    // 6.1  Determine a target price
    // 6.2  Find an exact match for target price. 
    //      If no exact match is found, abort the operation.
    function aimToHitTarget(purchasedItems, other) {
        // this function should return a non-empty array of purchased items if it is able to hit a target price.
        // otherwise, it will return null.
        function findTarget(purchasedItems, targetPrice) {
            // find a chain of items where the prices add up to the target price
            // return null if no such chain exists
            let endingPointer = 0;
            let startingPointer = 0;
            let currentPrice = 0.0;
            // 1. add itemPrice to currentPrice
            // 2. if currentPrice < targetPrice, increment endingPointer
            // 3. if currentPrice > targetPrice, increment startingPointer
            // 4. if currentPrice == targetPrice, return the chain of items
            while (endingPointer < purchasedItems.length) {
                const itemPrice = purchasedItems[endingPointer].price;
                currentPrice += itemPrice;
                if (currentPrice < targetPrice) {
                    endingPointer++;
                } else if (currentPrice > targetPrice) {
                    currentPrice -= purchasedItems[startingPointer].price;
                    startingPointer++;
                } else if (purchasedItems[startingPointer].price == 0) {
                    // the target price is already hit.
                    // delete front items with 0 price because they do not contribute to the receipt.
                    startingPointer++;
                } else {
                    return purchasedItems.slice(startingPointer, endingPointer + 1);
                }
            }
            return null;
        }

        let paid = 0;
        if (other.paidAmount != 0) {
            paid = other.paidAmount;
        } else if (other.total != 0) {
            paid = other.total;
        } else if (other.subTotal != 0) {
            paid = other.subTotal;
        } else {
            return null;
        }

        const withoutTaxOrSvc = findTarget(purchasedItems, paid);
        const withTaxOnly = other.tax != 0 ? findTarget(purchasedItems, paid + other.tax) : null;
        const withSvcOnly = other.serviceCharge != 0 ? findTarget(purchasedItems, paid + other.serviceCharge) : null;
        const withTaxAndSvc = other.tax != 0 && other.serviceCharge != 0 ? findTarget(purchasedItems, paid + other.tax + other.serviceCharge) : null;
        return withoutTaxOrSvc != null
            ? withoutTaxOrSvc
            : withTaxOnly != null
                ? withTaxOnly
                : withSvcOnly != null
                    ? withSvcOnly
                    : withTaxAndSvc != null
                        ? withTaxAndSvc
                        : null;
    }

    const targetItems = aimToHitTarget(purchasedItems, other);
    if (targetItems != null) {
        purchasedItems = targetItems;
    }

    console.log(purchasedItems);
    console.log(other);
    return {
        items: purchasedItems,
        other: other,
    };


}

export default receiptJsonParser;