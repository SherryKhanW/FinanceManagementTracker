const moneyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
});

export function formatMoney(amount: string | number) {
    const value = Number(amount);

    if (Number.isNaN(value)) {
        return moneyFormatter.format(0);
    }

    return moneyFormatter.format(value);
}

export function formatDate(date: string) {
    const value = new Date(`${date}T00:00:00`);

    if (Number.isNaN(value.getTime())) {
        return date;
    }

    return dateFormatter.format(value);
}
