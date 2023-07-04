/** Helper function to parse receipt JSON */
export const PAYMENTMETHOD = {
    CASH: 'CASH',
    CASHLESS: 'CASHLESS',
    UNDEFINED: 'UNDEFINED',
}

/**
 * @param {Object} receipt 
 * @returns a javascript object containing:
 * 1. items: an array of objects containing the following fields:
 *    - name: (String) name of the item
 *    - price: (Number) price of the item
 *    - qty: (Number) quantity of the item
 * 2. other: an object containing the following fields:
 *    - subTotal: (Number) sub total of the receipt
 *    - total: (Number) total of the receipt
 *    - tax: (Number) tax of the receipt
 *    - serviceCharge: (Number) service charge of the receipt
 *    - discount: (Number) total discount of the receipt
 *    - paymentMethod: (String) payment method of the receipt
 *    - paidAmount: (Number) paid amount of the receipt
 *    - change: (Number) change of the receipt
 */
function receiptJsonParser(receipt) {
    const receiptLines = receipt[Object.keys(receipt)[0]]
    let purchasedItems = [];
    const other = {
        subTotal: 0,
        total: 0,
        tax: 0,
        serviceCharge: 0,
        discount: 0,
        paymentMethod: PAYMENTMETHOD.UNDEFINED,
        paidAmount: 0,
        change: 0,
    };
    const priceRegex = RegExp(/\d+[.,]\d\d/);
    const numberRegex = RegExp(/\d+/); // checks for any number

    /**
     *  Constants
     *  Adjust these to make the parser more/less sensitive
     */
    const QTY_DETECTION_THRESHOLD = 3; // number of characters at the front and back of each line to check for a quantity number
    const MAXIMUM_QTY_THRESHOLD = 99; // maximum quantity of an item, doesn't make sense to buy this many items.
    const MINIMUM_NAME_CHARACTER_THRESHOLD = 5; // minimum number of alphabetical characters in a valid item name

    /** 
     *  Helper Functions
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
        if (arr === null) {
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
            if (line === null) {
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
        if (line === null) {
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
        if (line === null) {
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
        let elements = line.split(/\s+/)
            .filter((word) => !!word); // make sure no undefined, null, or empty string
        // extract price
        for (let i = 0; i < elements.length; i++) {
            let element = elements[i];
            if (priceRegex.test(element)) {
                element = element.replaceAll(/[^\d.,]/g, ''); // clean non digits and non decimal points
                price = parseFloat(element);
                elements.splice(i, 1);
                break;
            }
        }

        // extract quantity, if any
        // quantity should be a number but not contain any non-digit characters
        let frontPointer = 0;
        let backPointer = elements.length - 1;
        let useFrontPointer = true;
        while (frontPointer <= backPointer) {
            let element = useFrontPointer ? elements[frontPointer] : elements[backPointer];
            // test for strings that:
            // 1. don't contain any non-digit characters, or
            // 2. end with an 'x'
            if (numberRegex.test(element) && (!/\D/.test(element) || /\d+[xX]$/.test(element))) {
                qty = parseInt(element);
                elements.splice(useFrontPointer ? frontPointer : backPointer, 1);
                break;
            }
            if (useFrontPointer) {
                frontPointer++;
            } else {
                backPointer--;
            }
            useFrontPointer = !useFrontPointer;
        }

        // extract name
        name = elements
            .filter((word) => cleanCurrrencySymbol(word))
            .join(' ');

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
        if (line === null) {
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
        return !(item.qty === 0 && item.price === 0.0);
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
            let currentPrice = purchasedItems[0].price;
            // 1. add itemPrice to currentPrice
            // 2. if currentPrice < targetPrice, increment endingPointer
            // 3. if currentPrice > targetPrice, increment startingPointer
            // 4. if currentPrice === targetPrice, return the chain of items
            while (endingPointer < purchasedItems.length) {
                if (currentPrice < targetPrice) {
                    endingPointer++;
                    if (endingPointer < purchasedItems.length) {
                        currentPrice += purchasedItems[endingPointer].price;
                    }
                } else if (currentPrice > targetPrice) {
                    currentPrice -= purchasedItems[startingPointer].price;
                    startingPointer++;
                } else if (purchasedItems[startingPointer].price === 0) {
                    // the target price is already hit.
                    // delete front items with 0 price because they do not contribute to the receipt.
                    startingPointer++;
                } else {
                    return purchasedItems.slice(startingPointer, endingPointer + 1);
                }
            }
            return null;
        }

        // basically dynamically program all results:
        // +(total/subtotal/paidAmount) +-(discount) +-(serviceCharge + tax) 

        const baseValues = [];
        if (other.total !== 0) {
            baseValues.push(other.total);
        }
        if (other.subTotal !== 0) {
            baseValues.push(other.subTotal);
        }
        if (other.paidAmount !== 0) {
            baseValues.push(other.paidAmount);
        }

        const discountValues = [];
        if (other.discount !== 0) {
            discountValues.push(other.discount);
            discountValues.push(-other.discount);
        }
        discountValues.push(0);

        const svcValues = [];
        if (other.serviceCharge !== 0) {
            svcValues.push(other.serviceCharge);
            svcValues.push(-other.serviceCharge);
        }
        svcValues.push(0);

        const taxValues = [];
        if (other.tax !== 0) {
            taxValues.push(other.tax);
            taxValues.push(-other.tax);
        }
        taxValues.push(0);

        // obtain an array of results where the target is hit
        const results = [];
        baseValues.forEach((base) => {
            discountValues.forEach((discount) => {
                svcValues.forEach((svc) => {
                    taxValues.forEach((tax) => {
                        const targetPrice = base + discount + svc + tax;
                        const obtained = findTarget(purchasedItems, targetPrice);
                        if (obtained != null && obtained.length > 0) {
                            results.push(obtained);
                        }
                    });
                });
            });
        });

        // return the result with the most number of items
        let max = 0;
        let targetItems = null;
        results.forEach((arr) => {
            if (arr.length > max) {
                max = arr.length;
                targetItems = arr;
            }
        });

        return targetItems;
    }

    const targetItems = aimToHitTarget(purchasedItems, other);
    if (targetItems != null) {
        purchasedItems = targetItems;
    }

    return {
        items: purchasedItems,
        other: other,
    };

}

export default receiptJsonParser;